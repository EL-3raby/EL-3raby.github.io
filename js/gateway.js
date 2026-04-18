/**
 * GATEWAY ANIMATIONS
 * Interactive backgrounds for Split Screen
 * Ahmed Elaraby
 */

document.addEventListener('DOMContentLoaded', () => {
    initFSBackground();
    initMLBackground();
    initDividerInteraction();
});

/**
 * 1. Full Stack Side: Digital Grid Animation
 */
function initFSBackground() {
    const canvas = document.getElementById('fs-canvas');
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let particles = [];
    
    function resize() {
        if (window.innerWidth <= 1024) {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight / 2;
        } else {
            width = canvas.width = window.innerWidth / 2;
            height = canvas.height = window.innerHeight;
        }
    }
    
    window.addEventListener('resize', resize);
    resize();
    
    class Line {
        constructor(y) {
            this.y = y;
            this.opacity = Math.random() * 0.5;
            this.speed = Math.random() * 1 + 0.5;
        }
        
        draw() {
            ctx.beginPath();
            ctx.moveTo(0, this.y);
            ctx.lineTo(width, this.y);
            ctx.strokeStyle = `rgba(0, 242, 255, ${this.opacity * 0.2})`;
            ctx.stroke();
            
            this.y += this.speed;
            if (this.y > height) this.y = 0;
        }
    }
    
    for (let i = 0; i < 20; i++) {
        particles.push(new Line(Math.random() * height));
    }
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        // Draw Grid
        ctx.strokeStyle = 'rgba(0, 242, 255, 0.05)';
        for (let x = 0; x < width; x += 30) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        
        particles.forEach(p => p.draw());
        requestAnimationFrame(animate);
    }
    
    animate();
}

/**
 * 2. Machine Learning Side: Neural Network Particles
 */
function initMLBackground() {
    const canvas = document.getElementById('ml-canvas');
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let particles = [];
    let mouse = { x: -100, y: -100 };
    
    function resize() {
        if (window.innerWidth <= 1024) {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight / 2;
        } else {
            width = canvas.width = window.innerWidth / 2;
            height = canvas.height = window.innerHeight;
        }
    }
    
    window.addEventListener('resize', resize);
    resize();
    
    window.addEventListener('mousemove', (e) => {
        if (window.innerWidth > 1024) {
            if (e.clientX > window.innerWidth / 2) {
                mouse.x = e.clientX - window.innerWidth / 2;
                mouse.y = e.clientY;
            } else {
                mouse.x = -100;
            }
        } else {
            if (e.clientY > window.innerHeight / 2) {
                mouse.x = e.clientX;
                mouse.y = e.clientY - window.innerHeight / 2;
            }
        }
    });
    
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 1;
            this.vy = (Math.random() - 0.5) * 1;
            this.r = Math.random() * 2 + 1;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
            
            // Mouse react
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 100) {
                this.x -= dx * 0.02;
                this.y -= dy * 0.02;
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 0, 234, 0.5)';
            ctx.fill();
        }
    }
    
    for (let i = 0; i < 50; i++) particles.push(new Particle());
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        particles.forEach((p, i) => {
            p.update();
            p.draw();
            
            // Connect
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(255, 0, 234, ${1 - dist/100 * 0.5})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

/**
 * 3. Divider Interaction
 */
function initDividerInteraction() {
    const divider = document.querySelector('.glow-divider');
    const fsSide = document.querySelector('.side-fullstack');
    const mlSide = document.querySelector('.side-ml');
    
    fsSide.addEventListener('mouseenter', () => {
        divider.style.boxShadow = '0 0 30px rgba(0, 242, 255, 0.8)';
        divider.style.background = 'var(--fs-accent)';
    });
    
    mlSide.addEventListener('mouseenter', () => {
        divider.style.boxShadow = '0 0 30px rgba(255, 0, 234, 0.8)';
        divider.style.background = 'var(--ml-accent)';
    });
    
    [fsSide, mlSide].forEach(side => {
        side.addEventListener('mouseleave', () => {
            divider.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.5)';
            divider.style.background = 'white';
        });
    });
}
