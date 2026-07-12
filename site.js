/* =========================================================================
   Sophia Roth — shared site chrome
   Renders the nav (with hover dropdowns), the pre-footer booking strip, the
   footer and the SVG icon sprite into every page, so there is ONE place to
   edit them. Each page sets <body data-page="..."> to light the right tab.

   Runs as a deferred script, so the DOM is already parsed when this executes.
   ========================================================================= */
(function () {
  "use strict";

  /* ---- navigation model -------------------------------------------------
     Each top-level tab may carry a `children` dropdown. `page` values match
     the <body data-page="..."> on the matching file.                       */
  const NAV = [
    { label: "Home", href: "index.html", page: "home" },
    {
      label: "Services", href: "services.html", page: "services",
      children: [
        { label: "Homework help", href: "homework-help.html", page: "homework-help" },
        { label: "Language tuition", href: "language-tuition.html", page: "language-tuition" },
        { label: "SATs & 11+ prep", href: "sats-11-plus.html", page: "sats-11-plus" },
        { label: "Tutoring for ages 5–11", href: "tutoring-5-11.html", page: "tutoring-5-11" },
        { label: "Babysitting", href: "babysitting.html", page: "babysitting" },
      ],
    },
    { label: "SEN", href: "sen.html", page: "sen" },
    {
      label: "About", href: "about.html", page: "about",
      children: [
        { label: "Experience", href: "experience.html", page: "experience" },
        { label: "Book shelf", href: "bookshelf.html", page: "bookshelf" },
      ],
    },
  ];

  const current = document.body.dataset.page || "home";
  const isActive = (item) =>
    item.page === current || (item.children || []).some((c) => c.page === current);

  const caret =
    '<svg class="nav__caret" viewBox="0 0 12 8" aria-hidden="true"><path d="M1 1l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  /* ---- desktop + mobile nav markup ------------------------------------- */
  function navLinksHTML() {
    return NAV.map((item) => {
      const active = isActive(item) ? " is-active" : "";
      if (!item.children) {
        return `<div class="nav__item${active}"><a href="${item.href}">${item.label}</a></div>`;
      }
      const menu = item.children
        .map(
          (c) =>
            `<a href="${c.href}"${c.page === current ? ' class="is-current"' : ""}>${c.label}</a>`
        )
        .join("");
      return `
        <div class="nav__item nav__item--has-menu${active}">
          <a href="${item.href}" aria-haspopup="true">${item.label} ${caret}</a>
          <div class="nav__menu" role="menu">${menu}</div>
        </div>`;
    }).join("");
  }

  function mobileLinksHTML() {
    return NAV.map((item) => {
      const active = isActive(item) ? " is-active" : "";
      let html = `<a class="m-link${active}" href="${item.href}">${item.label}</a>`;
      if (item.children) {
        html += `<div class="m-sub">${item.children
          .map(
            (c) =>
              `<a href="${c.href}"${c.page === current ? ' class="is-current"' : ""}>${c.label}</a>`
          )
          .join("")}</div>`;
      }
      return html;
    }).join("");
  }

  const headerHTML = `
  <header class="nav" data-nav>
    <div class="container nav__inner">
      <a class="brand" href="index.html" aria-label="Sophia Roth — home">
        <span class="brand__mark" aria-hidden="true">S</span>
        <span class="brand__text">
          <span class="brand__name">Sophia Roth</span>
          <span class="brand__role">Tutor · Teacher · Childcare</span>
        </span>
      </a>
      <nav class="nav__links" aria-label="Primary">${navLinksHTML()}</nav>
      <a href="index.html#book" class="btn btn--primary nav__cta" data-book="intro">Book a free call</a>
      <button class="nav__toggle" aria-label="Open menu" aria-expanded="false" data-menu-toggle>
        <span></span><span></span><span></span>
      </button>
    </div>
    <div class="mobile-menu" data-mobile-menu hidden>
      ${mobileLinksHTML()}
      <a href="index.html#book" class="btn btn--primary" data-book="intro">Book a free call</a>
    </div>
  </header>`;

  /* ---- pre-footer booking strip + footer ------------------------------- */
  const bookStripHTML = `
  <section class="bookstrip">
    <div class="container bookstrip__inner reveal">
      <div>
        <p class="eyebrow">Ready when you are</p>
        <h2 class="bookstrip__title">Let's find the right start for your child</h2>
        <p class="bookstrip__sub">A gentle, no-pressure introductory call is the easiest place to begin — or message me and I'll come straight back to you.</p>
      </div>
      <div class="bookstrip__cta">
        <a href="index.html#book" class="btn btn--primary btn--lg" data-book="intro">Book a free intro call</a>
        <a class="btn btn--soft btn--lg" data-whatsapp href="#">Message me on WhatsApp</a>
      </div>
    </div>
  </section>`;

  const footerHTML = `
  <footer class="footer">
    <div class="container footer__inner">
      <div class="footer__brand">
        <span class="brand__mark" aria-hidden="true">S</span>
        <div>
          <strong>Sophia Roth</strong>
          <p>Tutoring, English &amp; childcare — Durham &amp; online.</p>
        </div>
      </div>
      <nav class="footer__links" aria-label="Footer">
        <a href="services.html">Services</a>
        <a href="sen.html">SEN</a>
        <a href="about.html">About</a>
        <a href="experience.html">Experience</a>
        <a href="index.html#book">Book</a>
      </nav>
      <div class="footer__meta">
        <p>DBS checked · St John's College, Durham</p>
        <p>© <span data-year>2026</span> Sophia Roth</p>
      </div>
    </div>
  </footer>`;

  const spriteHTML = `
  <svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">
    <defs>
      <symbol id="i-shield" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"/><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4"/></symbol>
      <symbol id="i-cap" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M12 4L2 9l10 5 10-5-10-5z"/><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M6 11v5c0 1 2.5 3 6 3s6-2 6-3v-5M22 9v5"/></symbol>
      <symbol id="i-globe" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><path fill="none" stroke="currentColor" stroke-width="1.8" d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18"/></symbol>
      <symbol id="i-star" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.6l1-5.8L3.5 9.7l5.9-.9L12 3z"/></symbol>
      <symbol id="i-chat" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M4 5h16v11H9l-4 3v-3H4z"/><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" d="M8 9h8M8 12h5"/></symbol>
      <symbol id="i-heart" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M12 20s-7-4.4-7-9.5A3.5 3.5 0 0 1 12 8a3.5 3.5 0 0 1 7 2.5C19 15.6 12 20 12 20z"/></symbol>
      <symbol id="i-book" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M4 5a2 2 0 0 1 2-2h6v16H6a2 2 0 0 0-2 2zM20 5a2 2 0 0 0-2-2h-6v16h6a2 2 0 0 1 2 2z"/></symbol>
      <symbol id="i-puzzle" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M10 4a2 2 0 1 1 4 0v2h3v3a2 2 0 1 0 0 4v3h-3a2 2 0 1 0-4 0H7v-3a2 2 0 1 1 0-4V6h3z"/></symbol>
      <symbol id="i-sprout" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M12 21v-7M12 14C12 9 8 7 4 7c0 5 4 7 8 7zM12 12c0-4 4-6 8-6 0 4-4 6-8 6z"/></symbol>
      <symbol id="i-pencil" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17v3zM14 7l3 3"/></symbol>
      <symbol id="i-abc" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M3 17l2.5-8L8 17M3.7 14.5h3.6M13 9h3.5M13 9v8h3.6M13 13h3M20 9v8"/></symbol>
      <symbol id="i-mail" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M4 7l8 6 8-6"/></symbol>
      <symbol id="i-phone" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M5 4h3l1.5 4-2 1.5a12 12 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></symbol>
      <symbol id="i-whatsapp" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M4 20l1.4-4A8 8 0 1 1 9 19.2L4 20z"/><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M9 9c0 3 3 6 6 6 1 0 1.5-1 1.5-1l-2-1-1 1c-1 0-2.5-1.5-2.5-2.5l1-1-1-2S9 8 9 9z"/></symbol>
      <symbol id="i-gift" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M20 12v8H4v-8M2 7h20v5H2zM12 7v13M12 7C12 7 11 3 8.5 3.5S9.5 7 12 7zM12 7s1-4 3.5-3.5S16 7 12 7z"/></symbol>
      <symbol id="i-medal" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M8.5 3l3 6M15.5 3l-3 6"/><circle cx="12" cy="15" r="6" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="15" r="2" fill="none" stroke="currentColor" stroke-width="1.8"/></symbol>
      <symbol id="i-palette" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M12 3a9 9 0 0 0 0 18c1.1 0 1.8-.9 1.8-1.8 0-.5-.2-.9-.5-1.2-.3-.4-.5-.8-.5-1.2 0-.9.7-1.6 1.6-1.6H16a5 5 0 0 0 5-5c0-3.9-4-7.2-9-7.2z"/><circle cx="7.5" cy="11.5" r="1" fill="currentColor"/><circle cx="12" cy="8" r="1" fill="currentColor"/><circle cx="16" cy="11" r="1" fill="currentColor"/></symbol>
      <symbol id="i-aid" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="4" fill="none" stroke="currentColor" stroke-width="1.8"/><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" d="M12 8v8M8 12h8"/></symbol>
      <symbol id="i-anchor" viewBox="0 0 24 24"><circle cx="12" cy="5" r="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M12 7v13M5 12a7 7 0 0 0 14 0M4 12H3m18 0h-2"/></symbol>
      <symbol id="i-pin" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/></symbol>
    </defs>
  </svg>`;

  /* ---- mount ----------------------------------------------------------- */
  const headSlot = document.querySelector("[data-site-header]");
  if (headSlot) headSlot.outerHTML = headerHTML;

  const footSlot = document.querySelector("[data-site-footer]");
  if (footSlot) footSlot.outerHTML = bookStripHTML + footerHTML;

  document.body.insertAdjacentHTML("beforeend", spriteHTML);

  /* ---- mobile dropdown: tap a parent tab to expand its sub-links -------- */
  document.querySelectorAll(".mobile-menu .m-link").forEach((link) => {
    const sub = link.nextElementSibling;
    if (sub && sub.classList.contains("m-sub")) {
      link.classList.add("has-sub");
      link.addEventListener("click", (e) => {
        // First tap opens the sub-menu; the label link still works on the row's <a>s.
        if (!sub.classList.contains("is-open")) {
          e.preventDefault();
          sub.classList.add("is-open");
          link.classList.add("is-open");
        }
      });
    }
  });
})();
