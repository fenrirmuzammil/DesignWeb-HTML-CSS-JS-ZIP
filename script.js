const nav = document.getElementById("navbar");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-link");

menuToggle?.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});

navItems.forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 15);

  const sections = [...document.querySelectorAll("main section[id]")];
  const current = sections.find(section => {
    const r = section.getBoundingClientRect();
    return r.top <= 140 && r.bottom >= 140;
  });

  if (current) {
    navItems.forEach(item => {
      item.classList.toggle("active", item.getAttribute("href") === `#${current.id}`);
    });
  }
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

const counters = document.querySelectorAll("[data-count]");
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.count);
    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = `${Math.floor(target * eased)}${target === 500 ? "+" : "%"}`;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
}, { threshold: .6 });

counters.forEach(counter => counterObserver.observe(counter));

document.getElementById("year").textContent = new Date().getFullYear();

// Small parallax effect for the workspace, disabled for reduced-motion users.
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const workspace = document.querySelector(".workspace");
  window.addEventListener("mousemove", e => {
    const rect = workspace.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > innerHeight) return;
    const x = (e.clientX - innerWidth / 2) / innerWidth;
    const y = (e.clientY - innerHeight / 2) / innerHeight;
    const laptop = document.querySelector(".laptop-wrap");
    if (laptop) laptop.style.transform = `translateX(-50%) translate(${x * 8}px, ${y * 5}px)`;
  });
}
