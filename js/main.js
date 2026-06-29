/* =================================================================
   Gul Hameed — Portfolio interactions
   Vanilla JS, no dependencies. Performance & a11y conscious.
   ================================================================= */
(() => {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isFinePointer  = window.matchMedia("(pointer: fine)").matches;
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ============================================================
     0. Preloader — quick terminal boot
     ============================================================ */
  const preloader = $("#preloader");
  const preCmd = $("#preCmd");
  const preOut = $("#preOut");

  function runPreloader() {
    if (!preloader) return;
    if (prefersReduced) { hidePreloader(); return; }

    const cmd = "./init --portfolio gul_hameed";
    const out = "loading audit toolkit ✓\nmounting 9 ecosystems ✓\nwelcome, operator.";
    let i = 0;

    const typeCmd = () => {
      if (i <= cmd.length) {
        preCmd.textContent = cmd.slice(0, i);
        i++;
        setTimeout(typeCmd, 32 + Math.random() * 30);
      } else {
        let j = 0;
        const lines = out.split("\n");
        const typeOut = () => {
          if (j < lines.length) {
            preOut.textContent += (j ? "\n" : "") + lines[j];
            j++;
            setTimeout(typeOut, 180);
          } else {
            setTimeout(hidePreloader, 420);
          }
        };
        typeOut();
      }
    };
    setTimeout(typeCmd, 260);
  }

  function hidePreloader() {
    if (!preloader) return;
    preloader.classList.add("hidden");
    document.body.style.overflow = "";
    startReveals();
    setTimeout(() => preloader.remove(), 700);
  }

  // safety: never let the preloader trap the page
  setTimeout(() => { if (preloader && !preloader.classList.contains("hidden")) hidePreloader(); }, 4000);

  /* ============================================================
     1. Custom cursor
     ============================================================ */
  if (isFinePointer && !prefersReduced) {
    const dot = $(".cursor-dot");
    const ring = $(".cursor-ring");
    let mx = innerWidth / 2, my = innerHeight / 2;
    let rx = mx, ry = my;

    window.addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    }, { passive: true });

    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);

    document.addEventListener("mouseover", (e) => {
      if (e.target.closest("a, button, input, [data-cursor]")) ring.classList.add("is-hover");
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest("a, button, input, [data-cursor]")) ring.classList.remove("is-hover");
    });
    document.addEventListener("mouseleave", () => { dot.style.opacity = ring.style.opacity = "0"; });
    document.addEventListener("mouseenter", () => { dot.style.opacity = ring.style.opacity = "1"; });
  }

  /* ============================================================
     2. Scroll progress + nav behaviour
     ============================================================ */
  const nav = $("#nav");
  const progress = $(".scroll-progress");
  let lastScroll = 0;

  const onScroll = () => {
    const y = window.scrollY;
    const h = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";

    nav.classList.toggle("scrolled", y > 40);
    if (y > lastScroll && y > 400) nav.classList.add("hidden");
    else nav.classList.remove("hidden");
    lastScroll = y;
  };
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ============================================================
     3. Mobile menu
     ============================================================ */
  const burger = $("#burger");
  const mobileMenu = $("#mobileMenu");
  if (burger) {
    const toggle = (open) => {
      burger.classList.toggle("open", open);
      mobileMenu.classList.toggle("open", open);
      document.body.style.overflow = open ? "hidden" : "";
    };
    burger.addEventListener("click", () => toggle(!mobileMenu.classList.contains("open")));
    $$(".mobile-menu a").forEach(a => a.addEventListener("click", () => toggle(false)));
  }

  /* ============================================================
     4. Reveal on scroll (IntersectionObserver)
     ============================================================ */
  let revealsStarted = false;
  function startReveals() {
    if (revealsStarted) return;
    revealsStarted = true;

    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          obs.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    $$(".reveal").forEach(el => io.observe(el));
  }
  // Start reveals immediately too (in case preloader was skipped)
  if (prefersReduced) startReveals();

  /* ============================================================
     5. Active nav link via section observation
     ============================================================ */
  const navLinks = $$(".nav__links a");
  const sections = navLinks
    .map(a => $(a.getAttribute("href")))
    .filter(Boolean);

  if (sections.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          const id = en.target.id;
          navLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + id));
        }
      });
    }, { threshold: 0.5 });
    sections.forEach(s => spy.observe(s));
  }

  /* ============================================================
     6. Typed role in hero
     ============================================================ */
  const typed = $("#typed");
  if (typed) {
    const roles = [
      "Senior Security Engineer",
      "Web, Mobile & API Auditor",
      "Web2 & Web3 Security",
      "Smart Contract Hunter",
      "9+ Ecosystems. Zero trust."
    ];
    let r = 0, c = 0, deleting = false;

    const tick = () => {
      const word = roles[r];
      typed.textContent = word.slice(0, c);

      if (!deleting && c < word.length) { c++; setTimeout(tick, 55); }
      else if (!deleting && c === word.length) { deleting = true; setTimeout(tick, 1700); }
      else if (deleting && c > 0) { c--; setTimeout(tick, 28); }
      else { deleting = false; r = (r + 1) % roles.length; setTimeout(tick, 320); }
    };
    if (prefersReduced) { typed.textContent = roles[0]; }
    else setTimeout(tick, 1400);
  }

  /* ============================================================
     7. Animated counters
     ============================================================ */
  const counters = $$(".stat__num");
  const counterIO = new IntersectionObserver((entries, obs) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      const target = +el.dataset.count;
      const suffix = el.dataset.suffix || "";
      const dur = 1400;
      const start = performance.now();

      const step = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      if (prefersReduced) el.textContent = target + suffix;
      else requestAnimationFrame(step);
      obs.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach(c => counterIO.observe(c));

  /* ============================================================
     8. Magnetic buttons + tilt cards
     ============================================================ */
  if (isFinePointer && !prefersReduced) {
    $$(".magnetic").forEach(el => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * 0.22}px, ${y * 0.32}px)`;
      });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    });

    $$(".tilt").forEach(el => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(800px) rotateY(${px * 7}deg) rotateX(${-py * 7}deg) translateY(-4px)`;
      });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    });

    // soft 3D for hero terminal
    const heroTerm = $(".magnetic-soft");
    if (heroTerm) {
      const wrap = heroTerm.closest(".hero__right");
      wrap.addEventListener("mousemove", (e) => {
        const r = wrap.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        heroTerm.style.transform = `perspective(1000px) rotateY(${px * 6}deg) rotateX(${-py * 6}deg)`;
      });
      wrap.addEventListener("mouseleave", () => { heroTerm.style.transform = ""; });
    }
  }

  /* ============================================================
     9. Code-rain canvas (subtle, capped)
     ============================================================ */
  const canvas = $(".bg-rain");
  if (canvas && !prefersReduced) {
    const ctx = canvas.getContext("2d", { alpha: true });
    const chars = "01<>{}[]()=+-*/!&|#$%ΞΣλ◎∞⌬01";
    let cols, drops, fontSize, raf, lastTime = 0;
    const fps = 18, interval = 1000 / fps;

    const resize = () => {
      canvas.width = innerWidth;
      canvas.height = innerHeight;
      fontSize = innerWidth < 700 ? 13 : 16;
      cols = Math.floor(canvas.width / fontSize);
      drops = Array(cols).fill(0).map(() => Math.random() * -100);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = (t) => {
      raf = requestAnimationFrame(draw);
      if (t - lastTime < interval) return;
      lastTime = t;

      ctx.fillStyle = "rgba(6,7,10,0.10)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

      for (let i = 0; i < cols; i++) {
        const ch = chars[(Math.random() * chars.length) | 0];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        // head glows, tail dims
        ctx.fillStyle = Math.random() > 0.985 ? "rgba(0,255,163,0.9)" : "rgba(0,255,163,0.14)";
        ctx.fillText(ch, x, y);
        if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 1;
      }
    };
    raf = requestAnimationFrame(draw);

    // pause when tab hidden (battery friendly)
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else raf = requestAnimationFrame(draw);
    });
  }

  /* ============================================================
     10. Interactive contact terminal
     ============================================================ */
  const liveInput = $("#liveInput");
  const liveOut = $("#liveOut");
  const liveBody = $("#liveTerminal");

  if (liveInput) {
    const commands = {
      help: () => [
        "available commands:",
        "  <span class='t-key'>whoami</span>   who is gul?",
        "  <span class='t-key'>skills</span>   coverage, languages & chains",
        "  <span class='t-key'>work</span>     selected audits + report links",
        "  <span class='t-key'>cex</span>      centralized exchange work",
        "  <span class='t-key'>contact</span>  how to reach me",
        "  <span class='t-key'>certs</span>    certifications",
        "  <span class='t-key'>clear</span>    clear the screen"
      ],
      whoami: () => [
        "gul_hameed // senior security engineer",
        "web2 & web3 auditor · web, mobile, api & smart contracts",
        "<span class='t-dim'>BlockApex · Hacken · Cantina · HackenProof</span>"
      ],
      skills: () => [
        "<span class='t-key'>coverage</span>: web, mobile, api, CEX platforms, smart contracts",
        "<span class='t-key'>languages</span>: Solidity, Rust, Move, Motoko, Tact, Func, Sway, Go, DAML",
        "<span class='t-key'>chains</span>: EVM, Solana, Cosmos, TON, NEAR, ICP, Aptos, Fuel, Canton"
      ],
      work: () => [
        "ADOT Finance  <span class='t-dim'>// DeFi staking (EVM)</span>",
        "Axone         <span class='t-dim'>// appchain + contracts (Cosmos)</span>",
        "Eclipse Fi    <span class='t-dim'>// launchpad staking (Neutron)</span>",
        "Gemz          <span class='t-dim'>// smart contracts</span>",
        "Meta Pool     <span class='t-dim'>// liquid staking (ICP)</span>",
        "Nero Chain    <span class='t-dim'>// EVM L1 + account abstraction</span>",
        "Ember         <span class='t-dim'>// marketplace + threat model (Aurora)</span>",
        "<span class='t-dim'>30+ audits in total, full list at</span> <span class='t-str'>github.com/gdroz3r</span>"
      ],
      cex: () => [
        "centralized exchanges assessed with Hacken:",
        "  KCEX    <span class='t-dim'>// web & API, report at</span> <span class='t-str'>hacken.io/audits/kcex</span>",
        "  MEXC    <span class='t-dim'>// web & API</span>",
        "  CoinEx  <span class='t-dim'>// mobile app</span>",
        "  MAICOIN <span class='t-dim'>// web & API</span>",
        "  1money  <span class='t-dim'>// web & API</span>",
        "  J-CAM   <span class='t-dim'>// web & API</span>",
        "<span class='t-dim'>part of 20+ web2 engagements, see</span> <span class='t-str'>github.com/gdroz3r</span>"
      ],
      contact: () => [
        "github      → <span class='t-str'>github.com/gdroz3r</span>",
        "twitter     → <span class='t-str'>@CyberGul</span>",
        "telegram    → <span class='t-str'>@guldozer</span>",
        "cantina     → <span class='t-str'>cantina.xyz/u/CyberGul</span>",
        "hackenproof → <span class='t-str'>hackenproof.com/hackers/gul</span>",
        "glider      → <span class='t-str'>r.xyz/glider-query-database</span>"
      ],
      certs: () => [
        "CEH Practical   <span class='t-dim'>// EC-Council</span>",
        "eCPPTv2         <span class='t-dim'>// eLearnSecurity</span>",
        "CRTP            <span class='t-dim'>// Altered Security</span>"
      ],
      sudo: () => ["<span class='t-err'>nice try.</span> this operator does not grant root. 😏"],
      ls: () => ["audits/  tools/  writeups/  certs/  <span class='t-dim'>secrets.enc</span>"],
      cat: () => ["<span class='t-err'>permission denied:</span> that file is under NDA."],
      exit: () => ["session persists. you can't escape good security. 🔒"]
    };

    const print = (lines, prompt = null) => {
      if (prompt !== null) {
        const p = document.createElement("p");
        p.innerHTML = `<span class="t-prompt">➜</span> <span class="t-path">~</span> ${escapeHtml(prompt)}`;
        liveOut.appendChild(p);
      }
      lines.forEach(l => {
        const p = document.createElement("p");
        p.className = "t-out";
        p.innerHTML = l;
        liveOut.appendChild(p);
      });
      liveBody.scrollTop = liveBody.scrollHeight;
    };

    const escapeHtml = (s) => s.replace(/[&<>"']/g, m =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));

    liveInput.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
      const raw = liveInput.value.trim();
      const cmd = raw.toLowerCase().split(" ")[0];
      liveInput.value = "";
      if (!raw) return;

      if (cmd === "clear") { liveOut.innerHTML = ""; return; }

      const fn = commands[cmd];
      if (fn) print(fn(), raw);
      else print([`<span class="t-err">command not found:</span> ${escapeHtml(cmd)}. try <span class="t-key">help</span>`], raw);
    });

    // focus terminal input when clicking anywhere in the body
    liveBody.addEventListener("click", () => liveInput.focus());
  }

  /* ============================================================
     11. Misc
     ============================================================ */
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  const toTop = $("#toTop");
  if (toTop) toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // smooth-scroll for same-page anchors (respect reduced motion)
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const target = $(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
    });
  });

  /* ============================================================
     Boot
     ============================================================ */
  document.body.style.overflow = "hidden";
  if (document.readyState === "complete") runPreloader();
  else window.addEventListener("load", runPreloader);
})();
