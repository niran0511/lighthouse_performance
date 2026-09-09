export const formatSeconds = (value) => (Number.isFinite(value) ? `${value.toFixed(value < 1 ? 2 : 1)} s` : '—');
export const formatMilliseconds = (value) => (Number.isFinite(value) ? `${Math.round(value)} ms` : '—');
export const formatCls = (value) => (Number.isFinite(value) ? value.toFixed(3) : '—');
export const formatDate = (value) => (value ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : '—');
export const truncateUrl = (value, limit = 50) => (value?.length > limit ? `${value.slice(0, limit)}…` : value || '—');

