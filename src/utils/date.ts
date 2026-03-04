export function todayKey(): string {
  return new Date().toISOString().split('T')[0];
}

export function formatDateDisplay(dateKey: string): string {
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

export function getGreeting(nickname: string): string {
  const hour = new Date().getHours();
  if (hour < 12) return `¡Buenos días, ${nickname}! 🌅`;
  if (hour < 18) return `¡Buenas tardes, ${nickname}! ☀️`;
  return `¡Buenas noches, ${nickname}! 🌙`;
}

export function getMondayOfCurrentWeek(): Date {
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(today.setDate(diff));
}
