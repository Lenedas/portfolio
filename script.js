/* ===================================================
PORTFOLIO – script.js
Gestion de la navigation entre les pages
sans rechargement de la page
=================================================== */

(function () {
    "use strict";
    
    // ── Éléments DOM ──────────────────────────────────
    const navBtns = document.querySelectorAll(".nav-btn");
    const pages   = document.querySelectorAll(".page");
    
    // ── Fonction de changement de page ───────────────
    function goToPage(targetId) {
    // 1. Retirer l’état actif de tous les boutons et pages
    navBtns.forEach(btn => btn.classList.remove("active"));
    pages.forEach(page => {
    page.classList.remove("active");
    // Réinitialise la position pour la transition
    page.style.position = "absolute";
    });
    
    
    // 2. Activer le bouton cliqué
    const activeBtn = document.querySelector(`.nav-btn[data-page="${targetId}"]`);
    if (activeBtn) activeBtn.classList.add("active");
    
    // 3. Afficher la page cible
    const activePage = document.getElementById(`page-${targetId}`);
    if (activePage) {
      // Attendre un frame pour que la transition soit visible
      requestAnimationFrame(() => {
        activePage.classList.add("active");
        activePage.style.position = "relative";
        activePage.style.inset = "auto";
      });
    
      // Remonter en haut de la page
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    
    // 4. Mettre à jour l'URL (hash) sans rechargement
    history.pushState(null, null, `#${targetId}`);
   
    
    }
    
    // ── Écouteurs sur les boutons de navigation ───────
    navBtns.forEach(btn => {
    btn.addEventListener("click", () => {
    const targetId = btn.dataset.page;
    goToPage(targetId);
    });
    });
    
    // ── Navigation clavier (accessibilité) ───────────
    navBtns.forEach(btn => {
    btn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    btn.click();
    }
    });
    });
    
    // ── Navigation par flèches entre onglets ─────────
    const btnArray = Array.from(navBtns);
    navBtns.forEach((btn, index) => {
    btn.addEventListener("keydown", (e) => {
    let nextIndex = null;
    if (e.key === "ArrowRight") nextIndex = (index + 1) % btnArray.length;
    if (e.key === "ArrowLeft")  nextIndex = (index - 1 + btnArray.length) % btnArray.length;
    if (nextIndex !== null) {
    e.preventDefault();
    btnArray[nextIndex].focus();
    btnArray[nextIndex].click();
    }
    });
    });
    
    // ── Gestion de l’URL au chargement (#hash) ────────
    function initFromHash() {
    const hash = window.location.hash.replace("#", "");
    const validPages = Array.from(navBtns).map(b => b.dataset.page);
    
    
    if (hash && validPages.includes(hash)) {
      goToPage(hash);
    } else {
      // Page par défaut : accueil
      goToPage("accueil");
    }
    
    
    }
    
    // ── Bouton Précédent / Suivant du navigateur ──────
    window.addEventListener("popstate", () => {
    initFromHash();
    });
    
    //  Initialisation 
    initFromHash();
    
    // Animation d’entrée progressive des cards 
    // Réapplique l’animation à chaque changement de page
    const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
    if (mutation.target.classList.contains("active")) {
    const card = mutation.target.querySelector(".card");
    if (card) {
    card.style.animation = "none";
    // Force reflow
    void card.offsetHeight;
    card.style.animation = "";
    }
    }
    });
    });
    
    pages.forEach(page => {
    observer.observe(page, { attributes: true, attributeFilter: ["class"] });
    });
    
    })();