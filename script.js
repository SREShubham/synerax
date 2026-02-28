// =====================================================
// SYNERAX - Interactive Features
// =====================================================

// THREE.JS HERO BACKGROUND
function initThreeJsBackground() {
    const container = document.getElementById('canvas3d');
    if (!container || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0d2847, 22, 140);

    const getSize = () => ({ width: container.clientWidth || window.innerWidth, height: container.clientHeight || window.innerHeight });
    const initialSize = getSize();

    const camera = new THREE.PerspectiveCamera(62, initialSize.width / initialSize.height, 0.1, 1200);
    camera.position.set(0, 2.5, 40);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(initialSize.width, initialSize.height);
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.28));
    const key = new THREE.PointLight(0x6dd5ff, 1.15, 260);
    key.position.set(34, 20, 26);
    scene.add(key);
    const fill = new THREE.PointLight(0x2e7dff, 0.9, 240);
    fill.position.set(-28, -16, -24);
    scene.add(fill);

    // Core wireframe sphere
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    const core = new THREE.Mesh(
        new THREE.IcosahedronGeometry(9, 1),
        new THREE.MeshBasicMaterial({ color: 0x8ae7ff, wireframe: true, transparent: true, opacity: 0.34 })
    );
    coreGroup.add(core);

    const innerCore = new THREE.Mesh(
        new THREE.OctahedronGeometry(5.8, 0),
        new THREE.MeshPhongMaterial({ color: 0x1d4fb3, wireframe: true, transparent: true, opacity: 0.22, shininess: 90 })
    );
    coreGroup.add(innerCore);

    const ringA = new THREE.Mesh(
        new THREE.TorusGeometry(12.5, 0.08, 12, 180),
        new THREE.MeshBasicMaterial({ color: 0x69cbff, transparent: true, opacity: 0.35 })
    );
    ringA.rotation.x = Math.PI * 0.42;
    coreGroup.add(ringA);

    const ringB = new THREE.Mesh(
        new THREE.TorusGeometry(14.8, 0.08, 12, 180),
        new THREE.MeshBasicMaterial({ color: 0x3ca2ff, transparent: true, opacity: 0.24 })
    );
    ringB.rotation.y = Math.PI * 0.35;
    coreGroup.add(ringB);

    // Data nodes orbiting around core
    const nodeCount = 70;
    const nodeGeom = new THREE.SphereGeometry(0.16, 8, 8);
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0x9fe9ff, transparent: true, opacity: 0.9 });
    const nodes = [];

    for (let i = 0; i < nodeCount; i++) {
        const n = new THREE.Mesh(nodeGeom, nodeMat);
        const radius = 17 + Math.random() * 12;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;

        n.position.set(
            radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.cos(phi),
            radius * Math.sin(phi) * Math.sin(theta)
        );
        scene.add(n);
        nodes.push({
            mesh: n,
            velocity: new THREE.Vector3((Math.random() - 0.5) * 0.03, (Math.random() - 0.5) * 0.03, (Math.random() - 0.5) * 0.03)
        });
    }

    // Dynamic network links
    const lineMax = 180;
    const linePositions = new Float32Array(lineMax * 2 * 3);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setDrawRange(0, 0);
    const lineMesh = new THREE.LineSegments(
        lineGeometry,
        new THREE.LineBasicMaterial({ color: 0x67c7ff, transparent: true, opacity: 0.17 })
    );
    scene.add(lineMesh);

    // Starfield depth layer
    const starCount = 850;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
        starPositions[i * 3] = (Math.random() - 0.5) * 220;
        starPositions[i * 3 + 1] = (Math.random() - 0.5) * 120;
        starPositions[i * 3 + 2] = (Math.random() - 0.5) * 220;
    }
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const stars = new THREE.Points(
        starGeometry,
        new THREE.PointsMaterial({ color: 0xb8ecff, size: 0.22, transparent: true, opacity: 0.38, sizeAttenuation: true })
    );
    scene.add(stars);

    const mouse = { x: 0, y: 0 };
    window.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = (event.clientY / window.innerHeight) * 2 - 1;
    });

    function updateLinks() {
        let segmentIndex = 0;
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const a = nodes[i].mesh.position;
                const b = nodes[j].mesh.position;
                const dist = a.distanceTo(b);
                if (dist < 8.5 && segmentIndex < lineMax) {
                    const base = segmentIndex * 6;
                    linePositions[base] = a.x;
                    linePositions[base + 1] = a.y;
                    linePositions[base + 2] = a.z;
                    linePositions[base + 3] = b.x;
                    linePositions[base + 4] = b.y;
                    linePositions[base + 5] = b.z;
                    segmentIndex++;
                }
            }
        }
        lineGeometry.setDrawRange(0, segmentIndex * 2);
        lineGeometry.attributes.position.needsUpdate = true;
    }

    function animate3d() {
        requestAnimationFrame(animate3d);
        const t = performance.now() * 0.001;

        coreGroup.rotation.y += 0.0014;
        coreGroup.rotation.x = Math.sin(t * 0.35) * 0.08;
        ringA.rotation.z += 0.002;
        ringB.rotation.x -= 0.0017;
        innerCore.rotation.z += 0.0012;

        nodes.forEach((n) => {
            n.mesh.position.add(n.velocity);
            if (n.mesh.position.length() > 30) {
                n.mesh.position.multiplyScalar(0.96);
                n.velocity.multiplyScalar(-1);
            }
        });

        const starPos = starGeometry.attributes.position.array;
        for (let i = 0; i < starCount; i++) {
            const idx = i * 3 + 2;
            starPos[idx] += 0.05;
            if (starPos[idx] > 90) starPos[idx] = -120;
        }
        starGeometry.attributes.position.needsUpdate = true;

        updateLinks();

        camera.position.x += ((mouse.x * 2.2) - camera.position.x) * 0.03;
        camera.position.y += ((-mouse.y * 1.6) - camera.position.y) * 0.03;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
    }

    animate3d();

    window.addEventListener('resize', () => {
        const size = getSize();
        camera.aspect = size.width / size.height;
        camera.updateProjectionMatrix();
        renderer.setSize(size.width, size.height);
    });
}

// Initialize Canvas Background Animation
function initCanvasBackground() {
    const canvas = document.getElementById('canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let fontSize = 16;
    let columns = 0;
    let drops = [];
    const glyphs = (
        '01{}[]()<>=+-*/%$#@&_~^|\\:;,.? ' +
        'function const let var class import export return async await'
    ).split('');

    function setupCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        columns = Math.ceil(canvas.width / fontSize);
        drops = Array.from({ length: columns }, () => Math.random() * -60);
    }

    function drawCodeRain() {
        // Trails
        ctx.fillStyle = 'rgba(10, 28, 48, 0.16)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = `${fontSize}px Menlo, Monaco, Consolas, "Courier New", monospace`;

        for (let i = 0; i < drops.length; i++) {
            const char = glyphs[Math.floor(Math.random() * glyphs.length)];
            const x = i * fontSize;
            const y = drops[i] * fontSize;

            const headAlpha = 0.75 + Math.random() * 0.2;
            const tailAlpha = 0.25 + Math.random() * 0.2;

            // Glow head
            ctx.fillStyle = `rgba(140, 235, 255, ${headAlpha})`;
            ctx.fillText(char, x, y);

            // Secondary trail tint
            ctx.fillStyle = `rgba(0, 170, 255, ${tailAlpha})`;
            ctx.fillText(char, x, y - fontSize);

            if (y > canvas.height + fontSize && Math.random() > 0.975) {
                drops[i] = Math.random() * -20;
            }

            drops[i] += 0.7 + Math.random() * 0.5;
        }

        requestAnimationFrame(drawCodeRain);
    }

    setupCanvas();
    drawCodeRain();

    window.addEventListener('resize', setupCanvas);
}

// =====================================================
// NAVIGATION BAR INTERACTION
// =====================================================

function initHeroTyping() {
    const typingTarget = document.querySelector('.hero-typing');
    if (!typingTarget) return;

    const fullText = (typingTarget.getAttribute('data-text') || typingTarget.textContent || '').trim();
    if (!fullText) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        typingTarget.textContent = fullText;
        return;
    }

    let index = 0;
    let deleting = false;
    const typingSpeed = 90;
    const deletingSpeed = 45;
    const pauseAfterType = 1200;
    const pauseAfterDelete = 350;

    typingTarget.classList.add('typing');
    typingTarget.textContent = '';

    function tick() {
        if (!deleting) {
            index += 1;
            typingTarget.textContent = fullText.slice(0, index);

            if (index >= fullText.length) {
                deleting = true;
                setTimeout(tick, pauseAfterType);
                return;
            }

            setTimeout(tick, typingSpeed);
            return;
        }

        index -= 1;
        typingTarget.textContent = fullText.slice(0, index);

        if (index <= 0) {
            deleting = false;
            setTimeout(tick, pauseAfterDelete);
            return;
        }

        setTimeout(tick, deletingSpeed);
    }

    tick();
}

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

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = form.querySelector('input[type="email"]');
        const button = form.querySelector('button[type="submit"]');
        if (!email || !button) return;

        const submitUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSceXgxNorK8an_wINhi8fKaDLr8TJunHv5VViuCQ6-ZVQzRWg/formResponse';
        const openFormUrl = 'https://forms.gle/mcigYVRkAZ7E6ejTA';
        const entryKey = 'entry.485609515';
        
        if (email.value) {
            const originalText = button.textContent;
            button.textContent = 'Submitting...';
            button.disabled = true;

            try {
                const payload = new URLSearchParams();
                payload.append(entryKey, email.value.trim());

                await fetch(submitUrl, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                    },
                    body: payload.toString()
                });

                button.textContent = '✓ Subscribed!';
                button.style.background = 'linear-gradient(135deg, #00AA00, #00FF00)';
                email.value = '';
            } catch (error) {
                button.textContent = 'Open Form';
                button.style.background = 'linear-gradient(135deg, #FF8A00, #FFB300)';
                window.open(openFormUrl, '_blank', 'noopener');
            }

            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
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
    initHeroTyping();
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
