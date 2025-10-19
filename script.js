document.addEventListener('DOMContentLoaded', () => {

    // --- MOUSE SPOTLIGHT EFFECT ---
    const spotlightEl = document.getElementById('spotlight');
    document.addEventListener('mousemove', e => {
        spotlightEl.style.setProperty('--x', e.clientX + 'px');
        spotlightEl.style.setProperty('--y', e.clientY + 'px');
    });

    // --- PARTICLE BACKGROUND ---
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particlesArray;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Mouse position
    let mouse = {
        x: null,
        y: null,
        radius: (canvas.height / 120) * (canvas.width / 120)
    }

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    // Create particle
    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }
        // Method to draw individual particle
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'; // Subtle white/grey particles
            ctx.fill();
        }
        // Check particle position, mouse position, move the particle, draw the particle
        update() {
            // Check if particle is still within canvas
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }

            // Check mouse collision
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < mouse.radius + this.size) {
                if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                    this.x += 5;
                }
                if (mouse.x > this.x && this.x > this.size * 10) {
                    this.x -= 5;
                }
                if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                    this.y += 5;
                }
                if (mouse.y > this.y && this.y > this.size * 10) {
                    this.y -= 5;
                }
            }
            // Move particle
            this.x += this.directionX;
            this.y += this.directionY;
            // Draw particle
            this.draw();
        }
    }

    // Create particle array
    function init() {
        particlesArray = [];
        let numberOfParticles = (canvas.height * canvas.width) / 9000;
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1;
            let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * .4) - 0.2;
            let directionY = (Math.random() * .4) - 0.2;
            let color = 'rgba(255, 255, 255, 0.15)';

            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, innerWidth, innerHeight);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
    }

    // Initialize and run the animation
    init();
    animate();

    // Resize event
    window.addEventListener('resize', () => {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        mouse.radius = ((canvas.height / 120) * (canvas.height / 120));
        init();
    });
    
    // Mouse out event
    window.addEventListener('mouseout', () => {
        mouse.x = undefined;
        mouse.y = undefined;
    });

    // --- SCROLL-TRIGGERED ANIMATIONS ---
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    revealElements.forEach(el => observer.observe(el));

    // Staggered project reveal
    const projectEls = document.querySelectorAll('.project');
    projectEls.forEach((el, idx) => {
        el.style.setProperty('--delay', `${idx * 120}ms`);
    });

    // Apply reveal to all cards automatically
    document.querySelectorAll('.card').forEach(card => {
        if (!card.classList.contains('reveal')) {
            card.classList.add('reveal');
            observer.observe(card);
        }
    });

    // --- COLLAPSING HEADER + SHRINKING AVATAR ---
    const header = document.getElementById('header');
    const hero = document.getElementById('hero');
    const profilePhoto = document.getElementById('profile-photo');
    const heroTitle = document.querySelector('.hero-title');

    const compactor = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // When hero top scrolls past the header, compact
            if (!entry.isIntersecting) {
                header.classList.add('header-compact');
                profilePhoto.classList.add('small');
                heroTitle.classList.remove('spaced');
            } else {
                header.classList.remove('header-compact');
                profilePhoto.classList.remove('small');
                heroTitle.classList.add('spaced');
            }
        });
    }, { rootMargin: '-64px 0px 0px 0px', threshold: 0 });

    compactor.observe(hero);

    // --- SCROLLSPY NAV HIGHLIGHT ---
    const sections = [
        { id: 'projects', link: document.querySelector('a[href="#projects"]') },
        { id: 'skills', link: document.querySelector('a[href="#skills"]') },
        { id: 'problem-wall', link: document.querySelector('a[href="#problem-wall"]') },
    ];
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const found = sections.find(s => s.id === entry.target.id);
            if (!found || !found.link) return;
            if (entry.isIntersecting) {
                sections.forEach(s => s.link && s.link.classList.remove('text-blue-500'));
                found.link.classList.add('text-blue-500');
            }
        });
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0.01 });
    sections.forEach(s => {
        const el = document.getElementById(s.id);
        if (el) sectionObserver.observe(el);
    });
    
    // --- RESUME FILTER ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const timelineItems = document.querySelectorAll('.timeline-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;

            // Update button styles
            filterButtons.forEach(btn => {
                btn.classList.remove('bg-blue-600', 'text-white');
                btn.classList.add('bg-neutral-800');
            });
            button.classList.add('bg-blue-600', 'text-white');
            button.classList.remove('bg-neutral-800');

            // Filter timeline items
            timelineItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // --- HIRE ME MODAL ---
    const hireMeBtn = document.getElementById('hire-me-btn');
    const modal = document.getElementById('hire-me-modal');
    const modalContent = document.getElementById('modal-content');
    const closeModalBtn = document.getElementById('close-modal-btn');
    
    const openModal = () => {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent background scroll
        setTimeout(() => {
            modalContent.classList.remove('opacity-0', '-translate-y-4');
            modalContent.classList.add('opacity-100', 'translate-y-0');
        }, 10);
    };

    const closeModal = () => {
        modalContent.classList.add('opacity-0', '-translate-y-4');
        modalContent.classList.remove('opacity-100', 'translate-y-0');
        setTimeout(() => {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }, 300);
    };

    if (hireMeBtn) hireMeBtn.addEventListener('click', openModal);
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) { // Close if clicking on the backdrop
                closeModal();
            }
        });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
    
    // Note: A full "Problem Solved Wall" modal would be similar to the "Hire Me" modal.
    // For brevity, only the hire me modal is fully implemented.
    const problemCards = document.querySelectorAll('.problem-card');
    problemCards.forEach(card => {
        card.addEventListener('click', () => {
            // In a full implementation, you'd open a modal here
            // with details about the solved problem.
            alert('This would open a modal with details on: "' + card.innerText + '"');
        });
    });

    // --- FULLSCREEN VIDEO MODAL FOR LIVE DEMOS ---
    const videoModal = document.getElementById('video-modal');
    const videoEl = document.getElementById('demo-video');
    const videoCloseBtn = document.getElementById('video-close');
    const liveDemoButtons = document.querySelectorAll('.live-demo-btn');

    const openVideo = (src) => {
        if (!videoModal || !videoEl) return;
        const safeSrc = encodeURI(src);
        videoEl.src = safeSrc;
        // Reload the video element to ensure the new source is picked up
        try { videoEl.load(); } catch (_) {}
        videoModal.classList.remove('hidden');
        videoEl.play().catch(() => {
            // If autoplay fails, user can press play; ensure controls visible
            videoEl.setAttribute('controls', '');
        });
        document.body.style.overflow = 'hidden';
    };

    const closeVideo = () => {
        if (!videoModal || !videoEl) return;
        try { videoEl.pause(); } catch (_) {}
        videoEl.currentTime = 0;
        videoEl.removeAttribute('src');
        try { videoEl.load(); } catch (_) {}
        videoModal.classList.add('hidden');
        document.body.style.overflow = '';
    };

    liveDemoButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const src = btn.getAttribute('data-video');
            if (src) openVideo(src);
        });
    });

    if (videoCloseBtn) videoCloseBtn.addEventListener('click', closeVideo);
    if (videoModal) {
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) closeVideo();
        });
    }

    // --- FOOTER CONTACT FORM: open email client with prefilled content ---
    const footerForm = document.getElementById('footer-contact-form');
    const toastEl = document.getElementById('toast');
    if (footerForm) {
        footerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('footer-name')?.value || '';
            const email = document.getElementById('footer-email')?.value || '';
            const phone = document.getElementById('footer-phone')?.value || '';
            const message = document.getElementById('footer-message')?.value || '';
            const subject = encodeURIComponent(`Portfolio contact from ${name}`);
            const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`);
            window.location.href = `mailto:jitesh0510@gmail.com?subject=${subject}&body=${body}`;

            // success toast
            if (toastEl) {
                toastEl.textContent = 'Thanks! Your email app should open now to send the message.';
                toastEl.classList.remove('text-neutral-500');
                toastEl.classList.add('text-blue-400');
                setTimeout(() => {
                    toastEl.textContent = '© 2026 Jitesh. Crafted with care and code.';
                    toastEl.classList.add('text-neutral-500');
                    toastEl.classList.remove('text-blue-400');
                }, 4000);
            }
        });
    }
});
