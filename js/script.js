document.addEventListener("DOMContentLoaded", function () {
  wisnuInitNavigation();
  wisnuInitHeaderScroll();
  wisnuInitScrollReveal();
  wisnuInitStatCounter();
  wisnuInitNewsFilter();
  wisnuInitNewsModal();
  wisnuInitContactForm();
  wisnuInitBackToTop();
  wisnuInitSmoothScroll();
  wisnuInitImageFallback();
});

/* --------------------------------------------------------------------------
   1. MENU HAMBURGER RESPONSIVE & PENANDA HALAMAN AKTIF OTOMATIS
   -------------------------------------------------------------------------- */
function wisnuInitNavigation() {
  const hamburgerBtn = document.getElementById("wisnu_hamburger_btn");
  const navbar = document.getElementById("wisnu_navbar");
  const navLinks = document.querySelectorAll(".wisnu_nav_link");

  function closeMobileMenu() {
    if (navbar && navbar.classList.contains("wisnu_navbar_open")) {
      navbar.classList.remove("wisnu_navbar_open");
    }
    if (hamburgerBtn) {
      hamburgerBtn.classList.remove("wisnu_hamburger_open");
      hamburgerBtn.setAttribute("aria-expanded", "false");
    }
  }

  if (hamburgerBtn && navbar) {
    hamburgerBtn.addEventListener("click", function (event) {
      event.stopPropagation();
      const isOpen = navbar.classList.toggle("wisnu_navbar_open");
      hamburgerBtn.classList.toggle("wisnu_hamburger_open", isOpen);
      hamburgerBtn.setAttribute("aria-expanded", String(isOpen));
    });

    document.addEventListener("click", function (event) {
      const header = document.getElementById("wisnu_header");
      if (header && !header.contains(event.target)) {
        closeMobileMenu();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMobileMenu();
      }
    });
  }

  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  navLinks.forEach(function (link) {
    const linkHref = link.getAttribute("href");
    if (linkHref === currentPath) {
      link.classList.add("wisnu_nav_link_active");
    }

    link.addEventListener("click", function () {
      closeMobileMenu();
    });
  });
}

/* --------------------------------------------------------------------------
   1B. EFEK ELEVASI HEADER SAAT HALAMAN DIGULIR
   -------------------------------------------------------------------------- */
function wisnuInitHeaderScroll() {
  const header = document.getElementById("wisnu_header");
  if (!header) return;

  function updateHeader() {
    if (window.scrollY > 28) {
      header.classList.add("wisnu_header_scrolled");
    } else {
      header.classList.remove("wisnu_header_scrolled");
    }
  }

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

/* --------------------------------------------------------------------------
   1C. ANIMASI MUNCUL SAAT SCROLL (INTERSECTION OBSERVER + STAGGER)
   -------------------------------------------------------------------------- */
function wisnuInitScrollReveal() {
  const staggerContainers = document.querySelectorAll(
    ".wisnu_stats_grid, .wisnu_card_grid, .wisnu_program_stack",
  );

  staggerContainers.forEach(function (container) {
    const items = Array.from(container.children);
    items.forEach(function (item, idx) {
      if (
        !item.classList.contains("wisnu_reveal") &&
        !item.classList.contains("wisnu_reveal_left") &&
        !item.classList.contains("wisnu_reveal_right") &&
        !item.classList.contains("wisnu_reveal_scale")
      ) {
        item.classList.add("wisnu_reveal");
      }
      const delayClass = "wisnu_delay_" + ((idx % 8) + 1);
      item.classList.add(delayClass);
    });
  });

  const revealTargets = document.querySelectorAll(
    ".wisnu_reveal, .wisnu_reveal_left, .wisnu_reveal_right, .wisnu_reveal_scale",
  );

  if (revealTargets.length === 0) return;

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("wisnu_revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -36px 0px",
      },
    );

    revealTargets.forEach(function (el) {
      observer.observe(el);
    });

    setTimeout(function () {
      revealTargets.forEach(function (el) {
        el.classList.add("wisnu_revealed");
      });
    }, 3200);
  } else {
    revealTargets.forEach(function (el) {
      el.classList.add("wisnu_revealed");
    });
  }
}

/* --------------------------------------------------------------------------
   3. ANIMASI COUNTER STATISTIK SEKOLAH
   -------------------------------------------------------------------------- */
function wisnuInitStatCounter() {
  const statNumbers = document.querySelectorAll(".wisnu_stat_number");
  if (statNumbers.length === 0) return;

  let hasAnimated = false;

  function animateCounters() {
    if (hasAnimated) return;
    hasAnimated = true;

    statNumbers.forEach(function (counter) {
      const target = parseInt(counter.getAttribute("data-target"), 10) || 0;
      const duration = 1600;
      const stepTime = 25;
      const totalSteps = Math.max(1, Math.floor(duration / stepTime));
      const increment = target / totalSteps;
      let current = 0;

      const timer = setInterval(function () {
        current += increment;
        if (current >= target) {
          counter.textContent = target.toLocaleString("id-ID");
          clearInterval(timer);
        } else {
          counter.textContent = Math.floor(current).toLocaleString("id-ID");
        }
      }, stepTime);
    });
  }

  const statsSection = document.getElementById("wisnu_stats");
  if ("IntersectionObserver" in window && statsSection) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounters();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.25 },
    );
    observer.observe(statsSection);
  } else {
    animateCounters();
  }
}

/* --------------------------------------------------------------------------
   4. FILTER KATEGORI BERITA & KEGIATAN (HALAMAN BERITA)
   -------------------------------------------------------------------------- */
function wisnuInitNewsFilter() {
  const filterButtons = document.querySelectorAll(".wisnu_filter_btn");
  const newsCards = document.querySelectorAll(".wisnu_news_card");

  if (filterButtons.length === 0 || newsCards.length === 0) return;

  filterButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const selectedCategory = btn.getAttribute("data-filter");

      filterButtons.forEach(function (item) {
        item.classList.remove("wisnu_filter_active");
      });
      btn.classList.add("wisnu_filter_active");

      newsCards.forEach(function (card) {
        const cardCategory = card.getAttribute("data-category");
        if (selectedCategory === "semua" || cardCategory === selectedCategory) {
          card.classList.remove("wisnu_news_hidden");
          card.classList.add("wisnu_revealed");
        } else {
          card.classList.add("wisnu_news_hidden");
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   5. MODAL BACA SELENGKAPNYA (HALAMAN BERITA)
   -------------------------------------------------------------------------- */
function wisnuInitNewsModal() {
  const modal = document.getElementById("wisnu_news_modal");
  const readButtons = document.querySelectorAll(".wisnu_read_more_btn");
  if (!modal || readButtons.length === 0) return;

  const modalImg = document.getElementById("wisnu_modal_img");
  const modalCategory = document.getElementById("wisnu_modal_category");
  const modalDate = document.getElementById("wisnu_modal_date");
  const modalTitle = document.getElementById("wisnu_modal_title");
  const modalContent = document.getElementById("wisnu_modal_content");
  const closeBtn = document.getElementById("wisnu_modal_close");
  const backdrop = document.getElementById("wisnu_modal_backdrop");

  function closeModal() {
    modal.setAttribute("hidden", "");
    document.body.classList.remove("wisnu_modal_open");
  }

  readButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (modalImg) {
        modalImg.src = btn.getAttribute("data-image") || "";
        modalImg.alt =
          btn.getAttribute("data-title") ||
          "Foto Kegiatan SMK PRAJURIT 1 WAKANDA";
      }
      if (modalCategory)
        modalCategory.textContent = btn.getAttribute("data-category") || "";
      if (modalDate)
        modalDate.textContent = btn.getAttribute("data-date") || "";
      if (modalTitle)
        modalTitle.textContent = btn.getAttribute("data-title") || "";
      if (modalContent)
        modalContent.textContent = btn.getAttribute("data-content") || "";
      modal.removeAttribute("hidden");
      document.body.classList.add("wisnu_modal_open");
    });
  });

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (backdrop) backdrop.addEventListener("click", closeModal);

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !modal.hasAttribute("hidden")) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   6. VALIDASI FORMULIR KONTAK & SIMULASI PENGIRIMAN (HALAMAN KONTAK)
   -------------------------------------------------------------------------- */
function wisnuInitContactForm() {
  const form = document.getElementById("wisnu_contact_form");
  if (!form) return;

  const namaInput = document.getElementById("wisnu_nama");
  const emailInput = document.getElementById("wisnu_email");
  const subjekInput = document.getElementById("wisnu_subjek");
  const pesanInput = document.getElementById("wisnu_pesan");
  const resultBox = document.getElementById("wisnu_form_result");

  const errorNama = document.getElementById("wisnu_error_nama");
  const errorEmail = document.getElementById("wisnu_error_email");
  const errorSubjek = document.getElementById("wisnu_error_subjek");
  const errorPesan = document.getElementById("wisnu_error_pesan");

  function setError(inputEl, errorEl, message) {
    if (inputEl) inputEl.classList.add("wisnu_input_invalid");
    if (errorEl) errorEl.textContent = message;
  }

  function clearError(inputEl, errorEl) {
    if (inputEl) inputEl.classList.remove("wisnu_input_invalid");
    if (errorEl) errorEl.textContent = "";
  }

  function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailPattern.test(email);
  }

  function validateForm() {
    let isValid = true;

    const namaVal = namaInput.value.trim();
    const emailVal = emailInput.value.trim();
    const subjekVal = subjekInput.value.trim();
    const pesanVal = pesanInput.value.trim();

    if (namaVal.length < 3) {
      setError(
        namaInput,
        errorNama,
        "Nama lengkap wajib diisi minimal 3 karakter.",
      );
      isValid = false;
    } else {
      clearError(namaInput, errorNama);
    }

    if (emailVal === "") {
      setError(emailInput, errorEmail, "Alamat email wajib diisi.");
      isValid = false;
    } else if (!isValidEmail(emailVal)) {
      setError(
        emailInput,
        errorEmail,
        "Format email tidak valid (contoh: nama@domain.com).",
      );
      isValid = false;
    } else {
      clearError(emailInput, errorEmail);
    }

    if (subjekVal.length < 4) {
      setError(
        subjekInput,
        errorSubjek,
        "Subjek pesan wajib diisi minimal 4 karakter.",
      );
      isValid = false;
    } else {
      clearError(subjekInput, errorSubjek);
    }

    if (pesanVal.length < 10) {
      setError(
        pesanInput,
        errorPesan,
        "Isi pesan wajib diisi minimal 10 karakter.",
      );
      isValid = false;
    } else {
      clearError(pesanInput, errorPesan);
    }

    return isValid;
  }

  [
    [namaInput, errorNama],
    [emailInput, errorEmail],
    [subjekInput, errorSubjek],
    [pesanInput, errorPesan],
  ].forEach(function (pair) {
    if (pair[0]) {
      pair[0].addEventListener("input", function () {
        clearError(pair[0], pair[1]);
      });
    }
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!validateForm()) {
      if (resultBox) resultBox.setAttribute("hidden", "");
      return;
    }

    const namaVal = namaInput.value.trim();
    const emailVal = emailInput.value.trim();
    const subjekVal = subjekInput.value.trim();
    const pesanVal = pesanInput.value.trim();

    if (resultBox) {
      resultBox.innerHTML = "";

      const title = document.createElement("strong");
      title.textContent = "Simulasi Pengiriman Berhasil Divalidasi!";

      const info = document.createElement("p");
      info.style.marginTop = "8px";
      info.textContent =
        "Terima kasih, " +
        namaVal +
        " (" +
        emailVal +
        '). Data pesan Anda dengan subjek "' +
        subjekVal +
        '" telah lolos validasi formulir. Catatan: Mode saat ini berjalan secara lokal sebagai simulasi pengiriman.';

      const detail = document.createElement("p");
      detail.style.marginTop = "6px";
      detail.style.fontSize = "0.85rem";
      detail.textContent = 'Ringkasan pesan: "' + pesanVal + '"';

      resultBox.appendChild(title);
      resultBox.appendChild(info);
      resultBox.appendChild(detail);
      resultBox.removeAttribute("hidden");
    }

    form.reset();
  });
}

/* --------------------------------------------------------------------------
   7. TOMBOL KEMBALI KE ATAS (BACK TO TOP)
   -------------------------------------------------------------------------- */
function wisnuInitBackToTop() {
  const backToTopBtn = document.getElementById("wisnu_back_to_top");
  if (!backToTopBtn) return;

  window.addEventListener("scroll", function () {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add("wisnu_back_to_top_visible");
    } else {
      backToTopBtn.classList.remove("wisnu_back_to_top_visible");
    }
  });

  backToTopBtn.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

/* --------------------------------------------------------------------------
   8. SMOOTH SCROLL UNTUK TAUTAN ANCHOR INTERNAL
   -------------------------------------------------------------------------- */
function wisnuInitSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#wisnu_"]');
  anchorLinks.forEach(function (anchor) {
    anchor.addEventListener("click", function (event) {
      const targetId = anchor.getAttribute("href");
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        event.preventDefault();
        targetEl.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

/* --------------------------------------------------------------------------
   9. PENGAMAN GAMBAR LOKAL (ANTI BROKEN IMAGE)
   -------------------------------------------------------------------------- */
function wisnuInitImageFallback() {
  const allImages = document.querySelectorAll("img");
  allImages.forEach(function (img) {
    img.addEventListener("error", function () {
      if (img.getAttribute("data-wisnu-errored") === "true") return;
      img.setAttribute("data-wisnu-errored", "true");
      const altText = encodeURIComponent(img.alt || "SMK PRAJURIT 1 WAKANDA");
      img.src =
        "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(
          '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="480" viewBox="0 0 800 480">' +
            '<rect width="800" height="480" fill="#09152B"/>' +
            '<rect x="24" y="24" width="752" height="432" rx="16" fill="none" stroke="#D4A843" stroke-width="3"/>' +
            '<text x="400" y="225" fill="#FFFFFF" font-family="sans-serif" font-size="26" font-weight="bold" text-anchor="middle">SMK PRAJURIT 1 WAKANDA</text>' +
            '<text x="400" y="265" fill="#F3D999" font-family="sans-serif" font-size="18" text-anchor="middle">' +
            decodeURIComponent(altText) +
            "</text></svg>",
        );
    });
  });
}
