'use client';

import { CheckCircle2, AlertTriangle, Lightbulb, TrendingUp, Clock, CreditCard, FileText, Shield, ChevronRight, MessageCircle, Phone } from 'lucide-react';
import type { TravelReport, VisaFormData, VisaCategory, AIInsight, DALCService } from '../_lib/types';

// ── Visa Badge ──────────────────────────────────────────────────────────────────

const CATEGORY_STYLES: Record<VisaCategory, { bg: string; text: string; border: string }> = {
  visa_free:     { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  visa_on_arrival: { bg: 'bg-sky-500/10',  text: 'text-sky-400',     border: 'border-sky-500/30' },
  evisa:         { bg: 'bg-blue-500/10',    text: 'text-blue-400',    border: 'border-blue-500/30' },
  embassy_visa:  { bg: 'bg-amber-500/10',   text: 'text-amber-400',   border: 'border-amber-500/30' },
  eta:           { bg: 'bg-violet-500/10',  text: 'text-violet-400',  border: 'border-violet-500/30' },
  not_allowed:   { bg: 'bg-red-500/10',     text: 'text-red-400',     border: 'border-red-500/30' },
};

function ReportHero({ report, data }: { report: TravelReport; data: VisaFormData }) {
  const style = CATEGORY_STYLES[report.visaCategory];
  const nat = data.nationalities[0];
  const dest = data.destination;

  return (
    <div className="border-b border-[#C9A84C]/15 px-6 py-8 sm:px-10">
      <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[#C9A84C]/60">
        DALC Travel Intelligence Report™
      </p>
      <div className="flex flex-wrap items-start gap-6">
        <div className="flex items-center gap-4">
          {nat && <span className="text-5xl">{nat.flag}</span>}
          <span className="text-3xl text-[#8A7D60]">→</span>
          {dest && <span className="text-5xl">{dest.flag}</span>}
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-light text-white sm:text-3xl">
            {nat?.name} <span className="text-[#8A7D60]">to</span> {dest?.name}
          </h2>
          <p className="mt-1 text-sm text-[#D4C9A8]/60">
            {data.purpose?.replace('_', ' ')} · {data.dates.isFlexible ? 'Flexible dates' : `${data.dates.arrival} → ${data.dates.departure}`}
          </p>
          <div className={`mt-3 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 ${style.bg} ${style.border}`}>
            <span className={`text-sm font-semibold ${style.text}`}>{report.visaLabel}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 rounded-xl border border-[#C9A84C]/20 bg-[#C9A84C]/6 px-5 py-3 text-right">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#8A7D60]">Lead Score</span>
          <span className="text-3xl font-light text-[#E8CC70]">{report.leadScore}</span>
          <span className="text-xs text-[#8A7D60]">/ 100</span>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Max Stay', value: report.maxStay },
          { label: 'Entries', value: report.entries },
          { label: 'Processing', value: report.processingMin === 0 ? 'Instant' : `${report.processingMin}–${report.processingMax} days` },
          { label: 'Govt. Fee', value: report.govFeeMin === 0 ? 'Free' : `AED ${report.govFeeMin}–${report.govFeeMax}` },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl border border-[#C9A84C]/12 bg-[#181510] px-4 py-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#8A7D60]">{label}</p>
            <p className="mt-1 text-sm font-medium text-white">{value}</p>
          </div>
        ))}
      </div>

      {report.conditions.length > 0 && (
        <div className="mt-4 rounded-xl border border-[#C9A84C]/15 bg-[#120F0A] px-4 py-3">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-[#8A7D60]">Entry conditions</p>
          <ul className="space-y-1">
            {report.conditions.map((c, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-[#D4C9A8]/70">
                <span className="h-1 w-1 rounded-full bg-[#C9A84C]/50" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function ScoreBar({ label, value, inverted = false }: { label: string; value: number; inverted?: boolean }) {
  const display = inverted ? value : value;
  const color = inverted
    ? value > 60 ? 'bg-red-500' : value > 30 ? 'bg-amber-500' : 'bg-emerald-500'
    : value > 70 ? 'bg-emerald-500' : value > 40 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-xs text-[#D4C9A8]/70">{label}</span>
        <span className="font-mono text-sm font-medium text-white">{display}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#C9A84C]/10">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${display}%` }} />
      </div>
    </div>
  );
}

function ReportScores({ report }: { report: TravelReport }) {
  const { scores } = report;
  const complexityLabels = ['', 'Straightforward', 'Simple', 'Moderate', 'Complex', 'Very Complex'];

  return (
    <div className="rounded-2xl border border-[#C9A84C]/20 bg-[#181510] p-5">
      <p className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[#C9A84C]/70">
        <TrendingUp className="h-3 w-3" /> AI Intelligence Scores
      </p>
      <div className="space-y-4">
        <ScoreBar label="Eligibility Score" value={scores.eligibility} />
        <ScoreBar label="Approval Confidence" value={scores.confidence} />
        <ScoreBar label="Risk Score" value={scores.risk} inverted />
        <ScoreBar label="Application Readiness" value={scores.readiness} />
      </div>
      <div className="mt-4 flex items-center justify-between rounded-xl border border-[#C9A84C]/12 bg-[#120F0A] px-4 py-3">
        <span className="text-xs text-[#D4C9A8]/70">Process Complexity</span>
        <span className="text-xs font-medium text-[#E8CC70]">{complexityLabels[scores.complexity] ?? 'Unknown'}</span>
      </div>
    </div>
  );
}

function ReportTimeline({ report }: { report: TravelReport }) {
  return (
    <div className="rounded-2xl border border-[#C9A84C]/20 bg-[#181510] p-5">
      <p className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[#C9A84C]/70">
        <Clock className="h-3 w-3" /> Processing Timeline
      </p>
      <div className="space-y-2.5">
        {[
          { label: 'Minimum', value: report.processingMin === 0 ? 'Same day' : `${report.processingMin} days` },
          { label: 'Typical', value: report.processingMax === 0 ? 'Instant' : `${report.processingMin}–${report.processingMax} days` },
          ...(report.fastTrackDays ? [{ label: 'Fast Track', value: `${report.fastTrackDays} day${report.fastTrackDays > 1 ? 's' : ''}` }] : []),
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between border-b border-[#C9A84C]/8 pb-2.5 last:border-0">
            <span className="text-xs text-[#D4C9A8]/60">{label}</span>
            <span className="text-sm font-medium text-white">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReportCosts({ report }: { report: TravelReport }) {
  const rows = [
    { label: 'Government Fee', min: report.govFeeMin, max: report.govFeeMax },
    { label: 'DALC Service Fee', min: report.dalcFeeMin, max: report.dalcFeeMax },
    { label: 'Estimated Total', min: report.totalMin, max: report.totalMax, bold: true },
  ];

  return (
    <div className="rounded-2xl border border-[#C9A84C]/20 bg-[#181510] p-5">
      <p className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[#C9A84C]/70">
        <CreditCard className="h-3 w-3" /> Cost Estimator
      </p>
      <div className="space-y-2.5">
        {rows.map(({ label, min, max, bold }) => (
          <div
            key={label}
            className={`flex items-center justify-between border-b border-[#C9A84C]/8 pb-2.5 last:border-0 ${bold ? 'pt-1' : ''}`}
          >
            <span className={`text-xs ${bold ? 'text-[#E8CC70]' : 'text-[#D4C9A8]/60'}`}>{label}</span>
            <span className={`text-sm ${bold ? 'font-semibold text-[#E8CC70]' : 'font-medium text-white'}`}>
              {min === 0 ? 'Free' : `AED ${min.toLocaleString()}–${max.toLocaleString()}`}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[10px] text-[#8A7D60]">Estimates in AED. Actual fees subject to change.</p>
    </div>
  );
}

function ReportDocuments({ report }: { report: TravelReport }) {
  const required = report.documents.filter(d => d.status === 'required');
  const conditional = report.documents.filter(d => d.status === 'conditional');
  const optional = report.documents.filter(d => d.status === 'optional');

  const DocRow = ({ name, notes, status }: { name: string; notes?: string; status: string }) => (
    <li className="flex items-start gap-3 py-2">
      <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${status === 'required' ? 'text-[#C9A84C]' : status === 'conditional' ? 'text-amber-400/60' : 'text-[#8A7D60]'}`} />
      <div>
        <p className="text-sm text-white">{name}</p>
        {notes && <p className="mt-0.5 text-xs text-[#8A7D60]">{notes}</p>}
      </div>
      <span className={`ml-auto shrink-0 rounded-full px-2 py-0.5 text-[10px] font-mono uppercase ${status === 'required' ? 'bg-[#C9A84C]/10 text-[#C9A84C]' : status === 'conditional' ? 'bg-amber-500/10 text-amber-400' : 'bg-[#242118] text-[#8A7D60]'}`}>
        {status}
      </span>
    </li>
  );

  return (
    <div className="rounded-2xl border border-[#C9A84C]/20 bg-[#181510] p-5">
      <p className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[#C9A84C]/70">
        <FileText className="h-3 w-3" /> Document Checklist
      </p>
      <ul className="divide-y divide-[#C9A84C]/8">
        {[...required, ...conditional, ...optional].map((d, i) => (
          <DocRow key={i} {...d} />
        ))}
      </ul>
    </div>
  );
}

const INSIGHT_ICONS: Record<AIInsight['type'], React.ElementType> = {
  risk: Shield, warning: AlertTriangle, tip: Lightbulb, opportunity: TrendingUp,
};
const INSIGHT_STYLES: Record<AIInsight['type'], string> = {
  risk: 'border-red-500/20 bg-red-500/6 text-red-400',
  warning: 'border-amber-500/20 bg-amber-500/6 text-amber-400',
  tip: 'border-sky-500/20 bg-sky-500/6 text-sky-400',
  opportunity: 'border-emerald-500/20 bg-emerald-500/6 text-emerald-400',
};

function ReportInsights({ report }: { report: TravelReport }) {
  if (report.insights.length === 0) return null;

  return (
    <div>
      <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-[#C9A84C]/70">AI Insights & Risk Analysis</p>
      <div className="space-y-3">
        {report.insights.map((insight, i) => {
          const Icon = INSIGHT_ICONS[insight.type];
          const style = INSIGHT_STYLES[insight.type];
          return (
            <div key={i} className={`rounded-xl border p-4 ${style}`}>
              <div className="flex items-start gap-3">
                <Icon className="mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <p className="mb-1 text-sm font-medium">{insight.title}</p>
                  <p className="text-xs opacity-80">{insight.body}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ServiceCard({ service }: { service: DALCService }) {
  return (
    <div className={`rounded-2xl border p-5 transition-all ${service.isPrimary ? 'border-[#C9A84C]/40 bg-[linear-gradient(135deg,rgba(201,168,76,0.10),rgba(201,168,76,0.02))]' : 'border-[#C9A84C]/15 bg-[#181510]'}`}>
      {service.isPrimary && (
        <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-[#C9A84C]">Recommended</p>
      )}
      <h4 className="text-base font-medium text-white">{service.title}</h4>
      <p className="mt-0.5 text-sm text-[#8A7D60]">{service.subtitle}</p>
      <div className="my-3 flex flex-wrap gap-x-4 gap-y-1">
        <span className="text-xs text-[#D4C9A8]/60"><span className="text-[#C9A84C]">Budget:</span> {service.budget}</span>
        <span className="text-xs text-[#D4C9A8]/60"><span className="text-[#C9A84C]">Timeline:</span> {service.timeline}</span>
      </div>
      <ul className="mb-4 space-y-1">
        {service.features.map((f, i) => (
          <li key={i} className="flex items-center gap-2 text-xs text-[#D4C9A8]/70">
            <span className="h-1 w-1 rounded-full bg-[#C9A84C]/60" />
            {f}
          </li>
        ))}
      </ul>
      <a
        href={service.route}
        className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-all ${service.isPrimary ? 'bg-[#C9A84C] text-[#080706] hover:bg-[#E8CC70]' : 'border border-[#C9A84C]/30 text-[#C9A84C] hover:bg-[#C9A84C]/10'}`}
      >
        Learn More <ChevronRight className="h-4 w-4" />
      </a>
    </div>
  );
}

function ReportDALC({ report }: { report: TravelReport }) {
  return (
    <div className="rounded-2xl border border-[#C9A84C]/25 bg-[#0D0B08] p-5">
      <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-[#C9A84C]/70">DALC Recommendations</p>
      <h3 className="mb-1 text-lg font-light text-white">Your Personalised Pathway</h3>
      <p className="mb-5 text-sm text-[#8A7D60]">
        Based on your profile, DALC has identified the optimal services to achieve your goal.
      </p>
      <div className={`grid gap-4 ${report.dalcServices.length > 1 ? 'sm:grid-cols-2' : ''}`}>
        {report.dalcServices.map((s, i) => <ServiceCard key={i} service={s} />)}
      </div>
    </div>
  );
}

// ── Main Export ─────────────────────────────────────────────────────────────────

interface Props {
  report: TravelReport;
  data: VisaFormData;
  onRestart: () => void;
  onShowLead: () => void;
}

export default function IntelligenceReport({ report, data, onRestart, onShowLead }: Props) {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="overflow-hidden rounded-3xl border border-[#C9A84C]/25 bg-[#0D0B08]/92 backdrop-blur-xl">
        <ReportHero report={report} data={data} />

        <div className="space-y-6 px-6 py-8 sm:px-10">
          <div className="grid gap-4 sm:grid-cols-3">
            <ReportScores report={report} />
            <ReportTimeline report={report} />
            <ReportCosts report={report} />
          </div>

          <ReportDocuments report={report} />
          <ReportInsights report={report} />
          <ReportDALC report={report} />
        </div>

        <div className="border-t border-[#C9A84C]/15 bg-[#080706]/60 px-6 py-6 sm:px-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-white">Need personalised assistance?</p>
              <p className="text-xs text-[#8A7D60]">A DALC mobility advisor can manage your full application end-to-end.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onRestart}
                className="rounded-xl border border-[#C9A84C]/25 px-5 py-2.5 text-sm text-[#C9A84C]/70 transition-colors hover:border-[#C9A84C]/50 hover:text-[#C9A84C]"
              >
                New Search
              </button>
              <button
                onClick={onShowLead}
                className="flex items-center gap-2 rounded-xl bg-[#C9A84C] px-5 py-2.5 text-sm font-medium text-[#080706] transition-all hover:bg-[#E8CC70]"
              >
                <MessageCircle className="h-4 w-4" />
                Talk to Advisor
              </button>
              <a
                href="https://wa.me/971000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-2.5 text-sm font-medium text-emerald-400 transition-all hover:bg-emerald-500/20"
              >
                <Phone className="h-4 w-4" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
