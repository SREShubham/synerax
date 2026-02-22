// =====================================================
// SYNERAX - Interactive Features
// =====================================================

// Initialize Canvas Background Animation
function initCanvasBackground() {
    const canvas = document.getElementById('canvas');
    if (!canvas) return;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x00D4FF, 0.6);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xFF3D3D, 0.8);
        pointLight.position.set(50, 50, 50);
        scene.add(pointLight);

        const pointLight2 = new THREE.PointLight(0x00D4FF, 0.6);
        pointLight2.position.set(-50, -50, -50);
        scene.add(pointLight2);

        // Animation loop
        function animate3d() {
            requestAnimationFrame(animate3d);

            objects.forEach(obj => {
                obj.mesh.rotation.x += obj.speedX * 2;
                obj.mesh.rotation.y += obj.speedY * 2;
                obj.mesh.rotation.z += obj.speedZ * 2;

                obj.mesh.position.x += obj.speedX * 0.5;
                obj.mesh.position.y += obj.speedY * 0.5;
                obj.mesh.position.z += obj.speedZ * 0.5;

                // Wrap around boundaries
                if (obj.mesh.position.x > 60) obj.mesh.position.x = -60;
                if (obj.mesh.position.x < -60) obj.mesh.position.x = 60;
                if (obj.mesh.position.y > 60) obj.mesh.position.y = -60;
                if (obj.mesh.position.y < -60) obj.mesh.position.y = 60;
                if (obj.mesh.position.z > 60) obj.mesh.position.z = -60;
                if (obj.mesh.position.z < -60) obj.mesh.position.z = 60;
            });

            // Subtle camera movement
            camera.position.z += (Math.sin(Date.now() * 0.0001) * 0.1);
            renderer.render(scene, camera);
        }

        animate3d();

        // Handle window resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        console.log('✓ Three.js 3D scene initialized');
    } catch (error) {
        console.log('⚠ Three.js initialization skipped:', error);
    }
}

// FLOATING ELEMENTS ANIMATION
function initFloatingElements() {
    const floatingElements = document.querySelectorAll('.float-box');
    
    floatingElements.forEach((element, index) => {
        element.style.animation = `float 15s ease-in-out infinite`;
        element.style.animationDelay = `${index * 1}s`;
    });
}

// Initialize Canvas Background Animation
function initCanvasBackground() {
    const canvas = document.getElementById('canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Particle system for tech background
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2;
            this.vx = (Math.random() - 0.5) * 1;
            this.vy = (Math.random() - 0.5) * 1;
            this.color = this.getRandomTechColor();
        }

        getRandomTechColor() {
            const colors = ['#0066CC', '#FF3D3D', '#00D4FF', '#FF6B9D'];
            return colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    const particles = [];
    const particleCount = 100;

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Draw connections
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    ctx.strokeStyle = `rgba(0, 102, 204, ${0.1 - distance / 1500})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        drawConnections();
        requestAnimationFrame(animate);
    }

    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// =====================================================
// NAVIGATION BAR INTERACTION
// =====================================================

function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');

    // Hamburger menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Close menu when link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // Add scrolled class on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// =====================================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// =====================================================

function initScrollAnimations() {
    // Select all elements to animate
    const elementsToObserve = document.querySelectorAll(
        '.service-card, .founder-card, .stat-card, .testimonial-card, .tech-category'
    );
    
    // Mark elements not in viewport as will-animate
    elementsToObserve.forEach(element => {
        const rect = element.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight * 0.85 && rect.bottom > 0;
        
        if (!isInViewport) {
            element.classList.add('will-animate');
        } else {
            element.classList.add('animate');
        }
    });

    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('will-animate');
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements
    elementsToObserve.forEach(element => {
        if (element.classList.contains('will-animate')) {
            observer.observe(element);
        }
    });
}

// =====================================================
// COUNTER ANIMATION FOR STATISTICS
// =====================================================

function initCounterAnimation() {
    const statCards = document.querySelectorAll('.stat-number');
    
    const countUp = (element) => {
        const target = parseInt(element.textContent);
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = element.textContent;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + (element.textContent.includes('+') ? '+' : (element.textContent.includes('%') ? '%' : ''));
            }
        }, 16);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target.querySelector('.stat-number');
                if (statNumber && !statNumber.hasAttribute('data-animated')) {
                    countUp(statNumber);
                    statNumber.setAttribute('data-animated', 'true');
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statCards.forEach(card => {
        observer.observe(card.closest('.stat-card'));
    });
}

// =====================================================
// NEWSLETTER FORM HANDLING
// =====================================================

function initNewsletter() {
    const form = document.querySelector('.newsletter-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = form.querySelector('input[type="email"]');
        
        if (email.value) {
            // Show success message
            const button = form.querySelector('button');
            const originalText = button.textContent;
            button.textContent = '✓ Subscribed!';
            button.style.background = 'linear-gradient(135deg, #00AA00, #00FF00)';

            setTimeout(() => {
                email.value = '';
                button.textContent = originalText;
                button.style.background = '';
            }, 3000);
        }
    });
}

// =====================================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// =====================================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// =====================================================
// TOOLTIP INITIALIZATION
// =====================================================

function initTooltips() {
    const tooltipElements = document.querySelectorAll('[title]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            // Tooltip is handled by browser default
        });
    });
}

// =====================================================
// MOBILE MENU ENHANCEMENT
// =====================================================

function enhanceMobileMenu() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const navMenu = document.querySelector('.nav-menu');
            const hamburger = document.querySelector('.hamburger');
            
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });
}

// =====================================================
// PARALLAX EFFECT FOR HERO SECTION
// =====================================================

function initParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const techBackground = hero.querySelector('.tech-background');
        if (techBackground) {
            techBackground.style.transform = `translateY(${scrollY * 0.5}px)`;
        }
    });
}

// =====================================================
// FORM VALIDATION
// =====================================================

function initFormValidation() {
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', function() {
            const email = this.value;
            const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            
            if (email && !isValid) {
                this.style.borderColor = '#FF3D3D';
            } else {
                this.style.borderColor = '';
            }
        });
    });
}

// =====================================================
// DARK MODE TOGGLE (Optional Feature)
// =====================================================

function initDarkModeToggle() {
    // Check if user prefers dark mode
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // You can add a toggle button later
    if (prefersDark) {
        document.body.style.filter = 'invert(0.1)';
    }
}

// =====================================================
// INITIALIZATION
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
    initThreeJsBackground();
    initCanvasBackground();
    initNavigation();
    initScrollAnimations();
    initCounterAnimation();
    initNewsletter();
    initSmoothScroll();
    initTooltips();
    enhanceMobileMenu();
    initParallax();
    initFormValidation();
    initDarkModeToggle();
    initFloatingElements();

    console.log('✓ Synerax website initialized successfully with 3D animations');
});

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

// Debounce function for scroll events
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

// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// =====================================================
// PERFORMANCE MONITORING
// =====================================================

if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log('Page Load Time:', pageLoadTime + 'ms');
    });
}
