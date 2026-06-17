import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const SRC_APP = path.join(ROOT, "src", "app");
const PUBLIC_IMAGES = path.join(ROOT, "public", "images");
const REPORT_DIR = path.join(ROOT, "reports");
const mode = process.argv[2] || "audit";

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

const categories = [
    "restaurants",
    "beach-clubs",
    "night-clubs",
    "dining-entertainment",
    "experiences",
    "desert-adventures",
    "water-activities",
    "yacht-charter",
    "aerial-and-adrenaline",
    "wellness",
    "entertainment",
    "abu-dhabi-tours",
    "oman-tours",
    "transport",
    "cars",
    "yachts",
    "jets",
    "stays",
    "hotels",
    "villas",
    "residences",
    "travel",
    "business",
    "visas"
];

function walk(dir, files = []) {
    if (!fs.existsSync(dir)) return files;

    for (const item of fs.readdirSync(dir)) {
        const full = path.join(dir, item);
        const stat = fs.statSync(full);

        if (stat.isDirectory()) walk(full, files);
        else files.push(full);
    }

    return files;
}

function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        return true;
    }

    return false;
}

function slugify(input) {
    return input
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}

function read(file) {
    return fs.readFileSync(file, "utf8");
}

function extractImageRefs(content) {
    const refs = new Set();

    const patterns = [
        /["'`](\/images\/[^"'`]+?)["'`]/g,
        /src:\s*["'`](\/images\/[^"'`]+?)["'`]/g,
        /image:\s*["'`](\/images\/[^"'`]+?)["'`]/g,
        /imageUrl:\s*["'`](\/images\/[^"'`]+?)["'`]/g,
        /thumbnail:\s*["'`](\/images\/[^"'`]+?)["'`]/g,
        /gallery:\s*\[[^\]]+\]/g
    ];

    for (const pattern of patterns) {
        let match;

        while ((match = pattern.exec(content))) {
            if (match[1]) refs.add(match[1]);
        }
    }

    return [...refs];
}

function detectFakeImage(ref) {
    const badWords = [
        "placeholder",
        "fake",
        "mock",
        "sample",
        "test",
        "screenshot",
        "desktop",
        "temp",
        "dummy",
        "lorem",
        "unsplash"
    ];

    return badWords.some(word => ref.toLowerCase().includes(word));
}

function getRouteFromPageFile(file) {
    const relative = path.relative(SRC_APP, file);
    const parts = relative.split(path.sep);

    if (!parts.includes("page.tsx") && !parts.includes("page.ts")) return null;

    const clean = parts
        .filter(part => !["page.tsx", "page.ts", "layout.tsx", "loading.tsx", "error.tsx"].includes(part))
        .map(part => {
            if (part.startsWith("(")) return null;
            if (part.startsWith("[") && part.endsWith("]")) return `:${part.slice(1, -1)}`;
            return part;
        })
        .filter(Boolean);

    return "/" + clean.join("/");
}

async function downloadPexels(query, outputPath) {
    if (!PEXELS_API_KEY) return false;

    const searchUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`;

    const res = await fetch(searchUrl, {
        headers: {
            Authorization: PEXELS_API_KEY
        }
    });

    if (!res.ok) return false;

    const data = await res.json();
    const imageUrl = data?.photos?.[0]?.src?.large2x || data?.photos?.[0]?.src?.large;

    if (!imageUrl) return false;

    const image = await fetch(imageUrl);
    const buffer = Buffer.from(await image.arrayBuffer());

    fs.writeFileSync(outputPath, buffer);
    return true;
}

async function downloadUnsplash(query, outputPath) {
    if (!UNSPLASH_ACCESS_KEY) return false;

    const searchUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}`;

    const res = await fetch(searchUrl);
    if (!res.ok) return false;

    const data = await res.json();
    const imageUrl = data?.results?.[0]?.urls?.regular;

    if (!imageUrl) return false;

    const image = await fetch(imageUrl);
    const buffer = Buffer.from(await image.arrayBuffer());

    fs.writeFileSync(outputPath, buffer);
    return true;
}

async function downloadRealImage(query, outputPath) {
    const pexelsOk = await downloadPexels(query, outputPath);
    if (pexelsOk) return "pexels";

    const unsplashOk = await downloadUnsplash(query, outputPath);
    if (unsplashOk) return "unsplash";

    return null;
}

function scanProject() {
    ensureDir(REPORT_DIR);
    ensureDir(PUBLIC_IMAGES);

    const sourceFiles = walk(path.join(ROOT, "src")).filter(file =>
        /\.(tsx|ts|jsx|js|json|mdx)$/.test(file)
    );

    const pageFiles = sourceFiles.filter(file =>
        /\/page\.(tsx|ts)$/.test(file.replaceAll("\\", "/"))
    );

    const routes = pageFiles
        .map(getRouteFromPageFile)
        .filter(Boolean)
        .sort();

    const imageRefs = [];

    for (const file of sourceFiles) {
        const content = read(file);
        const refs = extractImageRefs(content);

        for (const ref of refs) {
            const diskPath = path.join(ROOT, "public", ref.replace(/^\//, ""));
            imageRefs.push({
                file: path.relative(ROOT, file),
                ref,
                exists: fs.existsSync(diskPath),
                fake: detectFakeImage(ref),
                diskPath
            });
        }
    }

    const missingImages = imageRefs.filter(item => !item.exists);
    const fakeImages = imageRefs.filter(item => item.fake);
    const brokenRoutes = routes.filter(route => route.includes(":"));

    const expectedFolders = categories.map(category => {
        const folder = path.join(PUBLIC_IMAGES, category);
        return {
            category,
            folder: path.relative(ROOT, folder),
            exists: fs.existsSync(folder)
        };
    });

    return {
        scannedAt: new Date().toISOString(),
        projectRoot: ROOT,
        routes,
        routeCount: routes.length,
        imageRefCount: imageRefs.length,
        missingImageCount: missingImages.length,
        fakeImageCount: fakeImages.length,
        expectedFolders,
        missingFolders: expectedFolders.filter(item => !item.exists),
        missingImages,
        fakeImages,
        dynamicRoutes: brokenRoutes
    };
}

async function fixProject(report) {
    const actions = [];

    for (const item of report.missingFolders) {
        const full = path.join(ROOT, item.folder);
        ensureDir(full);
        actions.push(`Created folder ${item.folder}`);
    }

    for (const item of report.missingImages) {
        const full = item.diskPath;
        const folder = path.dirname(full);
        ensureDir(folder);

        const baseName = path.basename(full, path.extname(full));
        const folderName = path.basename(folder);
        const query = `${folderName} ${baseName} Dubai luxury real photo`;

        const source = await downloadRealImage(query, full);

        if (source) {
            actions.push(`Downloaded ${item.ref} from ${source}`);
        } else {
            fs.writeFileSync(
                full + ".missing.txt",
                `Missing image needs replacement\nReference: ${item.ref}\nUsed in: ${item.file}\nSuggested search: ${query}\n`
            );

            actions.push(`Could not download ${item.ref}. Created missing marker.`);
        }
    }

    return actions;
}

async function main() {
    const report = scanProject();

    fs.writeFileSync(
        path.join(REPORT_DIR, "dalc-audit-report.json"),
        JSON.stringify(report, null, 2)
    );

    console.log("");
    console.log("DALC RECOVERY AUDIT");
    console.log("");
    console.log(`Routes found: ${report.routeCount}`);
    console.log(`Image refs found: ${report.imageRefCount}`);
    console.log(`Missing images: ${report.missingImageCount}`);
    console.log(`Fake image refs: ${report.fakeImageCount}`);
    console.log(`Missing folders: ${report.missingFolders.length}`);
    console.log("");
    console.log("Report saved to reports/dalc-audit-report.json");

    if (mode === "fix") {
        console.log("");
        console.log("Fix mode running...");
        const actions = await fixProject(report);

        fs.writeFileSync(
            path.join(REPORT_DIR, "dalc-fix-actions.json"),
            JSON.stringify(actions, null, 2)
        );

        console.log(`Actions completed: ${actions.length}`);
        console.log("Actions saved to reports/dalc-fix-actions.json");
    }
}

main().catch(error => {
    console.error(error);
    process.exit(1);
});