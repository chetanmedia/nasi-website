/* Nasi Kitchen Journal: topic filters, reading progress and table-of-contents highlight. */
(function () {
  // topic filter on the index
  const chips = document.querySelector('.chips')
  if (chips) {
    const cards = [...document.querySelectorAll('.feat .card, .grid .card')]
    const empty = document.querySelector('.idx .empty')
    const apply = (f) => {
      chips.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b.dataset.f === f))
      let n = 0
      cards.forEach((c) => { const show = f === 'all' || c.dataset.cluster === f; c.hidden = !show; if (show) n++ })
      if (empty) empty.hidden = n > 0
    }
    chips.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) { apply(b.dataset.f); history.replaceState(null, '', b.dataset.f === 'all' ? location.pathname : '#' + b.dataset.f) } })
    const h = location.hash.slice(1)
    if (h && chips.querySelector(`[data-f="${h}"]`)) apply(h)
  }

  // reading progress
  const bar = document.querySelector('.progress i'), article = document.querySelector('.prose')
  if (bar && article) {
    const upd = () => {
      const r = article.getBoundingClientRect()
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - innerHeight * 0.6)))
      bar.style.width = p * 100 + '%'
    }
    addEventListener('scroll', upd, { passive: true }); upd()
  }

  // toc highlight + keep the app card below the sticky toc
  const toc = document.querySelector('.side .toc')
  if (toc) {
    document.querySelector('.side').style.setProperty('--tocH', toc.offsetHeight + 24 + 'px')
    const links = [...toc.querySelectorAll('a')]
    const heads = links.map((a) => document.getElementById(a.getAttribute('href').slice(1))).filter(Boolean)
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) links.forEach((a) => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id)) })
    }, { rootMargin: '-20% 0px -70% 0px' })
    heads.forEach((h) => io.observe(h))
  }
})()
