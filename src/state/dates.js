// All dates are the player's LOCAL calendar — quests follow their real day.

export function todayStr(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function yesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return todayStr(d);
}

// Monday of the current local week, as YYYY-MM-DD
export function weekStartStr(d = new Date()) {
  const copy = new Date(d);
  const dow = (copy.getDay() + 6) % 7; // Mon=0 .. Sun=6
  copy.setDate(copy.getDate() - dow);
  return todayStr(copy);
}

// First day of the current local month, as YYYY-MM-DD
export function monthStartStr(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
}

export function countdownTo(isoString) {
  const ms = new Date(isoString).getTime() - Date.now();
  if (ms <= 0) return { past: true, days: 0, hours: 0, minutes: 0 };
  const minutes = Math.floor(ms / 60000);
  return {
    past: false,
    days: Math.floor(minutes / 1440),
    hours: Math.floor((minutes % 1440) / 60),
    minutes: minutes % 60,
  };
}
