// shared behaviour for the blueprint-grid pages: live Baguio clock + cursor crosshair
(() => {
  const clock = document.getElementById('clock');
  if (clock) {
    const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Manila', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const tick = () => clock.textContent = 'BGO ' + fmt.format(new Date());
    tick(); setInterval(tick, 1000);
  }

  // shown inside the code-editor variant's preview: page links switch the whole editor, not just the frame
  if (self !== top) document.querySelectorAll('a[href$=".html"]').forEach(a => {
    a.target = '_top';
    const ide = { 'index.html': '../index.html', 'education.html': '../education.html' }[a.getAttribute('href')];
    if (ide) a.href = ide;
  });

  document.body.insertAdjacentHTML('beforeend',
    '<div class="cross" aria-hidden="true"><div class="x"></div><div class="y"></div><div class="xy"></div></div>');
  const cross = document.body.lastElementChild;
  const [x, y, xy] = cross.children;
  addEventListener('mousemove', e => {
    cross.classList.add('on');
    x.style.top = e.clientY + 'px';
    y.style.left = e.clientX + 'px';
    xy.textContent = `x:${e.clientX} y:${e.clientY}`;
    xy.style.left = Math.min(e.clientX + 10, innerWidth - 90) + 'px';
    xy.style.top = Math.min(e.clientY + 10, innerHeight - 20) + 'px';
  });
  document.addEventListener('mouseleave', () => cross.classList.remove('on'));
})();
