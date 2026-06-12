let container;
let lastText = '';
let lastAt = 0;

// style: '' | 'gold' (rewards) | 'grim' (dark omens)
export function toast(text, style = '') {
  if (!container) container = document.getElementById('toasts');
  const now = performance.now();
  if (text === lastText && now - lastAt < 2500) return; // don't spam the same line
  lastText = text;
  lastAt = now;

  const div = document.createElement('div');
  div.className = 'toast' + (style ? ` toast-${style}` : '');
  div.textContent = text;
  container.appendChild(div);
  while (container.children.length > 4) container.removeChild(container.firstChild);
  div.addEventListener('animationend', () => div.remove());
}
