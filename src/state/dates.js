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

// Month identity as YYYY-MM — zero-padded so string comparison orders correctly
export function monthKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

// The month a reckoning is due for: the one that just ended
export function prevMonthKey(now = new Date()) {
  return monthKey(new Date(now.getFullYear(), now.getMonth() - 1, 1));
}

export function nextMonthKey(key) {
  const [y, m] = key.split('-').map(Number);
  return monthKey(new Date(y, m, 1)); // m is 1-based, so as a 0-based index it IS next month
}
