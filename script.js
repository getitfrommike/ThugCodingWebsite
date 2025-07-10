// === Sefirah Modal Logic ===
const sefirahMessages = {
  Crown: {
    text: "Let go of identity. Become still. Only in silence can the infinite will be known.",
    link: "pages/crown.html"
  },
  Wisdom: {
    text: "The spark of insight strikes before thought can shape it — honor that flash.",
    link: "pages/wisdom.html"
  },
  Mastery: {
    text: "Give shape to vision. Without form, insight fades.",
    link: "pages/mastery.html"
  },
  Knowledge: {
    text: "Between knowing and unknowing lies the abyss — cross only in truth.",
    link: "pages/knowledge.html"
  },
  Mercy: {
    text: "True power flows through generosity.",
    link: "pages/mercy.html"
  },
  Strength: {
    text: "Love without boundaries leads to destruction. Set sacred limits.",
    link: "pages/strength.html"
  },
  Beauty: {
    text: "Balance the sword and the cup — find beauty in the center.",
    link: "pages/beauty.html"
  },
  Victory: {
    text: "Keep going — divine fire endures even in struggle.",
    link: "pages/victory.html"
  },
  Glory: {
    text: "Wisdom is hollow without the humility to receive it.",
    link: "pages/glory.html"
  },
  Foundation: {
    text: "The hidden shapes the visible. Guard your dreams.",
    link: "pages/foundation.html"
  },
  Kingdom: {
    text: "We ARE chosen — We build systems to prove it.\n\nWe move with purpose — We deploy legacies.\n\nWe dream in code and ideas — We manifest institutions.",
    link: "pages/kingdom.html"
  }
};

function showLesson(name) {
  const modal = document.getElementById("modal");
  const content = document.querySelector(".modal-content");
  const title = document.getElementById("modal-title");
  const message = document.getElementById("modal-message");
  const link = document.getElementById("modal-link");

  const data = sefirahMessages[name];
  if (data) {
    title.textContent = name;
    message.innerHTML = data.text
      .split('\n\n')
      .map(line => `<p>${line}</p>`)
      .join('');
    link.href = data.link;

    content.style.animation = "none";
    void content.offsetWidth;
    content.style.animation = "fadeInUp 0.4s ease";

    modal.classList.add("show");
  }
}

function closeModal() {
  document.getElementById("modal").classList.remove("show");
}

window.onclick = function(event) {
  const modal = document.getElementById("modal");
  if (event.target === modal) {
    closeModal();
  }
};

// === Hero Slideshow Logic ===
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slideshow .slide');

function showNextSlide() {
  slides[currentSlide].classList.remove('active');
  currentSlide = (currentSlide + 1) % slides.length;
  slides[currentSlide].classList.add('active');
}

setInterval(showNextSlide, 5000); // every 5 seconds
