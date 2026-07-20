const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-button");
const navLinks = document.querySelectorAll(".nav a");
const modal = document.querySelector(".video-modal");
const modalVideo = modal.querySelector("video");
const fallback = modal.querySelector(".video-fallback");
const closeButton = modal.querySelector(".modal-close");

document.getElementById("year").textContent = new Date().getFullYear();

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 40);
}, { passive: true });

menuButton.addEventListener("click", () => {
  const open = document.body.classList.toggle("menu-open");
  menuButton.setAttribute("aria-expanded", String(open));
});

navLinks.forEach(link => link.addEventListener("click", () => {
  document.body.classList.remove("menu-open");
  menuButton.setAttribute("aria-expanded", "false");
}));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((el, index) => {
  el.style.transitionDelay = `${Math.min((index % 4) * 70, 210)}ms`;
  observer.observe(el);
});

document.querySelectorAll(".project-link").forEach(link => {
  link.addEventListener("click", async (event) => {
    event.preventDefault();
    const src = link.dataset.video;
    fallback.style.display = "none";
    modalVideo.style.display = "block";
    modalVideo.src = src;

    try {
      const response = await fetch(src, { method: "HEAD" });
      if (!response.ok) throw new Error("Video bulunamadı");
    } catch {
      modalVideo.removeAttribute("src");
      modalVideo.load();
      modalVideo.style.display = "none";
      fallback.style.display = "block";
    }

    modal.showModal();
  });
});

function closeModal() {
  modal.close();
  modalVideo.pause();
  modalVideo.removeAttribute("src");
  modalVideo.load();
}

closeButton.addEventListener("click", closeModal);
modal.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.open) closeModal();
});
