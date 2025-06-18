const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let width, height;

function resize() {
width = canvas.width = window.innerWidth;
height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

const dots = [];
const totalDots = 300;
for (let i = 0; i < totalDots; i++) {
dots.push({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    radius: Math.random() * 2 + 1,
    selected: false
});
}

// Cursor position
let mouseX = width / 2;
let mouseY = height / 2;
let targetX = width / 2;
let targetY = height / 2;

document.addEventListener('mousemove', (e) => {
targetX = e.clientX;
targetY = e.clientY;
});

const lineLength = 113;

// For extra smooth animation
let lastTime = 0;
const fps = 60;
const frameTime = 1000 / fps;

function animate(currentTime) {
requestAnimationFrame(animate);

// Limit to 60fps for smoother experience
const elapsed = currentTime - lastTime;
if (elapsed < frameTime) return;
lastTime = currentTime - (elapsed % frameTime);

ctx.clearRect(0, 0, width, height);

// Ultra smooth cursor follow
mouseX += (targetX - mouseX) * 0.2;
mouseY += (targetY - mouseY) * 0.2;

// Find 6 nearest dots
const sortedDots = [...dots].sort((a, b) => {
    const da = (a.x - mouseX) ** 2 + (a.y - mouseY) ** 2;
    const db = (b.x - mouseX) ** 2 + (b.y - mouseY) ** 2;
    return da - db;
});

// Mark selected dots
dots.forEach(dot => dot.selected = false);
sortedDots.slice(0, 6).forEach(dot => dot.selected = true);

// Update and draw dots
for (let dot of dots) {
    // Update position with smooth movement
    dot.x += dot.vx;
    dot.y += dot.vy;
    
    // Smooth edge bounce
    if (dot.x < 0) {
    dot.x = 0;
    dot.vx = Math.abs(dot.vx) * 0.95;
    } else if (dot.x > width) {
    dot.x = width;
    dot.vx = -Math.abs(dot.vx) * 0.95;
    }
    
    if (dot.y < 0) {
    dot.y = 0;
    dot.vy = Math.abs(dot.vy) * 0.95;
    } else if (dot.y > height) {
    dot.y = height;
    dot.vy = -Math.abs(dot.vy) * 0.95;
    }

    dot.vx += (Math.random() - 0.5) * 0.02;
    dot.vy += (Math.random() - 0.5) * 0.02;
    
    const speed = Math.sqrt(dot.vx * dot.vx + dot.vy * dot.vy);
    if (speed > 0.8) {
    dot.vx = (dot.vx / speed) * 0.8;
    dot.vy = (dot.vy / speed) * 0.8;
    }

    // Draw dot
    ctx.beginPath();
    if (dot.selected) {
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'white';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    } else {
        ctx.shadowBlur = 3;
        ctx.shadowColor = 'rgba(200, 200, 255, 0.3)';
        ctx.fillStyle = `rgba(${200 + Math.random() * 55}, ${200 + Math.random() * 55}, 255, 0.4)`; // soft starlight
    }

    ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
}

for (let dot of dots) {
    if (!dot.selected) continue;
    
    const dx = dot.x - mouseX;
    const dy = dot.y - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    const dirX = dx / dist;
    const dirY = dy / dist;
    
    const startX = mouseX;
    const startY = mouseY;
    const endX = mouseX + dirX * Math.min(lineLength, dist);
    const endY = mouseY + dirY * Math.min(lineLength, dist);
    
    ctx.beginPath();
    ctx.lineCap = 'round';
    ctx.lineWidth = 0.9;

    ctx.shadowBlur = 12;
    ctx.shadowColor = 'rgba(0, 247, 255, 0.8)';

    const pulseAlpha = 0.4 + Math.sin(currentTime / 200) * 0.3;
    ctx.strokeStyle = `rgba(0, 247, 255, ${pulseAlpha})`;

    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    ctx.shadowBlur = 0;

}
}

requestAnimationFrame(animate);