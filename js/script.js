// --- PAKSA REFRESH KE COVER ---
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.onbeforeunload = () => {
  window.scrollTo(0, 0);
};
window.addEventListener('DOMContentLoaded', () => {
  window.scrollTo(0, 0);
});


// Fungsi untuk menonaktifkan scroll
function disableScroll() {
  document.body.classList.add('no-scroll');
}

// Fungsi untuk mengaktifkan scroll
function enableScroll() {
  document.body.classList.remove('no-scroll');
}

// Fungsi untuk "membuka undangan"
function openInvitation() {
  enableScroll(); // Aktifkan scroll kembali
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    heroSection.style.display = 'none'; // Sembunyikan cover
  }
}

// Saat halaman selesai dimuat
window.addEventListener('DOMContentLoaded', () => {
  disableScroll(); // Blokir scroll dulu

  const openBtn = document.querySelector('.open-btn');
  if (openBtn) {
    openBtn.addEventListener('click', openInvitation);
  }
});




// Fungsi Countdown
const countdown = () => {
  const eventDate = new Date("2026-01-31T08:00:00").getTime();
  const now = new Date().getTime();
  const distance = eventDate - now;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / 1000 / 60) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  // Pastikan elemen DOM ada sebelum mengubah textContent
  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  if (daysEl && hoursEl && minutesEl && secondsEl) {
    daysEl.textContent = String(days).padStart(3, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }
};

// Fungsi untuk toggle Sidebar
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const navbar = document.querySelector(".navbar-container");

  if (sidebar.classList.contains("show")) {
    sidebar.classList.remove("show");
    navbar.classList.remove("hide");
  } else {
    sidebar.classList.add("show");
    navbar.classList.add("hide");
  }
}

// Jalankan saat DOM siap
document.addEventListener("DOMContentLoaded", function () {
  // Jalankan countdown saat DOM siap
  countdown();
  setInterval(countdown, 1000);

  const menuBtn = document.querySelector(".menu-btn");
  const closeBtn = document.querySelector(".close-btn");
  const sidebar = document.getElementById("sidebar");
  const navbar = document.querySelector(".navbar-container");

  // Tampilkan Sidebar
  menuBtn.addEventListener("click", function () {
    sidebar.classList.add("show");
    navbar.classList.add("hide");
  });

  // Tutup Sidebar
  closeBtn.addEventListener("click", function () {
    sidebar.classList.remove("show");
    navbar.classList.remove("hide");
  });

  // Klik di luar sidebar untuk menutup
  document.addEventListener("click", function (event) {
    if (!sidebar.contains(event.target) && !menuBtn.contains(event.target)) {
      sidebar.classList.remove("show");
      navbar.classList.remove("hide");
    }
  });
});



// GuestWish
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("guestForm");
  const nameInput = document.getElementById("guestName");
  const messageInput = document.getElementById("guestMessage");
  const wishList = document.getElementById("wishList");
  const wishCounter = document.getElementById("wishCounter");

  const scriptURL = "https://script.google.com/macros/s/AKfycbx4lEo8yUoKLTiK0XSFVN2884e6NbAu6bjcuzBERInoQiPr0za8Z8RDv_G9rbcRY4SO/exec";
  const renderedWishes = new Set();

  function addGuestWish({ name, message }) {
    const key = `${name}::${message}`.toLowerCase();
    if (renderedWishes.has(key)) return;

    const el = document.createElement("div");
    el.className = "wish-item";
    el.innerHTML = `
      <p class="wish-message">"${message}"</p>
      <p class="wish-name">- ${name}</p>
    `;
    wishList.prepend(el);
    renderedWishes.add(key);
    updateWishCount();
  }

  function updateWishCount() {
    const count = document.querySelectorAll(".wish-item").length;
    wishCounter.textContent = `Jumlah: ${count} Ucapan`;
  }

  function saveToLocal(wish) {
    const saved = JSON.parse(localStorage.getItem("guestWishes")) || [];
    saved.unshift(wish);
    localStorage.setItem("guestWishes", JSON.stringify(saved));
  }

  function loadFromLocal() {
    const saved = JSON.parse(localStorage.getItem("guestWishes")) || [];
    saved.forEach(addGuestWish);
  }

  function sendToGoogleSheets(wish) {
    const formData = new FormData();
    formData.append("nama", wish.name);
    formData.append("pesan", wish.message);

    fetch(scriptURL, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then(() => {
        addGuestWish(wish);
        saveToLocal(wish);
      })
      .catch((err) => {
        console.error("Gagal kirim ke Sheets:", err);
        addGuestWish(wish);
        saveToLocal(wish);
      });
  }

  function loadFromGoogleSheets() {
    fetch(scriptURL)
      .then(res => res.json())
      .then(data => {
        data.reverse().forEach(item => {
          addGuestWish({ name: item.nama, message: item.pesan });
        });
      })
      .catch(err => {
        console.warn("Gagal ambil dari Sheets:", err);
      });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = nameInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !message) return;

    const wish = { name, message };
    sendToGoogleSheets(wish);
    form.reset();
  });

  loadFromLocal();
  loadFromGoogleSheets();
});






// === RSVP Section ===
function submitRSVP(event) {
  event.preventDefault();

  // Ambil nilai input berdasarkan ID yang sesuai dengan HTML
  const name = document.getElementById("rsvpGuestName").value.trim();
  const attendance = document.getElementById("attendance").value;

  if (!name || !attendance) {
    alert("Mohon isi semua data terlebih dahulu.");
    return false;
  }

  const rsvpData = { name, attendance };

  // Simpan ke localStorage
  saveRSVPToLocalStorage(rsvpData);

  // Kirim ke Google Sheets
  sendRSVPToGoogleSheets(rsvpData);

  alert("Terima kasih atas konfirmasi kehadirannya!");

  // Reset form
  document.querySelector(".rsvp-form").reset();
  return false;
}

function saveRSVPToLocalStorage(data) {
  const rsvpList = JSON.parse(localStorage.getItem("rsvpList") || "[]");
  rsvpList.push(data);
  localStorage.setItem("rsvpList", JSON.stringify(rsvpList));
}

function sendRSVPToGoogleSheets(data) {
  const scriptURL = "https://script.google.com/macros/s/AKfycbwanStEF3i6NybdJPyChV_px-H8gBSIm7lt35iOsrUW-zEy4F3iW0yZIdTxL4_mpNpMkw/exec"; // Ganti dengan Web App kamu
  const formData = new FormData();
  formData.append("nama", data.name);
  formData.append("kehadiran", data.attendance);

  fetch(scriptURL, { method: "POST", body: formData })
    .then(response => console.log("RSVP terkirim ke Google Sheets"))
    .catch(error => console.error("Gagal mengirim RSVP:", error));
}



// Elemen modal
document.addEventListener("DOMContentLoaded", function () {
  const openModal = document.getElementById('openModal');
  const modal = document.getElementById('giftModal');
  const closeButton = document.querySelector('.close-button');
  const copyButton = document.getElementById('copy-button');
  const rekeningNumber = document.getElementById('rekening-number').innerText;
  const copyMessage = document.getElementById('copy-message');

  openModal.addEventListener('click', function (e) {
    e.preventDefault();
    modal.style.display = 'block';
  });

  closeButton.addEventListener('click', function () {
    modal.style.display = 'none';
    copyMessage.style.display = 'none';
  });

  window.addEventListener('click', function (event) {
    if (event.target === modal) {
      modal.style.display = 'none';
      copyMessage.style.display = 'none';
    }
  });

  copyButton.addEventListener('click', function () {
    navigator.clipboard.writeText(rekeningNumber).then(() => {
      copyMessage.style.display = 'block';
    });
  });
});



// Fungsi untuk email newsletter-form
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".newsletter-form");
  const emailInput = form.querySelector("input[type='email']");
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxsiL8CcF7CwbHmIy2_1no19J4ofh40g3qxTk6r9YnKIDtCFGcwZ33z7NPVAj0VZPQn/exec"; // Ganti dengan URL kamu

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = emailInput.value.trim();

    if (!email || !email.includes("@gmail.com")) {
      alert("Mohon masukkan alamat Gmail yang valid.");
      return;
    }

    // Simpan ke localStorage
    let savedEmails = JSON.parse(localStorage.getItem("newsletterEmails")) || [];
    savedEmails.push(email);
    localStorage.setItem("newsletterEmails", JSON.stringify(savedEmails));

    // Kirim ke Google Sheets
    fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: `email=${encodeURIComponent(email)}`
    })
      .then(() => {
        alert("Terima kasih telah mendaftar!");
        form.reset();
      })
      .catch((error) => {
        console.error("Gagal mengirim ke Google Sheets:", error);
        alert("Terjadi kesalahan. Silakan coba lagi nanti.");
      });
  });
});



// Fungsi untuk contact whatsapp footer-section contact
document.addEventListener("DOMContentLoaded", () => {
  const contactButton = document.querySelector(".contact-button");
  const phoneNumber = "+62 895-2348-4553";  // Ganti dengan nomor WhatsApp yang sesuai
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}`;  // Format link WhatsApp

  contactButton.addEventListener("click", (e) => {
    e.preventDefault();
    // Arahkan ke WhatsApp
    window.open(whatsappUrl, "_blank");
  });
});







// Background music
// =======================
// DISABLE / ENABLE SCROLL
// =======================
function disableScroll() {
  document.body.classList.add('no-scroll');
}

function enableScroll() {
  document.body.classList.remove('no-scroll');
}

// =======================
// FUNGSI BUKA UNDANGAN
// =======================
let musicPlayed = false;

function openInvitation() {
  enableScroll();

  // Sembunyikan cover / hero section
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    heroSection.style.display = 'none';
  }

  // Aktifkan tombol musik
  const musicBtn = document.getElementById('musicToggle');
  if (musicBtn) {
    musicBtn.disabled = false;
    musicBtn.style.opacity = 1;
    musicBtn.style.pointerEvents = 'auto';
  }

  // Mulai musik (hanya sekali)
  if (!musicPlayed) {
    startMusic();
  }
}

// =======================
// BACKGROUND MUSIC SYSTEM
// =======================
function startMusic() {
  const music = document.getElementById("bgMusic");
  const toggle = document.getElementById("musicToggle");
  if (!music || !toggle) return;

  // Fade-in volume
  function fadeInAudio(audio) {
    audio.volume = 0;
    let vol = 0;
    const fade = setInterval(() => {
      if (vol < 1) {
        vol += 0.05;
        audio.volume = Math.min(vol, 1);
      } else {
        clearInterval(fade);
      }
    }, 100);
  }

  // Coba autoplay
  const tryAutoPlay = () => {
    music.play().then(() => {
      toggle.classList.add("playing");
      fadeInAudio(music);
    }).catch(() => {
      console.log("Autoplay diblokir. Menunggu interaksi pengguna.");
    });
  };

  // Tombol toggle musik manual
  toggle.addEventListener("click", () => {
    if (music.paused) {
      music.play().then(() => {
        toggle.classList.add("playing");
        fadeInAudio(music);
      }).catch((err) => {
        console.error("Gagal memutar musik:", err);
      });
    } else {
      music.pause();
      toggle.classList.remove("playing");
    }
  });

  // Fallback: coba play setelah interaksi pertama
  const interactionHandler = () => {
    if (music.paused) {
      music.play().then(() => {
        toggle.classList.add("playing");
        fadeInAudio(music);
      });
    }
    document.removeEventListener("click", interactionHandler);
  };
  document.addEventListener("click", interactionHandler);

  tryAutoPlay();
  musicPlayed = true;
}

// =======================
// INIT SAAT HALAMAN DIBUKA
// =======================
window.addEventListener("DOMContentLoaded", () => {
  disableScroll(); // Kunci scroll

  // Kunci tombol musik
  const musicBtn = document.getElementById('musicToggle');
  if (musicBtn) {
    musicBtn.disabled = true;
    musicBtn.style.opacity = 0.5;
    musicBtn.style.pointerEvents = 'none';
  }

  // Tombol buka undangan
  const openBtn = document.querySelector('.open-btn');
  if (openBtn) {
    openBtn.addEventListener('click', openInvitation);
  }
});









document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        if (entry.target.classList.contains("word-by-word")) {
          const words = entry.target.textContent.split(" ");
          entry.target.innerHTML = "";
          words.forEach((word, i) => {
            const span = document.createElement("span");
            span.textContent = word + " ";
            span.style.setProperty("--i", i);
            entry.target.appendChild(span);
          });
          entry.target.classList.add("visible");
        }
      } else {
        entry.target.classList.remove("visible");
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(".animate").forEach(el => observer.observe(el));

  // Optional: Parallax scroll effect
  window.addEventListener("scroll", () => {
    document.querySelectorAll("[data-parallax]").forEach(el => {
      const speed = parseFloat(el.getAttribute("data-parallax")) || 0.5;
      const offset = window.scrollY * speed;
      el.style.transform = `translateY(${offset}px)`;
    });
  });
});



