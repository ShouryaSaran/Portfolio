/* ── THEME TOGGLE ── */
        const toggle = document.getElementById('themeToggle');
        const html = document.documentElement;
        let dark = false;
        toggle.addEventListener('click', () => {
            dark = !dark;
            html.setAttribute('data-theme', dark ? 'dark' : 'light');
        });

        /* ── HERO PARALLAX BG WORD ── */
        const bgWord = document.getElementById('bgWord');
        const heroOrbs = document.querySelectorAll('.hero-orb');
        const projectCards = document.querySelectorAll('.proj-card');
        const supportsPointerMotion = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        let pointerX = window.innerWidth / 2;
        let pointerY = window.innerHeight / 2;
        let rafPending = false;

        function updateMotion() {
            const heroX = (pointerX / window.innerWidth - 0.5) * 30;
            const heroY = (pointerY / window.innerHeight - 0.5) * 15;
            bgWord.style.transform = `translate(calc(-50% + ${heroX}px), calc(-50% + ${heroY}px))`;

            heroOrbs.forEach((orb, index) => {
                const depth = index === 0 ? 18 : 28;
                const offsetX = (pointerX / window.innerWidth - 0.5) * depth;
                const offsetY = (pointerY / window.innerHeight - 0.5) * depth * 0.6;
                orb.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
            });

            rafPending = false;
        }

        if (supportsPointerMotion) {
            document.addEventListener('pointermove', e => {
                pointerX = e.clientX;
                pointerY = e.clientY;
                if (!rafPending) {
                    rafPending = true;
                    requestAnimationFrame(updateMotion);
                }
            });
        }

        /* ── PROJECT CARD PARALLAX ── */
        if (supportsPointerMotion) {
            projectCards.forEach(card => {
            let cardRafPending = false;
            let lastX = 0;
            let lastY = 0;

            const applyTilt = () => {
                const r = card.getBoundingClientRect();
                const x = lastX - r.left;
                const y = lastY - r.top;
                const cx = r.width / 2;
                const cy = r.height / 2;
                const rotX = ((y - cy) / cy) * -7;
                const rotY = ((x - cx) / cx) * 9;
                card.style.transform = `perspective(1100px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-7px)`;
                card.style.setProperty('--mx', `${x}px`);
                card.style.setProperty('--my', `${y}px`);
                cardRafPending = false;
            };

            card.addEventListener('pointermove', e => {
                lastX = e.clientX;
                lastY = e.clientY;
                if (!cardRafPending) {
                    cardRafPending = true;
                    requestAnimationFrame(applyTilt);
                }
            });

            card.addEventListener('pointerleave', () => {
                card.style.transform = '';
                card.style.setProperty('--mx', '50%');
                card.style.setProperty('--my', '50%');
            });
            });
        }

        /* ── SCROLL REVEAL + SKILL BARS ── */
        const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                } else {
                    entry.target.classList.remove('in');
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

        revealEls.forEach(el => io.observe(el));

        const skillIO = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll('.skill-fill').forEach(bar => {
                        bar.style.width = bar.dataset.w + '%';
                    });
                } else {
                    entry.target.querySelectorAll('.skill-fill').forEach(bar => {
                        bar.style.width = '0%';
                    });
                }
            });
        }, { threshold: 0.3, rootMargin: '0px 0px -12% 0px' });

        document.querySelectorAll('.skills-table').forEach(t => skillIO.observe(t));
