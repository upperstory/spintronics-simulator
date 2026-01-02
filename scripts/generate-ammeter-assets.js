/**
 * Generate ammeter gauge assets for the Spintronics simulator.
 *
 * Run with: node scripts/generate-ammeter-assets.js
 * Requires: npm install canvas
 */

const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '../public/images');
const SIZE = 300; // Larger canvas for bigger dial (150 * 2 for 0.5 scale)
const CENTER = SIZE / 2;

// Steampunk color palette
const COLORS = {
    brass: '#b8860b',
    brassLight: '#d4a84b',
    brassDark: '#8b6914',
    copper: '#b87333',
    copperDark: '#8b4513',
    ivory: '#fffff0',
    ivoryDark: '#f5f5dc',
    darkBrown: '#2a1f18',
    needleRed: '#8b0000',
    black: '#1a1a1a',
    shadow: 'rgba(0,0,0,0.3)'
};

/**
 * Generate the sprocket image (gear teeth that rotate with chain)
 */
function generateSprocket() {
    const canvas = createCanvas(SIZE, SIZE);
    const ctx = canvas.getContext('2d');

    // Clear with transparency
    ctx.clearRect(0, 0, SIZE, SIZE);

    const outerRadius = 54;
    const innerRadius = 44;
    const teethCount = 24;

    // Draw gear teeth
    ctx.save();
    ctx.translate(CENTER, CENTER);

    // Gear body gradient
    const gearGradient = ctx.createRadialGradient(0, 0, innerRadius - 10, 0, 0, outerRadius);
    gearGradient.addColorStop(0, COLORS.brassLight);
    gearGradient.addColorStop(0.5, COLORS.brass);
    gearGradient.addColorStop(1, COLORS.brassDark);

    // Draw teeth
    ctx.beginPath();
    for (let i = 0; i < teethCount; i++) {
        const angle = (i / teethCount) * Math.PI * 2;
        const nextAngle = ((i + 0.5) / teethCount) * Math.PI * 2;
        const afterAngle = ((i + 1) / teethCount) * Math.PI * 2;

        if (i === 0) {
            ctx.moveTo(
                Math.cos(angle) * outerRadius,
                Math.sin(angle) * outerRadius
            );
        }

        // Tooth tip
        ctx.lineTo(
            Math.cos(angle) * outerRadius,
            Math.sin(angle) * outerRadius
        );
        // Valley
        ctx.lineTo(
            Math.cos(nextAngle) * innerRadius,
            Math.sin(nextAngle) * innerRadius
        );
        // Next tooth start
        ctx.lineTo(
            Math.cos(afterAngle) * outerRadius,
            Math.sin(afterAngle) * outerRadius
        );
    }
    ctx.closePath();
    ctx.fillStyle = gearGradient;
    ctx.fill();

    // Add highlight ring
    ctx.beginPath();
    ctx.arc(0, 0, innerRadius - 5, 0, Math.PI * 2);
    ctx.strokeStyle = COLORS.brassLight;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Center hole
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.fillStyle = COLORS.darkBrown;
    ctx.fill();

    ctx.restore();

    return canvas;
}

/**
 * Generate the dial face with scale markings
 */
function generateDial() {
    const canvas = createCanvas(SIZE, SIZE);
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, SIZE, SIZE);

    const dialRadius = 128; // 50% larger so chain runs behind dial

    ctx.save();
    ctx.translate(CENTER, CENTER);

    // Dial background - ivory face
    const dialGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, dialRadius);
    dialGradient.addColorStop(0, COLORS.ivory);
    dialGradient.addColorStop(0.8, COLORS.ivoryDark);
    dialGradient.addColorStop(1, '#e8e8d8');

    ctx.beginPath();
    ctx.arc(0, 0, dialRadius, 0, Math.PI * 2);
    ctx.fillStyle = dialGradient;
    ctx.fill();

    // Draw scale arc (semi-circle at top)
    const scaleRadius = 98; // 50% larger
    const startAngle = -Math.PI * 0.75; // -135 degrees
    const endAngle = -Math.PI * 0.25;   // -45 degrees

    // Major tick marks
    ctx.strokeStyle = COLORS.darkBrown;
    ctx.lineWidth = 2;

    const majorTicks = 5; // -max, -half, 0, +half, +max
    for (let i = 0; i < majorTicks; i++) {
        const tickAngle = startAngle + (i / (majorTicks - 1)) * (endAngle - startAngle);
        const innerR = scaleRadius - 18;
        const outerR = scaleRadius;

        ctx.beginPath();
        ctx.moveTo(Math.cos(tickAngle) * innerR, Math.sin(tickAngle) * innerR);
        ctx.lineTo(Math.cos(tickAngle) * outerR, Math.sin(tickAngle) * outerR);
        ctx.stroke();
    }

    // Minor tick marks
    ctx.lineWidth = 1;
    const minorTicks = 21;
    for (let i = 0; i < minorTicks; i++) {
        if (i % 5 === 0) continue; // Skip major tick positions
        const tickAngle = startAngle + (i / (minorTicks - 1)) * (endAngle - startAngle);
        const innerR = scaleRadius - 9;
        const outerR = scaleRadius;

        ctx.beginPath();
        ctx.moveTo(Math.cos(tickAngle) * innerR, Math.sin(tickAngle) * innerR);
        ctx.lineTo(Math.cos(tickAngle) * outerR, Math.sin(tickAngle) * outerR);
        ctx.stroke();
    }

    // Scale labels
    ctx.fillStyle = COLORS.darkBrown;
    ctx.font = 'bold 18px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const labels = ['-', '', '0', '', '+'];
    const labelRadius = scaleRadius - 33;
    for (let i = 0; i < labels.length; i++) {
        const labelAngle = startAngle + (i / (labels.length - 1)) * (endAngle - startAngle);
        const x = Math.cos(labelAngle) * labelRadius;
        const y = Math.sin(labelAngle) * labelRadius;
        ctx.fillText(labels[i], x, y);
    }

    // "mA" label at bottom of dial
    ctx.font = 'bold 18px serif';
    ctx.fillText('mA', 0, 22);

    // Decorative center ring (where needle pivots)
    ctx.beginPath();
    ctx.arc(0, 53, 15, 0, Math.PI * 2);
    ctx.fillStyle = COLORS.brassDark;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, 53, 10, 0, Math.PI * 2);
    ctx.fillStyle = COLORS.brass;
    ctx.fill();

    ctx.restore();

    return canvas;
}

/**
 * Generate the bezel (outer frame)
 */
function generateBezel() {
    const canvas = createCanvas(SIZE, SIZE);
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, SIZE, SIZE);

    const outerRadius = 143;
    const innerRadius = 129;

    ctx.save();
    ctx.translate(CENTER, CENTER);

    // Bezel ring gradient
    const bezelGradient = ctx.createRadialGradient(-10, -10, 0, 0, 0, outerRadius);
    bezelGradient.addColorStop(0, COLORS.copperDark);
    bezelGradient.addColorStop(0.3, COLORS.copper);
    bezelGradient.addColorStop(0.7, COLORS.copperDark);
    bezelGradient.addColorStop(1, '#5a3d28');

    // Outer ring
    ctx.beginPath();
    ctx.arc(0, 0, outerRadius, 0, Math.PI * 2);
    ctx.arc(0, 0, innerRadius, 0, Math.PI * 2, true); // Inner cutout
    ctx.fillStyle = bezelGradient;
    ctx.fill();

    // Highlight on top edge
    ctx.beginPath();
    ctx.arc(0, 0, outerRadius - 1, -Math.PI * 0.8, -Math.PI * 0.2);
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Shadow on bottom edge
    ctx.beginPath();
    ctx.arc(0, 0, outerRadius - 1, Math.PI * 0.2, Math.PI * 0.8);
    ctx.strokeStyle = COLORS.shadow;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Decorative screws
    const screwPositions = [
        { angle: -Math.PI * 0.75 },
        { angle: -Math.PI * 0.25 },
        { angle: Math.PI * 0.25 },
        { angle: Math.PI * 0.75 }
    ];

    for (const screw of screwPositions) {
        const x = Math.cos(screw.angle) * (outerRadius - 8);
        const y = Math.sin(screw.angle) * (outerRadius - 8);

        // Screw head
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fillStyle = COLORS.brassDark;
        ctx.fill();

        // Screw slot
        ctx.beginPath();
        ctx.moveTo(x - 5, y);
        ctx.lineTo(x + 5, y);
        ctx.strokeStyle = COLORS.darkBrown;
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    ctx.restore();

    return canvas;
}

/**
 * Generate the needle
 */
function generateNeedle() {
    const canvas = createCanvas(SIZE, SIZE);
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, SIZE, SIZE);

    ctx.save();
    ctx.translate(CENTER, CENTER);

    // Needle pointing up (will be rotated in-game)
    const needleLength = 105; // 50% larger
    const pivotY = 53; // Match dial center ring position

    // Draw needle shadow first
    ctx.save();
    ctx.translate(3, 3);
    ctx.beginPath();
    ctx.moveTo(0, pivotY - needleLength); // Tip
    ctx.lineTo(-6, pivotY - 12);
    ctx.lineTo(-4, pivotY + 12);
    ctx.lineTo(4, pivotY + 12);
    ctx.lineTo(6, pivotY - 12);
    ctx.closePath();
    ctx.fillStyle = COLORS.shadow;
    ctx.fill();
    ctx.restore();

    // Needle body
    ctx.beginPath();
    ctx.moveTo(0, pivotY - needleLength); // Tip (pointing up)
    ctx.lineTo(-5, pivotY - 12);
    ctx.lineTo(-3.5, pivotY + 9);
    ctx.lineTo(3.5, pivotY + 9);
    ctx.lineTo(5, pivotY - 12);
    ctx.closePath();

    const needleGradient = ctx.createLinearGradient(-6, 0, 6, 0);
    needleGradient.addColorStop(0, '#4a0000');
    needleGradient.addColorStop(0.5, COLORS.needleRed);
    needleGradient.addColorStop(1, '#4a0000');
    ctx.fillStyle = needleGradient;
    ctx.fill();

    // Needle center cap
    ctx.beginPath();
    ctx.arc(0, pivotY, 11, 0, Math.PI * 2);
    ctx.fillStyle = COLORS.darkBrown;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, pivotY, 7, 0, Math.PI * 2);
    ctx.fillStyle = COLORS.brass;
    ctx.fill();

    ctx.restore();

    return canvas;
}

/**
 * Generate toolbar icon
 */
function generateIcon() {
    const canvas = createCanvas(100, 100);
    const ctx = canvas.getContext('2d');
    const center = 50;

    ctx.clearRect(0, 0, 100, 100);

    // Simple gauge icon
    ctx.save();
    ctx.translate(center, center);

    // Outer circle
    ctx.beginPath();
    ctx.arc(0, 0, 40, 0, Math.PI * 2);
    ctx.fillStyle = COLORS.ivory;
    ctx.fill();
    ctx.strokeStyle = COLORS.copper;
    ctx.lineWidth = 4;
    ctx.stroke();

    // Scale arc
    ctx.beginPath();
    ctx.arc(0, 0, 28, -Math.PI * 0.75, -Math.PI * 0.25);
    ctx.strokeStyle = COLORS.darkBrown;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Needle pointing to center-right
    ctx.beginPath();
    ctx.moveTo(0, 10);
    ctx.lineTo(20, -15);
    ctx.strokeStyle = COLORS.needleRed;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Center dot
    ctx.beginPath();
    ctx.arc(0, 10, 5, 0, Math.PI * 2);
    ctx.fillStyle = COLORS.brass;
    ctx.fill();

    // "A" label
    ctx.fillStyle = COLORS.darkBrown;
    ctx.font = 'bold 14px serif';
    ctx.textAlign = 'center';
    ctx.fillText('A', 0, 30);

    ctx.restore();

    return canvas;
}

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Generate and save all assets
const assets = [
    { name: 'ammeter-sprocket.png', generator: generateSprocket },
    { name: 'ammeter-dial.png', generator: generateDial },
    { name: 'ammeter-bezel.png', generator: generateBezel },
    { name: 'ammeter-needle.png', generator: generateNeedle },
    { name: 'ammeter-icon.png', generator: generateIcon }
];

console.log('Generating ammeter assets...');

for (const asset of assets) {
    const canvas = asset.generator();
    const buffer = canvas.toBuffer('image/png');
    const filepath = path.join(OUTPUT_DIR, asset.name);
    fs.writeFileSync(filepath, buffer);
    console.log(`  Created: ${asset.name}`);
}

console.log('Done! Assets saved to:', OUTPUT_DIR);
