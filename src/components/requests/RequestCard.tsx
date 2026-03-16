import { Calendar, Users, MapPin } from 'lucide-react';
import { Request } from '../../types';
import RequestStatusBadge from './RequestStatusBadge';

interface RequestCardProps {
  request: Request;
}

export default function RequestCard({ request }: RequestCardProps) {
  const dateStr = request.date_time
    ? new Date(request.date_time).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      })
    : request.preferred_date || 'TBD';

  const requestTitle = request.title || request.venue_name || request.category;
  const guestCount = Math.max(request.party_size || 0, 1);
  const description = request.description || request.notes;

  return (
    <div className="glass-panel p-6 rounded-sm border border-white/5 hover:border-luxury-gold/20 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-white font-display text-lg">
            {requestTitle}
          </h3>
          <p className="text-gray-500 text-xs uppercase tracking-wider mt-1">
            {request.concierge_request_type ?? request.request_type ?? 'booking'}
          </p>
        </div>
        <RequestStatusBadge status={request.status} />
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-gray-400">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-luxury-gold" />
          <span>{dateStr}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-luxury-gold" />
          <span>{guestCount} guests</span>
        </div>
        {request.venue_name && (
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-luxury-gold" />
            <span>{request.venue_name}</span>
          </div>
        )}
      </div>

      {description && (
        <p className="text-gray-500 text-sm mt-3 line-clamp-2">{description}</p>
      )}

      {request.created_at && (
        <p className="text-gray-600 text-xs mt-4">
          Submitted {new Date(request.created_at).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}
