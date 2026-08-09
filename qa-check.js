// Run in browser console on each page during QA.
(() => {
  const required = ['firebase','db'];
  console.table(required.map(k => ({name:k, ok: !!window[k]})));
  console.log('Page:', location.pathname, 'Viewport:', innerWidth + 'x' + innerHeight);
  console.log('CSS files:', [...document.querySelectorAll('link[rel="stylesheet"]')].map(x => x.href));
})();
