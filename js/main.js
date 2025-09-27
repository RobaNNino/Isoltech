// Main JavaScript for Isoltech Website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // Navbar scroll effect
    const navbar = document.getElementById('mainNav');
    const handleNavScroll = function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleNavScroll);
    // Run once after load and after AOS init to stabilize layout
    requestAnimationFrame(handleNavScroll);

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Scroll indicator click
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const servicesSection = document.getElementById('services');
            if (servicesSection) {
                servicesSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    }

    // Service cards hover effect
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.getElementById('hero');
        if (hero) {
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        }
    });

    // Counter animation
    function animateCounters() {
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const count = parseInt(counter.innerText);
            const increment = target / 100;
            
            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(() => animateCounters(), 20);
            } else {
                counter.innerText = target;
            }
        });
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Trigger counter animation if element has counter class
                if (entry.target.classList.contains('counter-section')) {
                    animateCounters();
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.fade-in, .counter-section');
    animatedElements.forEach(el => observer.observe(el));

    // After images/fonts load, refresh AOS and re-run nav handler to avoid shifts
    window.addEventListener('load', () => {
        try { AOS.refresh(); } catch (e) {}
        handleNavScroll();
    });

    // Mobile menu close on link click
    const navLinks = document.querySelectorAll('.nav-link');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        });
    });

    // Loading screen
    const loading = document.querySelector('.loading');
    if (loading) {
        window.addEventListener('load', function() {
            setTimeout(() => {
                loading.classList.add('hidden');
                setTimeout(() => {
                    loading.remove();
                }, 500);
            }, 1000);
        });
    }

    // Form validation and submission (for contact page)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            const privacy = formData.get('privacy');
            
            // Basic validation
            if (!name || !email || !privacy) {
                showAlert('Compila tutti i campi obbligatori.', 'danger');
                return;
            }
            
            if (!isValidEmail(email)) {
                showAlert('Inserisci un indirizzo email valido.', 'danger');
                return;
            }
            
            // Simulate form submission
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Invio in corso...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showAlert('Messaggio inviato con successo! Ti contatteremo presto.', 'success');
                this.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }

    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Show alert function
    function showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        const container = document.querySelector('.container');
        if (container) {
            container.insertBefore(alertDiv, container.firstChild);
            
            // Auto remove after 5 seconds
            setTimeout(() => {
                if (alertDiv.parentNode) {
                    alertDiv.remove();
                }
            }, 5000);
        }
    }

    // Lazy loading for images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // Back to top button
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.type = 'button';
    backToTopBtn.setAttribute('aria-label', "Torna all'inizio");
    document.body.appendChild(backToTopBtn);

    const toggleBackToTop = () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    };
    window.addEventListener('scroll', toggleBackToTop);
    toggleBackToTop();

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Add hover effects to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Categories scroller arrows (desktop)
    const scrollerWrap = document.querySelector('.categories-scroller-wrap');
    const scroller = document.querySelector('.categories-scroller');
    const prevBtn = document.querySelector('.cat-nav.prev');
    const nextBtn = document.querySelector('.cat-nav.next');
    if (scrollerWrap && scroller && prevBtn && nextBtn) {
        const updateArrows = () => {
            const maxScroll = scroller.scrollWidth - scroller.clientWidth;
            const x = scroller.scrollLeft;
            prevBtn.disabled = x <= 2;
            nextBtn.disabled = x >= maxScroll - 2;
        };
        const scrollAmount = () => Math.max(240, Math.round(scroller.clientWidth * 0.6));
        prevBtn.addEventListener('click', () => scroller.scrollBy({ left: -scrollAmount(), behavior: 'smooth' }));
        nextBtn.addEventListener('click', () => scroller.scrollBy({ left: scrollAmount(), behavior: 'smooth' }));
        scroller.addEventListener('scroll', updateArrows);
        window.addEventListener('resize', updateArrows);
        // Initialize after layout
        setTimeout(updateArrows, 0);
    }
});

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance optimization
const debouncedScroll = debounce(function() {
    // Scroll-based animations can be added here
}, 10);

window.addEventListener('scroll', debouncedScroll);


// Mobile menu handled by Bootstrap Collapse
// Custom mobile menu (no Bootstrap)
document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const menu = document.querySelector('.mobile-menu');
    const backdrop = document.querySelector('.mobile-menu-backdrop');
    const closeBtn = document.querySelector('.mobile-menu-close');
    const links = document.querySelectorAll('.mobile-menu .nav-link');
        const submenuToggles = document.querySelectorAll('.mm-submenu-toggle');
        const submenuParents = document.querySelectorAll('.mobile-menu .has-submenu');

    if (!toggle || !menu || !backdrop) return;

    const openMenu = () => {
        menu.classList.add('open');
        backdrop.classList.add('show');
        document.body.classList.add('menu-open');
    };
    const closeMenu = () => {
        menu.classList.remove('open');
        backdrop.classList.remove('show');
        document.body.classList.remove('menu-open');
    };

    toggle.addEventListener('click', openMenu);
    backdrop.addEventListener('click', closeMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    // Close on link click, but ignore submenu toggles
    links.forEach(l => {
        l.addEventListener('click', (e) => {
            // If the click originated from submenu toggle button, don't close
            if (e.target.closest('.mm-submenu-toggle')) return;
            closeMenu();
        });
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('open')) {
            closeMenu();
        }
    });

        // Submenu toggle
        submenuToggles.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const parent = btn.closest('.has-submenu');
                const expanded = btn.getAttribute('aria-expanded') === 'true';
                // close siblings
                submenuParents.forEach(p => {
                    if (p !== parent) {
                        p.classList.remove('open');
                        const b = p.querySelector('.mm-submenu-toggle');
                        if (b) b.setAttribute('aria-expanded', 'false');
                    }
                });
                // toggle current
                parent.classList.toggle('open', !expanded);
                btn.setAttribute('aria-expanded', String(!expanded));
            });
        });
});

// ------------------------------------------------------------
// Cookie Consent Manager (lightweight, GDPR-friendly)
// ------------------------------------------------------------
(function() {
    const STORAGE_KEY = 'cookieConsent';
    const CATEGORIES = ['necessary', 'preferences', 'analytics', 'marketing'];

    function getConsent() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            // Ensure necessary is always true
            parsed.necessary = true;
            return parsed;
        } catch (e) {
            return null;
        }
    }

    function setConsent(consent) {
        const normalized = Object.fromEntries(CATEGORIES.map(c => [c, Boolean(consent[c])]))
        normalized.necessary = true; // cannot be disabled
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
        applyConsent(normalized);
    }

    function isGranted(category) {
        if (category === 'necessary') return true;
        const c = getConsent();
        return !!(c && c[category]);
    }

    // Expose helper globally for future integrations
    window.isConsentGranted = isGranted;

    function applyConsent(consent) {
        // Execute any deferred scripts that match granted categories
        const deferred = document.querySelectorAll('script[type="text/plain"][data-consent]');
        deferred.forEach(s => {
            const cat = s.getAttribute('data-consent');
            if (cat && consent[cat]) {
                const run = document.createElement('script');
                // copy attributes except type
                for (const attr of s.attributes) {
                    if (attr.name === 'type') continue;
                    if (attr.name === 'data-consent') continue;
                    run.setAttribute(attr.name, attr.value);
                }
                run.text = s.text || '';
                s.replaceWith(run);
            }
        });
    }

    function renderBanner() {
        if (getConsent()) {
            // Already set, just apply (e.g., after reload)
            applyConsent(getConsent());
            return;
        }

        const banner = document.createElement('div');
        banner.className = 'cookie-banner';
        banner.innerHTML = `
            <div class="cb-inner">
                <div class="cb-text">
                    Usiamo cookie tecnici per il corretto funzionamento del sito e, previo consenso, cookie per preferenze, statistiche e marketing. 
                    Per saperne di più consulta la <a href="#" class="cb-link">Privacy Policy</a>.
                </div>
                <div class="cb-actions">
                    <button type="button" class="btn btn-light cb-btn cb-reject">Rifiuta</button>
                    <button type="button" class="btn btn-outline-light cb-btn cb-settings">Preferenze</button>
                    <button type="button" class="btn btn-primary cb-btn cb-accept">Accetta tutti</button>
                </div>
            </div>
        `;
        document.body.appendChild(banner);

        // Preferences modal
        const modal = document.createElement('div');
        modal.className = 'cookie-modal';
        modal.innerHTML = `
            <div class="cm-backdrop" data-close></div>
            <div class="cm-dialog" role="dialog" aria-modal="true" aria-labelledby="cm-title">
                <div class="cm-header">
                    <h5 id="cm-title">Preferenze cookie</h5>
                    <button class="cm-close" aria-label="Chiudi" data-close>&times;</button>
                </div>
                <div class="cm-body">
                    <div class="cm-row">
                        <label class="cm-label"><strong>Necessari</strong> (sempre attivi)</label>
                        <input type="checkbox" checked disabled>
                        <div class="cm-help">Cookie indispensabili al funzionamento del sito.</div>
                    </div>
                    <div class="cm-row">
                        <label class="cm-label">Preferenze</label>
                        <input type="checkbox" data-cat="preferences">
                        <div class="cm-help">Ricordano scelte come lingua o layout.</div>
                    </div>
                    <div class="cm-row">
                        <label class="cm-label">Statistiche</label>
                        <input type="checkbox" data-cat="analytics">
                        <div class="cm-help">Aiutano a migliorare il sito (es. analytics anonimizzati).</div>
                    </div>
                    <div class="cm-row">
                        <label class="cm-label">Marketing</label>
                        <input type="checkbox" data-cat="marketing">
                        <div class="cm-help">Contenuti/annunci personalizzati e tracciamento.</div>
                    </div>
                </div>
                <div class="cm-footer">
                    <button class="btn btn-outline-secondary cm-btn" data-close>Annulla</button>
                    <button class="btn btn-primary cm-btn" data-save>Salva preferenze</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        const acceptBtn = banner.querySelector('.cb-accept');
        const rejectBtn = banner.querySelector('.cb-reject');
        const settingsBtn = banner.querySelector('.cb-settings');
        const closeEls = modal.querySelectorAll('[data-close]');
        const saveBtn = modal.querySelector('[data-save]');

        const openModal = () => modal.classList.add('open');
        const closeModal = () => modal.classList.remove('open');

        acceptBtn.addEventListener('click', () => {
            setConsent({ necessary: true, preferences: true, analytics: true, marketing: true });
            banner.remove();
            closeModal();
        });
        rejectBtn.addEventListener('click', () => {
            setConsent({ necessary: true, preferences: false, analytics: false, marketing: false });
            banner.remove();
            closeModal();
        });
        settingsBtn.addEventListener('click', openModal);
        closeEls.forEach(el => el.addEventListener('click', closeModal));
        saveBtn.addEventListener('click', () => {
            const prefs = {
                necessary: true,
                preferences: !!modal.querySelector('input[data-cat="preferences"]').checked,
                analytics: !!modal.querySelector('input[data-cat="analytics"]').checked,
                marketing: !!modal.querySelector('input[data-cat="marketing"]').checked
            };
            setConsent(prefs);
            banner.remove();
            closeModal();
        });
    }

    // Add a footer link helper to reopen preferences
    function attachManageLink() {
        // If you add a link with id="manage-cookies" in footer/privacy, this will open the modal
        const link = document.getElementById('manage-cookies');
        if (!link) return;
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // Force show modal and prefill with stored values
            let modal = document.querySelector('.cookie-modal');
            if (!modal) {
                // If banner was already removed on initial accept/reject, re-render minimal modal
                renderBanner();
                modal = document.querySelector('.cookie-modal');
                const banner = document.querySelector('.cookie-banner');
                if (banner) banner.remove();
            }
            const stored = getConsent() || {};
            const setChecked = (cat, sel) => {
                const input = modal.querySelector(`input[data-cat="${cat}"]`);
                if (input) input.checked = !!stored[cat];
            };
            setChecked('preferences');
            setChecked('analytics');
            setChecked('marketing');
            modal.classList.add('open');
        });
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            if (!getConsent()) renderBanner(); else applyConsent(getConsent());
            attachManageLink();
        });
    } else {
        if (!getConsent()) renderBanner(); else applyConsent(getConsent());
        attachManageLink();
    }
})();


