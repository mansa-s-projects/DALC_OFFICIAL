# DALC WebP Conversion & Image Optimization Script
# Converts JPG/PNG to WebP and generates image manifest

param(
    [switch]$IncludeExisting = $false,
    [switch]$DryRun = $false,
    [int]$Quality = 85,
    [string]$TargetDir = "$PSScriptRoot\..\public\images"
)

$ErrorActionPreference = "Continue"

# Requirements check
function Test-Requirements {
    Write-Host "🔍 Checking dependencies..." -ForegroundColor Cyan

    # Check for imagemagick/cwebp
    $cwebpPath = (Get-Command cwebp -ErrorAction SilentlyContinue)
    if (-not $cwebpPath) {
        Write-Host "❌ cwebp not found. Install via: choco install libwebp" -ForegroundColor Red
        Write-Host "   Or download from: https://developers.google.com/speed/webp/download" -ForegroundColor Yellow
        return $false
    }

    Write-Host "✅ cwebp found: $($cwebpPath.Source)" -ForegroundColor Green
    return $true
}

# Convert single image to WebP
function Convert-ToWebP {
    param(
        [string]$SourcePath,
        [string]$TargetPath,
        [int]$Quality
    )

    try {
        # Create target directory if needed
        $targetDir = Split-Path $TargetPath
        if (-not (Test-Path $targetDir)) {
            New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
        }

        # Convert using cwebp
        & cwebp -q $Quality "$SourcePath" -o "$TargetPath" 2>$null

        if (Test-Path $TargetPath) {
            $fileSize = (Get-Item $TargetPath).Length
            return @{
                success = $true
                filesize = $fileSize
                message = "Converted successfully"
            }
        }
    }
    catch {
        return @{
            success = $false
            message = "Conversion error: $_"
        }
    }

    return @{
        success = $false
        message = "Unknown error"
    }
}

# Generate image metadata
function Get-ImageMetadata {
    param(
        [string]$ImagePath,
        [string]$RelativePath,
        [string]$Source = "unknown"
    )

    try {
        $file = Get-Item $ImagePath
        $fileSize = $file.Length

        # Try to get dimensions (requires imagemagick or manual dimension parsing)
        # For now, return basic info
        return @{
            filename = $file.Name
            path = $RelativePath
            filesize = $fileSize
            format = $file.Extension.TrimStart('.')
            lastModified = $file.LastWriteTime.ToString("o")
            source = $Source
            valid = $fileSize -gt 0
        }
    }
    catch {
        return @{
            filename = (Split-Path $ImagePath -Leaf)
            path = $RelativePath
            valid = $false
            error = $_.Exception.Message
        }
    }
}

# Main conversion process
function Start-Conversion {
    param(
        [string]$SourceDir,
        [int]$Quality
    )

    Write-Host "`n📦 Starting WebP conversion..." -ForegroundColor Cyan

    $jpgFiles = Get-ChildItem -Path $SourceDir -Recurse -Filter "*.jpg" -ErrorAction SilentlyContinue
    $pngFiles = Get-ChildItem -Path $SourceDir -Recurse -Filter "*.png" -ErrorAction SilentlyContinue

    $allFiles = @($jpgFiles) + @($pngFiles)
    $total = $allFiles.Count

    if ($total -eq 0) {
        Write-Host "⚠️  No JPG or PNG files found" -ForegroundColor Yellow
        return @{
            converted = 0
            failed = 0
            total = 0
            manifest = @()
        }
    }

    Write-Host "Found $total images to process" -ForegroundColor Yellow

    $manifest = @()
    $converted = 0
    $failed = 0
    $counter = 0

    foreach ($file in $allFiles) {
        $counter++
        $progressPercent = [math]::Round(($counter / $total) * 100)

        $relativePath = $file.FullName.Replace($SourceDir, "").TrimStart("\")
        $webpName = [System.IO.Path]::ChangeExtension($file.Name, ".webp")
        $webpPath = [System.IO.Path]::Combine($file.DirectoryName, $webpName)
        $relativeWebpPath = $webpPath.Replace($SourceDir, "").TrimStart("\")

        Write-Progress -Activity "Converting to WebP" -Status "$($file.Name)" -PercentComplete $progressPercent

        if ($DryRun) {
            Write-Host "[DRY-RUN] Would convert: $relativePath → $relativeWebpPath" -ForegroundColor Gray
            $converted++
        }
        else {
            $result = Convert-ToWebP -SourcePath $file.FullName -TargetPath $webpPath -Quality $Quality

            if ($result.success) {
                $metadata = Get-ImageMetadata -ImagePath $webpPath -RelativePath $relativeWebpPath

                $manifest += @{
                    source = $relativePath
                    webp = $relativeWebpPath
                    metadata = $metadata
                }

                Write-Host "  ✅ $webpName" -ForegroundColor Green
                $converted++
            }
            else {
                Write-Host "  ❌ $($file.Name) - $($result.message)" -ForegroundColor Red
                $failed++
            }
        }
    }

    Write-Progress -Completed

    return @{
        converted = $converted
        failed = $failed
        total = $total
        manifest = $manifest
    }
}

# Save image manifest
function Save-ImageManifest {
    param(
        [array]$Manifest,
        [string]$OutputPath
    )

    $manifestObj = @{
        generated = (Get-Date).ToUniversalTime().ToString("o")
        quality = $Quality
        total_images = $Manifest.Count
        images = $Manifest
    }

    $outputDir = Split-Path $OutputPath
    if (-not (Test-Path $outputDir)) {
        New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
    }

    $manifestObj | ConvertTo-Json -Depth 10 | Set-Content -Path $OutputPath

    Write-Host "📋 Manifest saved: $OutputPath" -ForegroundColor Green
}

# Generate conversion report
function Save-ConversionReport {
    param(
        [hashtable]$Results,
        [string]$OutputPath
    )

    $report = @{
        timestamp = (Get-Date).ToUniversalTime().ToString("o")
        mode = if ($DryRun) { "dry-run" } else { "execute" }
        quality = $Quality
        summary = @{
            total_processed = $Results.total
            converted = $Results.converted
            failed = $Results.failed
            success_rate = if ($Results.total -gt 0) { [math]::Round(($Results.converted / $Results.total) * 100, 2) } else { 0 }
        }
        next_steps = @(
            "Verify images with: npm run build",
            "Check build output for any image-related errors",
            "Run: Get-ChildItem public\images -Recurse -File -Filter '*.jpg' | Measure-Object",
            "Ensure no 0-byte files remain",
            "Test image loading in browser"
        )
    }

    $outputDir = Split-Path $OutputPath
    if (-not (Test-Path $outputDir)) {
        New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
    }

    $report | ConvertTo-Json -Depth 10 | Set-Content -Path $OutputPath

    Write-Host "📊 Report saved: $OutputPath" -ForegroundColor Cyan
}

# Main execution
function Main {
    Write-Host "`n╔════════════════════════════════════════════════════════╗"
    Write-Host "║    DALC WebP Conversion & Image Optimization          ║"
    Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan

    Write-Host "Configuration:"
    Write-Host "  Target Directory: $TargetDir"
    Write-Host "  Quality Level: $Quality"
    Write-Host "  Mode: $(if ($DryRun) { 'DRY-RUN' } else { 'EXECUTE' })" -ForegroundColor Yellow
    Write-Host ""

    # Check requirements
    if (-not (Test-Requirements)) {
        exit 1
    }

    # Perform conversion
    $results = Start-Conversion -SourceDir $TargetDir -Quality $Quality

    # Save results
    if ($results.manifest.Count -gt 0) {
        Save-ImageManifest -Manifest $results.manifest -OutputPath "$PSScriptRoot\..\reports\image-manifest.json"
    }

    Save-ConversionReport -Results $results -OutputPath "$PSScriptRoot\..\reports\webp-conversion-report.json"

    # Summary
    Write-Host "`n╔════════════════════════════════════════════════════════╗"
    Write-Host "║                        SUMMARY                         ║"
    Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Green

    Write-Host "  Total Processed: $($results.total)"
    Write-Host "  ✅ Converted: $($results.converted)"
    Write-Host "  ❌ Failed: $($results.failed)"

    if ($results.total -gt 0) {
        $successRate = [math]::Round(($results.converted / $results.total) * 100, 2)
        Write-Host "  📊 Success Rate: $successRate%"
    }

    Write-Host "`nNext Steps:"
    Write-Host "  1. Verify build: npm run build"
    Write-Host "  2. Check for 0-byte files: Get-ChildItem public\images -Recurse -File | Where-Object {`$_.Length -eq 0} | Measure-Object"
    Write-Host "  3. Test in browser"
    Write-Host ""
}

# Execute
Main
