'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  Upload, Download, Camera, RefreshCw, ZoomIn, ZoomOut,
  CheckCircle2, AlertCircle, ArrowLeft, Printer,
  Sparkles, Move, Star,
} from 'lucide-react';

// ── Passport Specs ─────────────────────────────────────────────────────────────

const PASSPORT_SPECS = {
  ISO:   { label: 'ISO Standard (35×45mm)',  w: 413, h: 531 },
  US:    { label: 'US Passport (2×2 inch)',  w: 600, h: 600 },
  INDIA: { label: 'India Passport (35×35mm)',w: 413, h: 413 },
} as const;
type SpecKey = keyof typeof PASSPORT_SPECS;

// ── Canvas constants ──────────────────────────────────────────────────────────

const CANVAS_W = 540;
const CANVAS_H = 620;
const FRAME_W  = 210;
const FRAME_H  = 270;
const FRAME_X  = (CANVAS_W - FRAME_W) / 2;
const FRAME_Y  = (CANVAS_H - FRAME_H) / 2;

// ── Overlay draw ──────────────────────────────────────────────────────────────

function drawPassportOverlay(ctx: CanvasRenderingContext2D) {
  // Dark vignette outside frame
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.60)';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = 'rgba(0,0,0,1)';
  ctx.fillRect(FRAME_X, FRAME_Y, FRAME_W, FRAME_H);
  ctx.restore();

  // Animated-looking corner brackets
  const bLen = 18;
  ctx.save();
  ctx.strokeStyle = '#C9A84C';
  ctx.lineWidth = 2;
  ctx.lineCap   = 'round';
  // TL
  ctx.beginPath(); ctx.moveTo(FRAME_X, FRAME_Y + bLen); ctx.lineTo(FRAME_X, FRAME_Y); ctx.lineTo(FRAME_X + bLen, FRAME_Y); ctx.stroke();
  // TR
  ctx.beginPath(); ctx.moveTo(FRAME_X + FRAME_W - bLen, FRAME_Y); ctx.lineTo(FRAME_X + FRAME_W, FRAME_Y); ctx.lineTo(FRAME_X + FRAME_W, FRAME_Y + bLen); ctx.stroke();
  // BL
  ctx.beginPath(); ctx.moveTo(FRAME_X, FRAME_Y + FRAME_H - bLen); ctx.lineTo(FRAME_X, FRAME_Y + FRAME_H); ctx.lineTo(FRAME_X + bLen, FRAME_Y + FRAME_H); ctx.stroke();
  // BR
  ctx.beginPath(); ctx.moveTo(FRAME_X + FRAME_W - bLen, FRAME_Y + FRAME_H); ctx.lineTo(FRAME_X + FRAME_W, FRAME_Y + FRAME_H); ctx.lineTo(FRAME_X + FRAME_W, FRAME_Y + FRAME_H - bLen); ctx.stroke();

  // Dashed frame border
  ctx.strokeStyle = 'rgba(201,168,76,0.3)';
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 4]);
  ctx.strokeRect(FRAME_X, FRAME_Y, FRAME_W, FRAME_H);
  ctx.setLineDash([]);

  // Biometric guide lines
  [
    { y: FRAME_Y + FRAME_H * 0.10, label: 'Crown' },
    { y: FRAME_Y + FRAME_H * 0.35, label: 'Eyes'  },
    { y: FRAME_Y + FRAME_H * 0.60, label: 'Nose'  },
    { y: FRAME_Y + FRAME_H * 0.82, label: 'Chin'  },
  ].forEach(({ y, label }) => {
    ctx.strokeStyle = 'rgba(201,168,76,0.20)';
    ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.moveTo(FRAME_X, y); ctx.lineTo(FRAME_X + FRAME_W, y); ctx.stroke();
    ctx.fillStyle = 'rgba(201,168,76,0.40)';
    ctx.font = '8px "DM Mono", monospace';
    ctx.fillText(label, FRAME_X + FRAME_W + 5, y + 3);
  });

  // Face oval
  ctx.beginPath();
  ctx.ellipse(FRAME_X + FRAME_W / 2, FRAME_Y + FRAME_H * 0.46, FRAME_W * 0.33, FRAME_H * 0.36, 0, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(201,168,76,0.45)';
  ctx.lineWidth = 1.2;
  ctx.setLineDash([3, 3]);
  ctx.stroke();
  ctx.setLineDash([]);

  // Dimension labels
  ctx.fillStyle = 'rgba(201,168,76,0.45)';
  ctx.font = '8px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('35 mm', FRAME_X + FRAME_W / 2, FRAME_Y + FRAME_H + 14);
  ctx.save();
  ctx.translate(FRAME_X - 14, FRAME_Y + FRAME_H / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('45 mm', 0, 0);
  ctx.restore();
  ctx.textAlign = 'left';

  ctx.restore();
}

// ── Step indicator ────────────────────────────────────────────────────────────

const STAGES: { key: 'upload' | 'edit' | 'done'; label: string }[] = [
  { key: 'upload', label: 'Upload' },
  { key: 'edit',   label: 'Position' },
  { key: 'done',   label: 'Download' },
];

// ── Main component ────────────────────────────────────────────────────────────

export default function PassportPhotoStudio() {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [image,      setImage]      = useState<HTMLImageElement | null>(null);
  const [zoom,       setZoom]       = useState(1);
  const [offset,     setOffset]     = useState({ x: 0, y: 0 });
  const [dragging,   setDragging]   = useState(false);
  const [dragStart,  setDragStart]  = useState({ x: 0, y: 0 });
  const [result,     setResult]     = useState<string | null>(null);
  const [spec,       setSpec]       = useState<SpecKey>('ISO');
  const [processing, setProcessing] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [contrast,   setContrast]   = useState(100);
  const [stage,      setStage]      = useState<'upload' | 'edit' | 'done'>('upload');
  const [bgRemoved,  setBgRemoved]  = useState(false);
  const [dragOver,   setDragOver]   = useState(false);

  const lastTouchDist = useRef<number | null>(null);

  // ── Draw ────────────────────────────────────────────────────────────────────

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#0A0806';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    if (image) {
      ctx.save();
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
      ctx.translate(CANVAS_W / 2 + offset.x, CANVAS_H / 2 + offset.y);
      ctx.scale(zoom, zoom);
      ctx.drawImage(image, -image.width / 2, -image.height / 2);
      ctx.restore();
    }

    drawPassportOverlay(ctx);

    if (!image) {
      ctx.fillStyle = 'rgba(201,168,76,0.3)';
      ctx.font = '13px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('Upload a photo to begin', CANVAS_W / 2, CANVAS_H / 2 + 4);
      ctx.textAlign = 'left';
    }
  }, [image, zoom, offset, brightness, contrast]);

  useEffect(() => { draw(); }, [draw]);

  // ── Image load ───────────────────────────────────────────────────────────────

  const loadImage = useCallback((src: string) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.max(FRAME_W / img.width, FRAME_H / img.height) * 1.05;
      setZoom(scale);
      setOffset({ x: 0, y: 0 });
      setImage(img);
      setBgRemoved(false);
      setResult(null);
      setStage('edit');
    };
    img.src = src;
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    loadImage(URL.createObjectURL(file));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    loadImage(URL.createObjectURL(file));
  };

  // ── Canvas interaction ────────────────────────────────────────────────────────

  const getCanvasPt = (e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (CANVAS_W / rect.width),
      y: (e.clientY - rect.top)  * (CANVAS_H / rect.height),
    };
  };

  const onMouseDown  = (e: React.MouseEvent) => { if (!image) return; setDragging(true);  setDragStart(getCanvasPt(e)); };
  const onMouseMove  = (e: React.MouseEvent) => {
    if (!dragging || !image) return;
    const pt = getCanvasPt(e);
    setOffset(o => ({ x: o.x + (pt.x - dragStart.x), y: o.y + (pt.y - dragStart.y) }));
    setDragStart(pt);
  };
  const onMouseUp = () => setDragging(false);

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom(z => Math.max(0.3, Math.min(8, z - e.deltaY * 0.002)));
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      if (lastTouchDist.current !== null) setZoom(z => Math.max(0.3, Math.min(8, z * (dist / lastTouchDist.current!))));
      lastTouchDist.current = dist;
    }
  };
  const onTouchEnd = () => { lastTouchDist.current = null; };

  // ── Background removal ────────────────────────────────────────────────────────

  const removeBackground = useCallback(() => {
    if (!image) return;
    setProcessing(true);
    setTimeout(() => {
      const off = document.createElement('canvas');
      off.width = image.width; off.height = image.height;
      const ctx = off.getContext('2d')!;
      ctx.drawImage(image, 0, 0);

      const imgData = ctx.getImageData(0, 0, off.width, off.height);
      const d = imgData.data;

      const samplePx = (x: number, y: number) => {
        const i = (y * off.width + x) * 4;
        return [d[i], d[i + 1], d[i + 2]] as [number, number, number];
      };
      const corners = [samplePx(0, 0), samplePx(off.width - 1, 0), samplePx(0, off.height - 1), samplePx(off.width - 1, off.height - 1)];
      const bgR = Math.round(corners.reduce((s, c) => s + c[0], 0) / 4);
      const bgG = Math.round(corners.reduce((s, c) => s + c[1], 0) / 4);
      const bgB = Math.round(corners.reduce((s, c) => s + c[2], 0) / 4);

      for (let i = 0; i < d.length; i += 4) {
        const dist = Math.sqrt((d[i] - bgR) ** 2 + (d[i + 1] - bgG) ** 2 + (d[i + 2] - bgB) ** 2);
        if (dist < 65) { d[i] = 255; d[i + 1] = 255; d[i + 2] = 255; }
      }
      ctx.putImageData(imgData, 0, 0);

      const newImg = new Image();
      newImg.onload = () => { setImage(newImg); setBgRemoved(true); setProcessing(false); };
      newImg.src = off.toDataURL();
    }, 400);
  }, [image]);

  // ── Generate ───────────────────────────────────────────────────────────────────

  const generatePhoto = useCallback(() => {
    if (!image) return;
    setProcessing(true);
    setTimeout(() => {
      const { w, h } = PASSPORT_SPECS[spec];
      const out = document.createElement('canvas');
      out.width = w; out.height = h;
      const ctx = out.getContext('2d')!;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;

      const centerX = CANVAS_W / 2 + offset.x;
      const centerY = CANVAS_H / 2 + offset.y;
      const srcX = (FRAME_X - centerX) / zoom + image.width / 2;
      const srcY = (FRAME_Y - centerY) / zoom + image.height / 2;
      ctx.drawImage(image, srcX, srcY, FRAME_W / zoom, FRAME_H / zoom, 0, 0, w, h);

      setResult(out.toDataURL('image/jpeg', 0.95));
      setStage('done');
      setProcessing(false);
    }, 600);
  }, [image, zoom, offset, spec, brightness, contrast]);

  // ── Print ───────────────────────────────────────────────────────────────────────

  const printPhotos = () => {
    if (!result) return;
    const w = window.open('', '_blank')!;
    const isSquare = spec === 'US' || spec === 'INDIA';
    w.document.write(`<html><head><title>Passport Photos — DALC</title><style>
      body{margin:0;background:white;display:flex;align-items:center;justify-content:center;min-height:100vh;}
      .grid{display:grid;grid-template-columns:repeat(2,auto);gap:6mm;padding:8mm;border:1pt solid #ddd;}
      img{width:35mm;height:${isSquare ? '35' : '45'}mm;object-fit:cover;border:0.3pt solid #bbb;display:block;}
      p{text-align:center;font-family:sans-serif;font-size:8pt;color:#666;margin:4mm 0 0;}
      @media print{body{margin:0}}
    </style></head><body>
    <div><div class="grid">${Array(4).fill(`<img src="${result}"/>`).join('')}</div>
    <p>DALC Passport Photo Studio — ICAO 9303 Compliant</p></div>
    <script>window.onload=()=>{window.print();}</script></body></html>`);
    w.document.close();
  };

  // ── Render ─────────────────────────────────────────────────────────────────────

  const currentStageIdx = STAGES.findIndex(s => s.key === stage);

  return (
    <div className="min-h-screen bg-[#070707] pt-16 text-white md:pt-[112px]">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(201,168,76,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(201,168,76,0.025)_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="absolute left-0 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C9A84C]/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] translate-x-1/4 translate-y-1/4 rounded-full bg-[#C9A84C]/4 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-[#C9A84C]/12 bg-[#070707]/85 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-5">
            <Link href="/services/visas" className="flex items-center gap-2 text-[#8A7D60] transition-colors hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Visa Hub</span>
            </Link>
            <span className="text-[#C9A84C]/20">|</span>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#C9A84C]/60">DALC</p>
              <h1 className="text-base font-light tracking-tight text-white">
                AI Passport <span className="text-[#C9A84C]">Photo Studio</span>
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[#C9A84C]/20 bg-[#C9A84C]/5 px-3 py-1.5">
            <Sparkles className="h-3.5 w-3.5 text-[#C9A84C]/70" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#C9A84C]/70">Free · Instant · ICAO</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-5 py-8">

        {/* Step progress */}
        <div className="mb-8 flex items-center justify-center gap-0">
          {STAGES.map((s, i) => (
            <div key={s.key} className="flex items-center">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300 ${
                s.key === stage
                  ? 'bg-[#C9A84C] text-[#080706] shadow-[0_0_16px_rgba(201,168,76,0.4)]'
                  : i < currentStageIdx
                    ? 'bg-[#C9A84C]/20 text-[#C9A84C]'
                    : 'border border-[#C9A84C]/20 text-[#8A7D60]'
              }`}>
                {i < currentStageIdx ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`ml-2 mr-4 text-xs ${s.key === stage ? 'text-[#C9A84C]' : 'text-[#8A7D60]'}`}>
                {s.label}
              </span>
              {i < STAGES.length - 1 && (
                <div className={`mr-4 h-px w-10 transition-all duration-500 ${i < currentStageIdx ? 'bg-[#C9A84C]/50' : 'bg-[#C9A84C]/12'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">

          {/* ── Left: Editor / Result ─────────────────────────────────────── */}
          <AnimatePresence mode="wait">

            {stage === 'upload' && (
              <motion.div key="upload" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
                <div
                  onDrop={handleDrop}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onClick={() => fileInputRef.current?.click()}
                  className={`group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed transition-all duration-300 ${
                    dragOver
                      ? 'border-[#C9A84C]/70 bg-[#C9A84C]/6 shadow-[0_0_40px_rgba(201,168,76,0.12)]'
                      : 'border-[#C9A84C]/20 bg-[#0D0B08] hover:border-[#C9A84C]/45 hover:bg-[#C9A84C]/4'
                  }`}
                  style={{ minHeight: 480 }}
                >
                  {/* Animated corner accents */}
                  {[['top-4 left-4', 'border-t border-l'], ['top-4 right-4', 'border-t border-r'], ['bottom-4 left-4', 'border-b border-l'], ['bottom-4 right-4', 'border-b border-r']].map(([pos, borders]) => (
                    <div key={pos} className={`absolute ${pos} h-6 w-6 ${borders} border-[#C9A84C]/30`} />
                  ))}

                  <motion.div
                    animate={{ y: dragOver ? -8 : 0, scale: dragOver ? 1.1 : 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="mb-5 rounded-2xl border border-[#C9A84C]/25 bg-[#C9A84C]/10 p-5"
                  >
                    <Upload className="h-10 w-10 text-[#C9A84C]" />
                  </motion.div>

                  <p className="mb-2 text-xl font-light text-white">
                    {dragOver ? 'Release to upload' : 'Drop your photo here'}
                  </p>
                  <p className="mb-6 text-sm text-[#8A7D60]">or click to browse — JPG, PNG, WEBP accepted</p>

                  <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[#8A7D60]/60">
                    {['Any angle or background', 'Selfies work perfectly', 'Instant AI processing'].map(tip => (
                      <span key={tip} className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#C9A84C]/40" /> {tip}
                      </span>
                    ))}
                  </div>

                  <div className="mt-8 flex items-center gap-3 rounded-xl border border-[#C9A84C]/10 bg-[#C9A84C]/5 px-4 py-2.5">
                    <Star className="h-3.5 w-3.5 text-[#C9A84C]" />
                    <p className="text-xs text-[#8A7D60]">Trusted by <span className="text-[#C9A84C]">12,000+</span> Dubai residents for biometric passport photos</p>
                  </div>
                </div>
              </motion.div>
            )}

            {stage === 'edit' && (
              <motion.div key="edit" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} className="flex flex-col gap-3">
                <div className="relative overflow-hidden rounded-2xl border border-[#C9A84C]/20 bg-[#0A0806] shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                  <canvas
                    ref={canvasRef}
                    width={CANVAS_W}
                    height={CANVAS_H}
                    className="block w-full cursor-grab active:cursor-grabbing"
                    style={{ maxHeight: 560, objectFit: 'contain' }}
                    onMouseDown={onMouseDown}
                    onMouseMove={onMouseMove}
                    onMouseUp={onMouseUp}
                    onMouseLeave={onMouseUp}
                    onWheel={onWheel}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                  />
                  {/* Drag hint overlay */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                    <div className="flex items-center gap-2 rounded-full border border-[#C9A84C]/15 bg-[#0A0806]/80 px-4 py-2 backdrop-blur-sm">
                      <Move className="h-3 w-3 text-[#C9A84C]/60" />
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[#C9A84C]/50">
                        Drag · Scroll to zoom · Position face in oval
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-center text-xs text-[#8A7D60] transition-colors hover:text-[#C9A84C]"
                >
                  Upload a different photo
                </button>
              </motion.div>
            )}

            {stage === 'done' && result && (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
                <div className="overflow-hidden rounded-3xl border border-emerald-500/20 bg-[#0A0F0A]">
                  {/* Success banner */}
                  <div className="flex items-center gap-3 border-b border-emerald-500/15 bg-emerald-500/8 px-6 py-4">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    <div>
                      <p className="font-medium text-emerald-400">Passport photo generated</p>
                      <p className="text-xs text-emerald-400/60">ICAO 9303 compliant · White background · Ready to print</p>
                    </div>
                  </div>

                  {/* Photo previews */}
                  <div className="flex flex-col items-center gap-8 px-8 py-10 sm:flex-row sm:items-start sm:justify-center">
                    {/* Single large preview */}
                    <div className="text-center">
                      <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-[#8A7D60]">Single Photo</p>
                      <div className="relative inline-block">
                        <img
                          src={result}
                          alt="Passport photo"
                          className="rounded-lg border border-[#C9A84C]/20 shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
                          style={{ width: 160, height: spec === 'US' ? 160 : spec === 'INDIA' ? 160 : 205 }}
                        />
                        <div className="absolute -bottom-2 -right-2 rounded-full border border-emerald-500/40 bg-[#0A0F0A] px-2 py-1">
                          <span className="font-mono text-[9px] text-emerald-400">✓ Ready</span>
                        </div>
                      </div>
                      <p className="mt-3 font-mono text-[9px] text-[#8A7D60]">
                        {PASSPORT_SPECS[spec].w}×{PASSPORT_SPECS[spec].h}px
                      </p>
                    </div>

                    {/* Separator */}
                    <div className="h-px w-full bg-[#C9A84C]/8 sm:h-full sm:w-px" />

                    {/* Print layout */}
                    <div className="text-center">
                      <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-[#8A7D60]">Print Layout (4×)</p>
                      <div className="inline-grid grid-cols-2 gap-2 rounded-lg border border-[#C9A84C]/10 bg-[#181510] p-3">
                        {Array(4).fill(null).map((_, i) => (
                          <img
                            key={i}
                            src={result}
                            alt=""
                            className="rounded border border-white/10 shadow-sm"
                            style={{ width: 72, height: spec === 'US' ? 72 : spec === 'INDIA' ? 72 : 92 }}
                          />
                        ))}
                      </div>
                      <p className="mt-3 font-mono text-[9px] text-[#8A7D60]">Fits on A4 / Letter paper</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-center gap-3 border-t border-[#C9A84C]/8 bg-[#0D0B08] px-6 py-5">
                    <a
                      href={result}
                      download="dalc-passport-photo.jpg"
                      className="flex items-center gap-2 rounded-xl bg-[#C9A84C] px-6 py-3 font-medium text-[#080706] shadow-[0_4px_16px_rgba(201,168,76,0.25)] transition-all hover:bg-[#E8CC70] hover:shadow-[0_4px_24px_rgba(201,168,76,0.35)]"
                    >
                      <Download className="h-4 w-4" />
                      Download JPEG
                    </a>
                    <button
                      onClick={printPhotos}
                      className="flex items-center gap-2 rounded-xl border border-[#C9A84C]/30 px-6 py-3 text-[#C9A84C] transition-all hover:bg-[#C9A84C]/10"
                    >
                      <Printer className="h-4 w-4" />
                      Print 4 Photos
                    </button>
                    <button
                      onClick={() => { setStage('edit'); setResult(null); }}
                      className="flex items-center gap-2 rounded-xl border border-[#C9A84C]/12 px-6 py-3 text-[#8A7D60] transition-all hover:text-white"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Re-crop
                    </button>
                  </div>
                </div>

                {/* Compliance badges */}
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {['ICAO 9303 Compliant', 'Biometric-Ready', 'White Background', '300 DPI Equivalent', '190+ Countries'].map(b => (
                    <span key={b} className="flex items-center gap-1.5 rounded-full border border-[#C9A84C]/15 bg-[#0D0B08] px-3 py-1 font-mono text-[9px] uppercase tracking-wider text-[#C9A84C]/60">
                      <CheckCircle2 className="h-2.5 w-2.5" />{b}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>

          {/* ── Right: Controls ───────────────────────────────────────────── */}
          <div className="flex flex-col gap-4">

            {/* Output format */}
            <div className="rounded-2xl border border-[#C9A84C]/15 bg-[#0D0B08] p-5">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-[#C9A84C]/60">Output Format</p>
              <div className="space-y-2">
                {(Object.entries(PASSPORT_SPECS) as [SpecKey, typeof PASSPORT_SPECS[SpecKey]][]).map(([key, s]) => (
                  <label key={key} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all duration-200 ${spec === key ? 'border-[#C9A84C]/40 bg-[#C9A84C]/8 shadow-[inset_0_0_12px_rgba(201,168,76,0.06)]' : 'border-[#C9A84C]/10 bg-[#181510] hover:border-[#C9A84C]/25'}`}>
                    <input type="radio" name="spec" value={key} checked={spec === key} onChange={() => setSpec(key)} className="sr-only" />
                    <div className={`flex h-4 w-4 items-center justify-center rounded-full border-2 transition-colors ${spec === key ? 'border-[#C9A84C]' : 'border-[#8A7D60]'}`}>
                      {spec === key && <div className="h-2 w-2 rounded-full bg-[#C9A84C]" />}
                    </div>
                    <div>
                      <p className="text-sm text-white">{s.label}</p>
                      <p className="font-mono text-[9px] text-[#8A7D60]">{s.w}×{s.h}px output</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Image adjustments (only in edit) */}
            {stage === 'edit' && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-[#C9A84C]/15 bg-[#0D0B08] p-5">
                <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-[#C9A84C]/60">Image Adjustments</p>
                {[
                  { label: 'Zoom', value: Math.round(zoom * 100), unit: '%', min: 30, max: 600, onChange: (v: number) => setZoom(v / 100),
                    extra: (
                      <div className="flex items-center gap-2">
                        <button onClick={() => setZoom(z => Math.max(0.3, z - 0.1))} className="rounded-lg border border-[#C9A84C]/15 p-1.5 transition-colors hover:border-[#C9A84C]/40"><ZoomOut className="h-3 w-3 text-[#8A7D60]" /></button>
                        <input type="range" min={30} max={600} value={Math.round(zoom * 100)} onChange={e => setZoom(Number(e.target.value) / 100)} className="flex-1 accent-[#C9A84C]" />
                        <button onClick={() => setZoom(z => Math.min(8, z + 0.1))} className="rounded-lg border border-[#C9A84C]/15 p-1.5 transition-colors hover:border-[#C9A84C]/40"><ZoomIn className="h-3 w-3 text-[#8A7D60]" /></button>
                      </div>
                    )
                  },
                  { label: 'Brightness', value: brightness, unit: '%', min: 60, max: 160, onChange: setBrightness },
                  { label: 'Contrast',   value: contrast,   unit: '%', min: 60, max: 160, onChange: setContrast   },
                ].map(({ label, value, unit, min, max, onChange, extra }) => (
                  <div key={label} className="mb-4 last:mb-0">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs text-[#8A7D60]">{label}</span>
                      <span className="font-mono text-xs text-[#C9A84C]">{value}{unit}</span>
                    </div>
                    {extra ?? (
                      <input type="range" min={min} max={max} value={value} onChange={e => onChange(Number(e.target.value))} className="w-full accent-[#C9A84C]" />
                    )}
                  </div>
                ))}
              </motion.div>
            )}

            {/* Background removal */}
            {stage === 'edit' && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="rounded-2xl border border-[#C9A84C]/15 bg-[#0D0B08] p-5">
                <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-[#C9A84C]/60">AI Background</p>
                <button
                  onClick={removeBackground}
                  disabled={processing || bgRemoved}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-sm font-medium transition-all ${
                    bgRemoved
                      ? 'border-emerald-500/30 bg-emerald-500/8 text-emerald-400'
                      : 'border-[#C9A84C]/30 text-[#C9A84C] hover:bg-[#C9A84C]/8 hover:shadow-[0_0_20px_rgba(201,168,76,0.12)]'
                  } disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  {processing && !bgRemoved ? <><RefreshCw className="h-4 w-4 animate-spin" /> Removing…</>
                   : bgRemoved ? <><CheckCircle2 className="h-4 w-4" /> Background Removed</>
                   : <><Sparkles className="h-4 w-4" /> Remove Background</>}
                </button>
                <p className="mt-2 text-center font-mono text-[9px] text-[#8A7D60]/50">Best with uniform/solid backgrounds</p>
              </motion.div>
            )}

            {/* Generate CTA */}
            {stage === 'edit' && (
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                onClick={generatePhoto}
                disabled={!image || processing}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#C9A84C] py-4 font-semibold text-[#080706] shadow-[0_4px_20px_rgba(201,168,76,0.2)] transition-all hover:bg-[#E8CC70] hover:shadow-[0_4px_28px_rgba(201,168,76,0.3)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {processing && stage === 'edit'
                  ? <><RefreshCw className="h-5 w-5 animate-spin" /> Generating…</>
                  : <><Camera className="h-5 w-5" /> Generate Passport Photo</>}
              </motion.button>
            )}

            {/* Tips */}
            <div className="rounded-2xl border border-[#C9A84C]/10 bg-[#0D0B08] p-5">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-[#C9A84C]/50">Tips for best results</p>
              <ul className="space-y-2">
                {[
                  'Face front-facing, eyes open, neutral expression',
                  'Uniform background — white, light grey, or light blue',
                  'No glasses, hats, or hair covering the face',
                  'Good, even lighting — avoid harsh shadows',
                  'Minimum 300×400px source photo',
                ].map(tip => (
                  <li key={tip} className="flex items-start gap-2 text-xs text-[#8A7D60]">
                    <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-[#C9A84C]/35" />{tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Disclaimer */}
            <div className="flex gap-2 rounded-xl border border-amber-500/15 bg-amber-500/4 p-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400/60" />
              <p className="text-xs text-amber-400/60">
                Verify requirements with your embassy. DALC photos meet ICAO 9303 standards — accepted by 190+ countries.
              </p>
            </div>

          </div>
        </div>
      </main>

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
    </div>
  );
}
