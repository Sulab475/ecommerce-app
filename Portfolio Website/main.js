document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       1. Custom Cursor
       ========================================================================== */
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        // Slight delay for follower
        setTimeout(() => {
            follower.style.left = e.clientX + 'px';
            follower.style.top = e.clientY + 'px';
        }, 50);
    });

    // Hover effect on interactive elements
    const interactables = document.querySelectorAll('a, button, .project-card, .chatbot-toggle, .stat-box');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            follower.classList.add('active');
        });
        el.addEventListener('mouseleave', () => {
            follower.classList.remove('active');
        });
    });

    /* ==========================================================================
       2. Canvas Matrix / Particle Background
       ========================================================================== */
    const canvas = document.getElementById('matrixCanvas');
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let particles = [];
    
    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2;
            this.baseColor = Math.random() > 0.5 ? '#00f3ff' : '#b500ff';
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }
        
        draw() {
            ctx.fillStyle = this.baseColor;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Init particles
    for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
    }
    
    let mouse = { x: null, y: null };
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            
            // Connect particles to mouse
            if (mouse.x != null) {
                const dx = mouse.x - particles[i].x;
                const dy = mouse.y - particles[i].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 243, 255, ${1 - distance/150})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
            
            // Connect particles to each other
            for (let j = i; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(181, 0, 255, ${0.2 * (1 - distance/100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();

    /* ==========================================================================
       3. Scroll Animations (Intersection Observer)
       ========================================================================== */
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animate progress bars if they exist in this section
                const progressFills = entry.target.querySelectorAll('.progress-fill');
                if (progressFills.length > 0) {
                    progressFills.forEach(fill => {
                        fill.style.transform = 'scaleX(1)';
                    });
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add fade-in class and observe
    const animatedElements = document.querySelectorAll('.section-title, .about-text, .stat-box, .project-card, .skill-category, .timeline-item, .contact-content');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    /* ==========================================================================
       4. 3D Tilt Effect on Project Cards
       ========================================================================== */
    const cards = document.querySelectorAll('.3d-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10; // Max rotation 10deg
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });

    /* ==========================================================================
       5. Chatbot Mockup Logic
       ========================================================================== */
    const chatToggle = document.querySelector('.chatbot-toggle');
    const chatWindow = document.querySelector('.chatbot-window');
    const chatInput = document.querySelector('.chatbot-input input');
    const chatSendBtn = document.querySelector('.send-btn');
    const chatMessages = document.querySelector('.chatbot-messages');
    
    // Toggle window
    chatToggle.addEventListener('click', () => {
        chatWindow.classList.toggle('hidden');
        if (!chatWindow.classList.contains('hidden')) {
            chatInput.focus();
        }
    });

    // Handle sending message
    function sendMessage() {
        const text = chatInput.value.trim();
        if (text === '') return;
        
        // Add user message
        const userMsg = document.createElement('div');
        userMsg.className = 'message user';
        userMsg.textContent = text;
        chatMessages.appendChild(userMsg);
        
        chatInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Simulate AI thinking and response
        setTimeout(() => {
            const aiMsg = document.createElement('div');
            aiMsg.className = 'message ai';
            aiMsg.textContent = "Processing... I am a mockup AI. To unlock my full potential, contact the admin.";
            chatMessages.appendChild(aiMsg);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
    }
    
    chatSendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    /* ==========================================================================
       6. Glitch Text Effect for Hero (Simple Vanilla approach)
       ========================================================================== */
    const glitchText = document.querySelector('.glitch .neon-text');
    if (glitchText) {
        const originalText = glitchText.textContent;
        const chars = '!<>-_\\\\/[]{}—=+*^?#________';
        
        setInterval(() => {
            if (Math.random() > 0.95) { // 5% chance to glitch every interval
                let newText = '';
                for (let i = 0; i < originalText.length; i++) {
                    if (Math.random() > 0.8) {
                        newText += chars[Math.floor(Math.random() * chars.length)];
                    } else {
                        newText += originalText[i];
                    }
                }
                glitchText.textContent = newText;
                
                // Reset back to normal quickly
                setTimeout(() => {
                    glitchText.textContent = originalText;
                }, 100);
            }
        }, 200);
    }
});
