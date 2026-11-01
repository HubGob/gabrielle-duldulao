// shared typing engine for the live-code pages.
// lines: [[highlighted html, reveal key?], ...]; preview elements with data-on="<key>" fade in when their line is typed.
function startEditor(lines) {
  const pre = document.getElementById('code'), pos = document.getElementById('pos');
  const reveal = key => key && document.querySelectorAll(`[data-on="${key}"]`).forEach(el => el.classList.add('in'));
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    pre.innerHTML = lines.map(([h]) => `<span class="l">${h}</span>`).join('') + '<span class="l"><span class="caret"></span></span>';
    lines.forEach(([, k]) => reveal(k));
    // load the blueprint page into the preview once the code is "run", so its own intro plays then
    document.querySelectorAll('iframe[data-src]').forEach(f => f.src = f.dataset.src);
    pos.textContent = `Ln ${lines.length + 1}, Col 1`;
  };

  const clock = document.getElementById('clock');
  const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Manila', hour: '2-digit', minute: '2-digit' });
  const tick = () => clock.textContent = 'BGO ' + fmt.format(new Date());
  tick(); setInterval(tick, 10000);

  document.getElementById('skip').onclick = finish;
  // ← / → open the previous / next page in the explorer
  const pages = [...document.querySelectorAll('.files a')], cur = pages.findIndex(a => a.classList.contains('on'));
  addEventListener('keydown', e => {
    const d = { ArrowLeft: -1, ArrowRight: 1 }[e.key];
    if (d && !e.altKey && !e.ctrlKey && !e.metaKey) pages[cur + d]?.click();
  });
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || innerWidth <= 760) {
    document.documentElement.classList.remove('js'); finish(); return;
  }

  // type plain text two chars per tick, swap in the highlighted line when it completes
  let li = 0, ci = 0;
  const plain = lines.map(([h]) => h.replace(/<[^>]+>/g, ''));
  const step = () => {
    if (done) return;
    if (li === lines.length) return finish();
    const typed = lines.slice(0, li).map(([h]) => `<span class="l">${h}</span>`).join('');
    const cur = plain[li].slice(0, ci).replace(/&/g, '&amp;').replace(/</g, '&lt;');
    pre.innerHTML = typed + `<span class="l">${cur}<span class="caret"></span></span>`;
    pos.textContent = `Ln ${li + 1}, Col ${ci + 1}`;
    if (ci < plain[li].length) { ci += 2; setTimeout(step, 13); }
    else { reveal(lines[li][1]); li++; ci = 0; setTimeout(step, 85); }
  };
  setTimeout(step, 400);
}
