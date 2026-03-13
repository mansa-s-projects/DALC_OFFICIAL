import { RequestStatus, REQUEST_STATUS_LABELS, REQUEST_STATUS_COLORS } from '../../types';

interface RequestStatusBadgeProps {
  status: RequestStatus;
}

export default function RequestStatusBadge({ status }: RequestStatusBadgeProps) {
  const label = REQUEST_STATUS_LABELS[status] ?? status;
  const colors = REQUEST_STATUS_COLORS[status] ?? 'text-gray-400 bg-gray-400/10 border-gray-400/20';

  return (
    <span className={`inline-flex items-center px-3 py-1 text-[10px] font-bold uppercase tracking-widest border rounded-full ${colors}`}>
      {label}
    </span>
  );
}
