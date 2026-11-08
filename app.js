/* =====================================================================
   个人主页 · 渲染逻辑
   （一般不需要修改这个文件；要改内容请编辑 data.js）
   ===================================================================== */

(function () {
  const P = window.PROFILE || {};

  /* 简单转义，防止内容里的特殊字符破坏页面 */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  /* 区块通用：左侧标签 + 右侧内容 */
  function section(id, num, title, body, extraClass) {
    return `
      <section class="section reveal ${extraClass || ''}" id="${id}">
        <div class="section-label">
          <span class="section-num">${num}</span>
          <h2>${esc(title)}</h2>
        </div>
        <div class="section-body">${body}</div>
      </section>`;
  }

  /* ---------------- 顶部导航品牌 ---------------- */
  document.getElementById('navBrand').innerHTML =
    `<span class="brand-dot"></span>${esc(P.name)}`;
  document.title = `${P.name} · 个人主页`;

  /* ---------------- Hero ---------------- */
  const avatar = P.photo
    ? `<img src="${esc(P.photo)}" alt="${esc(P.name)}">`
    : esc((P.name || '我').trim().charAt(0));

  const hero = `
    <section class="hero" id="top">
      <div class="hero-bg" aria-hidden="true"></div>
      <div class="hero-inner">
        <div class="hero-left">
          <div class="eyebrow"><span class="dot"></span>${esc(P.title || '')}</div>
          <h1 class="hero-name">${esc(P.name || '你的名字')}</h1>
          <p class="hero-tagline">${esc(P.tagline || '')}</p>
          <p class="hero-summary">${esc(P.summary || '')}</p>
          <div class="hero-actions no-print">
            <a class="btn btn-primary" href="#experience">查看我的经历</a>
            <a class="btn btn-ghost" href="#contact">联系我</a>
          </div>
          <div class="hero-info">
            ${(P.info || []).map(i => `
              <div class="info-row">
                <span class="info-k">${esc(i.label)}</span>
                <span class="info-v">${esc(i.value)}</span>
              </div>`).join('')}
          </div>
        </div>
        <div class="hero-right">
          <div class="profile-card">
            <div class="avatar">${avatar}</div>
            <div class="profile-name">${esc(P.name || '')}</div>
            <div class="profile-sub">${esc(P.title || '')}</div>
            <div class="profile-stats">
              ${(P.stats || []).map(s => `
                <div class="pstat">
                  <b>${esc(s.value)}</b>
                  <span>${esc(s.label)}</span>
                </div>`).join('')}
            </div>
          </div>
        </div>
      </div>
    </section>`;

  /* ---------------- 教育背景 ---------------- */
  const eduBody = (P.education || []).map(e => `
    <div class="edu-card reveal">
      <div class="edu-top">
        <div>
          <h3 class="edu-school">${esc(e.school)}</h3>
          <div class="edu-major">${esc(e.major)}</div>
        </div>
        <div class="edu-period">${esc(e.period)}</div>
      </div>
      ${e.gpa ? `<div class="edu-gpa">${esc(e.gpa)}</div>` : ''}
      ${e.courses ? `<div class="edu-courses"><span class="k">主修课程</span>${esc(e.courses)}</div>` : ''}
      ${(e.highlights || []).length ? `
        <ul class="bullets">
          ${e.highlights.map(h => `<li>${esc(h)}</li>`).join('')}
        </ul>` : ''}
    </div>`).join('');

  /* ---------------- 成长历程（时间线） ---------------- */
  const growthBody = `
    <div class="timeline">
      ${(P.growth || []).map(g => `
        <div class="tl-item reveal">
          <div class="tl-year">${esc(g.year)}</div>
          <div class="tl-card">
            <h3>${esc(g.title)}</h3>
            <p>${esc(g.desc)}</p>
          </div>
        </div>`).join('')}
    </div>
    <p class="timeline-note">这条时间线记录了我从零基础到能独立负责项目的完整过程。</p>`;

  /* ---------------- 详情弹层：数据登记 ---------------- */
  const detailLookup = {};   // slug -> 数据条目

  function hasDetail(it) {
    return (it.details && it.details.length) ||
           (it.links && it.links.length) ||
           (it.images && it.images.length);
  }
  const slugOf = (kind, i) => (kind === 'proj' ? 'proj-' : 'exp-') + (i + 1);

  /* ---------------- 实践经历 ---------------- */
  const expBody = (P.experience || []).map((x, i) => {
    const clickable = hasDetail(x);
    if (clickable) detailLookup[slugOf('exp', i)] = x;
    return `
    <div class="exp-card reveal ${clickable ? 'has-detail' : ''}" ${clickable ? `data-slug="${slugOf('exp', i)}"` : ''}>
      <div class="exp-head">
        <div>
          <h3>${esc(x.org)}</h3>
          <div class="exp-role">${esc(x.role)}</div>
        </div>
        <div class="exp-period">${esc(x.period)}</div>
      </div>
      <ul class="bullets">
        ${(x.points || []).map(p => `<li>${esc(p)}</li>`).join('')}
      </ul>
      ${clickable ? `<div class="detail-btn">查看详情 →</div>` : ''}
    </div>`;
  }).join('');

  /* ---------------- 项目作品 ---------------- */
  const projBody = `
    <div class="proj-grid">
      ${(P.projects || []).map((pr, i) => {
        const clickable = hasDetail(pr);
        if (clickable) detailLookup[slugOf('proj', i)] = pr;
        return `
        <article class="proj-card reveal ${clickable ? 'has-detail' : ''}" ${clickable ? `data-slug="${slugOf('proj', i)}"` : ''}>
          <div class="proj-top">
            <h3>${esc(pr.name)}</h3>
            <span class="proj-period">${esc(pr.period)}</span>
          </div>
          <div class="proj-role">${esc(pr.role)}</div>
          <p class="proj-desc">${esc(pr.desc)}</p>
          ${pr.metric ? `<div class="proj-metric">📈 ${esc(pr.metric)}</div>` : ''}
          <div class="tags">
            ${(pr.tags || []).map(t => `<span class="tag">${esc(t)}</span>`).join('')}
          </div>
          ${clickable ? `<div class="detail-btn">查看详情 →</div>` : ''}
        </article>`;
      }).join('')}
    </div>`;

  /* ---------------- 技能 ---------------- */
  const skillBody = `
    <div class="skills">
      ${(P.skills || []).map(s => `
        <div class="skill-row reveal">
          <div class="skill-head">
            <span class="skill-group">${esc(s.group)}</span>
            <span class="skill-level">${esc(s.level)}</span>
          </div>
          <div class="tags">
            ${(s.items || []).map(i => `<span class="tag tag-soft">${esc(i)}</span>`).join('')}
          </div>
        </div>`).join('')}
    </div>`;

  /* ---------------- 荣誉 ---------------- */
  const awardBody = `
    <div class="awards">
      ${(P.awards || []).map(a => `
        <div class="award-row reveal">
          <span class="award-year">${esc(a.year)}</span>
          <span class="award-name">${esc(a.name)}</span>
          <span class="award-level">${esc(a.level)}</span>
        </div>`).join('')}
    </div>`;

  /* ---------------- 联系 ---------------- */
  const c = P.contact || {};

  /* 按邮箱地址生成对应的网页写信直达按钮（QQ 邮箱 / Gmail 各有官方写信入口） */
  function webMailBtn(addr) {
    if (!addr) return '';
    if (addr.includes('@qq.com')) {
      return `<a class="btn btn-ghost" target="_blank" rel="noopener" href="https://mail.qq.com/cgi-bin/qm_share?t=qm_mailme&email=${encodeURIComponent(addr)}">QQ 邮箱写信</a>`;
    }
    if (addr.includes('@gmail.com')) {
      return `<a class="btn btn-ghost" target="_blank" rel="noopener" href="https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(addr)}">Gmail 写信</a>`;
    }
    return '';
  }

  const contactBody = `
    <div class="contact-card reveal">
      <h3>期待与你交流</h3>
      <p class="contact-note">${esc(c.note || '')}</p>
      <div class="contact-grid">
        ${c.email ? `<a class="contact-item" href="mailto:${esc(c.email)}"><span class="ci-k">邮箱</span><span class="ci-v">${esc(c.email)}</span></a>` : ''}
        ${c.email2 ? `<a class="contact-item" href="mailto:${esc(c.email2)}"><span class="ci-k">备用邮箱</span><span class="ci-v">${esc(c.email2)}</span></a>` : ''}
        ${c.phone ? `<div class="contact-item"><span class="ci-k">电话</span><span class="ci-v">${esc(c.phone)}</span></div>` : ''}
        ${c.wechat ? `<div class="contact-item"><span class="ci-k">微信</span><span class="ci-v">${esc(c.wechat)}</span></div>` : ''}
        ${c.github ? `<div class="contact-item"><span class="ci-k">GitHub</span><span class="ci-v">${esc(c.github)}</span></div>` : ''}
      </div>
      <div class="contact-actions no-print">
        ${c.email ? `<a class="btn btn-primary" href="mailto:${esc(c.email)}">发送邮件</a>` : ''}
        ${webMailBtn(c.email)}
        ${webMailBtn(c.email2)}
        <button class="btn btn-ghost" onclick="window.print()">打印 / 存为 PDF</button>
      </div>
    </div>`;

  /* ---------------- 组装 ---------------- */
  document.getElementById('app').innerHTML = [
    hero,
    section('about', '01', '关于我', `
      <p class="lead">${esc(P.summary || '')}</p>
      <div class="about-grid">
        ${(P.info || []).slice(0, 4).map(i => `
          <div class="about-item">
            <span class="ai-k">${esc(i.label)}</span>
            <span class="ai-v">${esc(i.value)}</span>
          </div>`).join('')}
      </div>`),
    section('education', '02', '教育背景', eduBody),
    section('growth', '03', '成长历程', growthBody),
    section('experience', '04', '实践经历', expBody),
    section('projects', '05', '项目作品', projBody),
    section('skills', '06', '专业技能', skillBody),
    section('awards', '07', '荣誉证书', awardBody),
    section('contact', '08', '联系我', contactBody)
  ].join('');

  document.getElementById('footer').innerHTML = `
    <div class="footer-inner">
      <span>${esc(P.footer || '')}</span>
      <span class="footer-name">${esc(P.name || '')}</span>
    </div>`;

  /* ---------------- 详情弹层：打开 / 关闭 / 深链 ---------------- */
  let modalOverlay = null, modalContent = null;

  function ensureOverlay() {
    if (modalOverlay) return;
    modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay no-print';
    modalOverlay.innerHTML = `
      <div class="modal-box" role="dialog" aria-modal="true">
        <button class="modal-close" aria-label="关闭详情">✕</button>
        <div class="modal-content"></div>
      </div>`;
    document.body.appendChild(modalOverlay);
    modalContent = modalOverlay.querySelector('.modal-content');
    modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
    modalOverlay.querySelector('.modal-close').addEventListener('click', closeModal);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  }

  function openModal(item, slug) {
    ensureOverlay();
    const imgs = (item.images || []).map(f =>
      `<img class="d-img" src="${esc(f)}" alt="${esc(item.name || item.org || '')}">`).join('');
    const secs = (item.details || []).map(d =>
      `<div class="d-sec"><h4>${esc(d.h)}</h4><p>${esc(d.p)}</p></div>`).join('');
    const links = (item.links || []).map(l =>
      `<a class="d-link" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)} ↗</a>`).join('');
    modalContent.innerHTML = `
      <div class="d-head">
        <h3>${esc(item.name || item.org || '')}</h3>
        ${item.role ? `<div class="d-sub">${esc(item.role)}</div>` : ''}
        ${item.period ? `<div class="d-period">${esc(item.period)}</div>` : ''}
      </div>
      ${item.video ? `<video class="d-video" controls preload="none" playsinline poster="${esc(item.video.poster || '')}" src="${esc(item.video.src)}"></video>` : ''}
      ${imgs ? `<div class="d-imgs">${imgs}</div>` : ''}
      ${secs}
      ${links ? `<div class="d-links">${links}</div>` : ''}`;
    modalOverlay.classList.add('show');
    document.body.classList.add('modal-open');
    if (slug) history.replaceState(null, '', '#' + slug);
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('show');
    document.body.classList.remove('modal-open');
    history.replaceState(null, '', location.pathname + location.search);
  }

  document.querySelectorAll('.has-detail').forEach(card => {
    card.addEventListener('click', () => {
      const item = detailLookup[card.dataset.slug];
      if (item) openModal(item, card.dataset.slug);
    });
  });

  /* 支持 #proj-1 / #exp-1 这类链接直达弹层（方便把某个项目单独发给别人） */
  const direct = location.hash && location.hash.slice(1);
  if (direct && detailLookup[direct]) openModal(detailLookup[direct], direct);

  /* ---------------- 滚动到当前区块时高亮导航 ---------------- */
  const links = Array.from(document.querySelectorAll('.nav-links a'));
  const map = {};
  links.forEach(a => { map[a.getAttribute('href').slice(1)] = a; });

  const spy = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const link = map[en.target.id];
      if (!link) return;
      links.forEach(a => a.classList.remove('active'));
      link.classList.add('active');
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  document.querySelectorAll('section[id]').forEach(s => spy.observe(s));

  /* ---------------- 滚动淡入 ---------------- */
  const revealer = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('in');
        revealer.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = Math.min(i % 4 * 60, 180) + 'ms';
    revealer.observe(el);
  });

  /* ---------------- 导航加阴影 ---------------- */
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
