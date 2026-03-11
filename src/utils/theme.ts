export function getInitialTheme(): 'sang' | 'toi' {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('chuDe');
    if (savedTheme === 'sang' || savedTheme === 'toi') {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'toi' : 'sang';
  }
  return 'sang';
}

export function applyTheme(theme: 'sang' | 'toi') {
  document.documentElement.setAttribute('data-chu-de', theme);
  localStorage.setItem('chuDe', theme);
}
