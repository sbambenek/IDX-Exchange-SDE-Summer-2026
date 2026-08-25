export function formatPrice(price) {
  if (price === null || price === undefined) return 'Price not available';
  return `$${Number(price).toLocaleString()}`;
}

export function formatTime(timeString) {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':');
  const hourNum = parseInt(hours, 10);
  const ampm = hourNum >= 12 ? 'PM' : 'AM';
  const displayHour = hourNum % 12 === 0 ? 12 : hourNum % 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

export function formatOpenHouseDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}