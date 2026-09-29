const toggle = document.getElementById('theme-toggle');

toggle.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('theme', next);
});

// Follow the OS preference while the visitor has not made an explicit choice.
matchMedia('(prefers-color-scheme: light)').addEventListener('change', (event) => {
  if (localStorage.getItem('theme')) return;
  document.documentElement.dataset.theme = event.matches ? 'light' : 'dark';
});
