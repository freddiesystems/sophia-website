/* =========================================================================
   Sophia Roth — site behaviour  (real booking + payment)
   =========================================================================

   ▶ SET-UP — fill in CONFIG below. Full walk-through in README.md.

   BOOKING  → Cal.com (free plan, unlimited event types).
              Put your Cal.com username in cal.user and create 4 event types
              with the slugs listed in cal.events.

   PAYMENT  → Stripe (UK cards 1.5% + 20p, no monthly/hidden fees).
              For the two £15 trials, paste a Stripe Payment Link in payments.*.
              Set each link's "after payment" redirect to the matching Cal.com
              trial page, so parents pay then pick their time in one smooth go.
              (Leave payments.* blank to instead collect the £15 inside Cal.com.)

   Everything degrades gracefully: with CONFIG blank the buttons glide to a
   WhatsApp / email / phone card, so the site still converts on day one.
   ========================================================================= */

const CONFIG = {
  cal: {
    user: "sophiaroth", // Sophia's Cal.com username — booking is live
    events: {
      intro: "intro-call", // free 15-min intro call
      english: "english-trial", // £15 English (TEFL) trial hour
      sats: "sats-trial", // £15 11+/SATs trial hour
      babysitting: "babysitting-call", // free meet-first call
    },
  },

  // Optional — Stripe Payment Links for the £15 trials (recommended for lowest fees).
  // Leave blank to collect the trial fee inside Cal.com instead.
  payments: {
    english: "", // Stripe Payment Link (£15) → redirect to your Cal "english-trial"
    sats: "", // Stripe Payment Link (£15) → redirect to your Cal "sats-trial"
  },

  whatsapp: "447852468040", // international format, no "+" or spaces
  email: "sophiaroth1@icloud.com",
  phone: "+447852468040",
};

/* ----------------------------------------------------------------------- */

(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- footer year ---------- */
  const yearEl = $("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- sticky nav state ---------- */
  const nav = $("[data-nav]");
  const onScroll = () => nav && nav.classList.toggle("is-scrolled", window.scrollY > 12);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- mobile menu ---------- */
  const toggle = $("[data-menu-toggle]");
  const menu = $("[data-mobile-menu]");
  const setMenu = (open) => {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", String(open));
    menu.hidden = !open;
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };
  if (toggle && menu) {
    toggle.addEventListener("click", () => setMenu(menu.hidden));
    // Close the menu when a real navigation link is tapped — but NOT when
    // tapping a parent tab that only expands its sub-links (site.js handles that).
    $$("a", menu).forEach((a) => {
      if (a.classList.contains("has-sub")) return;
      a.addEventListener("click", () => setMenu(false));
    });
  }

  /* ---------- reveal on scroll ---------- */
  const reveals = $$(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const delay = Number(el.dataset.revealDelay || 0);
          setTimeout(() => el.classList.add("is-in"), delay);
          io.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  /* ---------- bookshelf filter ---------- */
  const chips = $$(".chip");
  const books = $$(".book");
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const filter = chip.dataset.filter;
      chips.forEach((c) => {
        const active = c === chip;
        c.classList.toggle("is-active", active);
        c.setAttribute("aria-selected", String(active));
      });
      books.forEach((book) => {
        const tags = (book.dataset.tags || "").split(" ");
        const show = filter === "all" || tags.includes(filter);
        book.classList.toggle("is-hidden", !show);
      });
    });
  });

  /* ====================================================================
     Cal.com embed
     ==================================================================== */
  let calBooted = false;
  function ensureCal() {
    if (calBooted) return;
    calBooted = true;
    // Official Cal.com embed loader
    (function (C, A, L) {
      let p = function (a, ar) { a.q.push(ar); };
      let d = C.document;
      C.Cal = C.Cal || function () {
        let cal = C.Cal;
        let ar = arguments;
        if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; }
        if (ar[0] === L) {
          const api = function () { p(api, arguments); };
          const namespace = ar[1];
          api.q = api.q || [];
          if (typeof namespace === "string") { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ["initNamespace", namespace]); }
          else p(cal, ar);
          return;
        }
        p(cal, ar);
      };
    })(window, "https://app.cal.com/embed/embed.js", "init");

    window.Cal("init", { origin: "https://cal.com" });
    window.Cal("ui", {
      hideEventTypeDetails: false,
      layout: "month_view",
      styles: { branding: { brandColor: "#3c5a86" } },
    });
  }

  const calLink = (key) => (CONFIG.cal.user ? `${CONFIG.cal.user}/${CONFIG.cal.events[key]}` : null);

  function openCalModal(key) {
    const link = calLink(key);
    if (!link) return false;
    ensureCal();
    window.Cal("modal", { calLink: link, config: { layout: "month_view" } });
    return true;
  }

  // Tailored WhatsApp messages — a fallback until Cal.com / Stripe are connected,
  // so every booking button does something the moment the site is live.
  const WA_MSG = {
    intro: "Hi Sophia! I'd love to book a free introductory call.",
    babysitting: "Hi Sophia! I'd like to arrange some babysitting and a call to meet first.",
    english: "Hi Sophia! I'd like to book a £15 English (TEFL) trial lesson.",
    sats: "Hi Sophia! I'd like to book a £15 11+/SATs trial lesson.",
  };
  function whatsappFallback(key) {
    window.open(
      waLink(WA_MSG[key] || "Hi Sophia! I'd love to find out more about your services."),
      "_blank",
      "noopener"
    );
  }

  // Free call → Cal.com modal when configured, otherwise message me on WhatsApp.
  function bookFree(key) {
    if (!openCalModal(key)) whatsappFallback(key);
  }

  // Paid trial → Stripe Payment Link if set, else Cal trial event, else fallback
  function bookTrial(key) {
    const stripe = CONFIG.payments[key];
    if (stripe) { window.open(stripe, "_blank", "noopener"); return; }
    if (!openCalModal(key)) whatsappFallback(key);
  }

  /* ---------- wire booking + payment buttons ---------- */
  $$("[data-book]").forEach((el) =>
    el.addEventListener("click", (e) => { e.preventDefault(); bookFree(el.dataset.book); })
  );
  $$("[data-pay]").forEach((el) =>
    el.addEventListener("click", (e) => { e.preventDefault(); bookTrial(el.dataset.pay); })
  );

  // Warm up Cal so popups open instantly
  if (CONFIG.cal.user) ensureCal();

  /* ---------- whatsapp links ---------- */
  const waLink = (text) =>
    `https://wa.me/${CONFIG.whatsapp}` + (text ? `?text=${encodeURIComponent(text)}` : "");
  $$("[data-whatsapp]").forEach((el) => {
    el.setAttribute("href", waLink("Hi Sophia! I found your website and I'd love to ask about your services."));
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });

  /* ---------- scheduler: inline Cal.com calendar OR contact fallback ---------- */
  const mount = $("[data-scheduler]");
  if (mount) {
    if (CONFIG.cal.user) {
      mount.innerHTML = '<div id="cal-inline" class="calcom-inline"></div>';
      ensureCal();
      window.Cal("inline", {
        elementOrSelector: "#cal-inline",
        calLink: calLink("intro"),
        config: { layout: "month_view" },
      });
    } else {
      mount.innerHTML = `
        <div class="sched-fallback">
          <h3>Book your free call</h3>
          <p>Send me a quick message with your child's age and what you're after — I'll reply
             fast and we'll find a time that works for you.</p>
          <div class="sched-fallback__row">
            <a class="btn btn--primary btn--lg" data-wa>Message me on WhatsApp</a>
            <a class="btn btn--soft btn--lg" href="mailto:${CONFIG.email}">Email me</a>
            <a class="btn btn--ghost btn--lg" href="tel:${CONFIG.phone}">Call ${CONFIG.phone}</a>
          </div>
        </div>`;
      const wa = $("[data-wa]", mount);
      if (wa) {
        wa.setAttribute("href", waLink("Hi Sophia! I'd love to book a free intro call."));
        wa.setAttribute("target", "_blank");
        wa.setAttribute("rel", "noopener");
      }
    }
  }
})();
