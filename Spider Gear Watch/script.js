const canvas = document.getElementById("spiderClock");
const ctx = canvas.getContext("2d");

// High-DPI setup for crisp lines
canvas.width = 800;
canvas.height = 800;
const cx = canvas.width / 2;
const cy = canvas.height / 2;
const clockRadius = 260;

// Leg segment lengths
const upperLeg = 110;
const lowerLeg = 130;

/**
 * Draws rotating spider-web gears in the background
 */
function drawWebGear(x, y, radius, rotation, opacity) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.strokeStyle = `rgba(255, 140, 0, ${opacity})`;
    ctx.lineWidth = 1;

    // Web Rings
    for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        ctx.arc(0, 0, (radius / 4) * i, 0, Math.PI * 2);
        ctx.stroke();
    }
    // Web Spokes
    for (let i = 0; i < 12; i++) {
        const ang = (i * Math.PI) / 6;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(ang) * radius, Math.sin(ang) * radius);
        ctx.stroke();
    }
    ctx.restore();
}

/**
 * Draws a professional organic spider leg reaching a target
 */
function drawLeg(targetX, targetY, color, width) {
    const dist = Math.sqrt(targetX * targetX + targetY * targetY);
    const d = Math.min(dist, upperLeg + lowerLeg - 5);

    // Law of Cosines for IK
    const angleA = Math.acos((upperLeg**2 + d**2 - lowerLeg**2) / (2 * upperLeg * d));
    const baseAngle = Math.atan2(targetY, targetX);

    const kneeX = upperLeg * Math.cos(baseAngle - angleA);
    const kneeY = upperLeg * Math.sin(baseAngle - angleA);

    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    
    ctx.moveTo(0, 0);
    // Control point is pushed outward (1.8x) to create the high spider arch
    ctx.quadraticCurveTo(kneeX * 1.8, kneeY * 1.8, targetX, targetY);
    ctx.stroke();

    // Small glowing joint detail
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(kneeX * 0.9, kneeY * 0.9, width * 0.6, 0, Math.PI * 2);
    ctx.fill();
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Background Atmosphere (3 Gears)
    const time = Date.now() * 0.0003;
    drawWebGear(cx - 100, cy - 80, 100, time, 0.12);
    drawWebGear(cx + 120, cy + 30, 130, -time * 1.3, 0.1);
    drawWebGear(cx - 30, cy + 150, 80, time * 2, 0.15);

    ctx.save();
    ctx.translate(cx, cy);

    // 2. Draw Numbers with Neon Glow
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#ff8c00";
    ctx.fillStyle = "#ff8c00";
    ctx.font = "bold 30px 'Courier New', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let i = 1; i <= 12; i++) {
        const theta = (i * 30 - 90) * (Math.PI / 180);
        ctx.fillText(i, Math.cos(theta) * clockRadius, Math.sin(theta) * clockRadius);
    }
    ctx.shadowBlur = 0; // Turn off shadow for the spider itself

    // 3. Time Calculations
    const now = new Date();
    const h = (now.getHours() % 12 + now.getMinutes()/60) * 30 - 90;
    const m = (now.getMinutes() + now.getSeconds()/60) * 6 - 90;
    const s = now.getSeconds() * 6 - 90;

    // Add a biological "breathing" twitch
    const twitch = Math.sin(Date.now() * 0.01) * 4;

    // 4. Draw Legs (The Hands)
    const toRad = Math.PI / 180;
    drawLeg(Math.cos(h*toRad)*(clockRadius-80), Math.sin(h*toRad)*(clockRadius-80), "#ff4400", 9); // Hour
    drawLeg(Math.cos(m*toRad)*(clockRadius-50), Math.sin(m*toRad)*(clockRadius-50), "#ff8c00", 6); // Minute
    drawLeg(Math.cos(s*toRad)*(clockRadius-20) + twitch, Math.sin(s*toRad)*(clockRadius-20) + twitch, "#ffa500", 2); // Second

    // 5. Professional Spider Silhouette
    ctx.fillStyle = "#ff8c00";
    // Abdomen
    ctx.beginPath();
    ctx.ellipse(0, 10, 18, 25, 0, 0, Math.PI * 2);
    ctx.fill();
    // Head (Thorax)
    ctx.beginPath();
    ctx.ellipse(0, -15, 12, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    // Glowing Eyes
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(-4, -18, 2, 0, Math.PI * 2);
    ctx.arc(4, -18, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
    requestAnimationFrame(animate);
}

animate();