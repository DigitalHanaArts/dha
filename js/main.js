/* =====================================================
   DIGITAL HANA ARTS® — SHARED INTERACTIVITY
   ====================================================== */

(function () {
    'use strict';

    // 1. Flag HTML for animations (Prevents FOUC if JS fails)
    document.documentElement.classList.add('js');

    // Fallback: If JS fails to load properly, show everything after 3s
    setTimeout(() => {
        document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
            el.classList.add('visible');
        });
    }, 3000);

    // 2. Scroll Progress Bar
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    // 3. Cursor Glow
    const cursorGlow = document.createElement('div');
    cursorGlow.className = 'cursor-glow';
    document.body.appendChild(cursorGlow);

    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    });

    // 4. Scroll Handlers (Header, Back to Top, Progress)
    const header = document.querySelector('.header');
    const backToTop = document.createElement('a');
    backToTop.href = '#top';
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '↑';
    backToTop.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTop);

    function onScroll() {
        const scrollY = window.scrollY;
        const height = document.documentElement.scrollHeight - window.innerHeight;
        const percent = (scrollY / height) * 100;

        progressBar.style.width = percent + '%';

        if (header) {
            if (scrollY > 60) header.classList.add('compact');
            else header.classList.remove('compact');
        }

        if (scrollY > 500) backToTop.classList.add('visible');
        else backToTop.classList.remove('visible');
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // 5. Mobile Drawer
    const menuBtn = document.querySelector('.menu-btn');
    const drawer = document.querySelector('.drawer');
    const overlay = document.querySelector('.drawer-overlay');
    const closeBtn = document.querySelector('.drawer-close');

    function openDrawer() {
        if (drawer) drawer.classList.add('open');
        if (overlay) overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
        if (drawer) drawer.classList.remove('open');
        if (overlay) overlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (menuBtn) menuBtn.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (overlay) overlay.addEventListener('click', closeDrawer);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeDrawer();
    });

    // 6. Reveal on Scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // 7. Gallery Filter
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item[data-category]');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const cat = btn.dataset.filter;
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            galleryItems.forEach(item => {
                if (cat === 'all' || item.dataset.category === cat) {
                    item.classList.remove('hidden');
                    item.style.animation = 'none';
                    setTimeout(() => item.style.animation = '', 10);
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

    // 8. Lightbox
    const lightbox = document.querySelector('.lightbox');
    if (lightbox) {
        const lightboxImg = lightbox.querySelector('img');
        const closeLightboxBtn = lightbox.querySelector('.lightbox-close');

        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                if (img) {
                    lightboxImg.src = img.src;
                    lightboxImg.alt = img.alt;
                    lightbox.classList.add('open');
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        function closeLightbox() {
            lightbox.classList.remove('open');
            document.body.style.overflow = '';
        }

        if (closeLightboxBtn) closeLightboxBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeLightbox();
        });
    }

    // 9. Smooth Anchor Scroll
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const id = link.getAttribute('href');
            if (id === '#' || id === '#top') return;
            const target = document.querySelector(id);
            if (target) {
                e.preventDefault();
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // 10. Active Nav Link
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .drawer a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === path || (path === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });

    // 11. Close Language Dropdown on Click Outside
    document.addEventListener('click', (e) => {
        const langDropdown = document.querySelector('.lang-dropdown');
        const langInput = document.getElementById('lang-input');
        if (langDropdown && langInput && !langDropdown.contains(e.target)) {
            langInput.checked = false;
        }
    });

})();