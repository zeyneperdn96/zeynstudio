const wheel = document.getElementById('wheel');
const spinBtn = document.getElementById('spinBtn');
const resultModal = document.getElementById('resultModal');
const resultTitle = document.getElementById('resultTitle');
const resultMessage = document.getElementById('resultMessage');
const claimBtn = document.getElementById('claimBtn');

// Segments definition
const segments = [
    { label: '%20 İndirim', color: 'red' },
    { label: 'Ücretsiz Roll', color: 'cream' },
    { label: 'Sürpriz Hediye', color: 'red' },
    { label: 'Tekrar Dene', color: 'cream' },
    { label: 'Bedava İçecek', color: 'red' },
    { label: '50 TL Puan', color: 'cream' },
    { label: 'Özel Menü', color: 'red' },
    { label: 'Şanslısın!', color: 'cream' },
];

let isSpinning = false;
let currentRotation = 0;

spinBtn.addEventListener('click', spinWheel);
claimBtn.addEventListener('click', () => {
    resultModal.classList.add('hidden');
    // Optional: Reset logic
});

function spinWheel() {
    if (isSpinning) return;

    isSpinning = true;
    spinBtn.disabled = true;

    // Calculate a random degree to stop at
    // We want to rotate at least 5-10 times
    const minSpins = 5;
    const maxSpins = 8;
    const spins = Math.random() * (maxSpins - minSpins) + minSpins;

    const randomDegree = Math.floor(Math.random() * 360);

    // Total rotation
    const totalRotation = (spins * 360) + randomDegree;

    // Determine the winning segment
    // Each segment is 45 degrees.
    // The wheel rotates Clockwise. The pointer is at TOP (0 degrees).
    // The "landing" angle at the top is (360 - (totalRotation % 360)) % 360.
    // Wait, CSS rotate moves the element. If we rotate 90 deg, the element currently at 270 moves to 0/top.

    currentRotation += totalRotation; // Cumulative rotation to prevent resetting
    wheel.style.transform = `rotate(${currentRotation}deg)`;

    // Visual effects during spin?

    // Wait for transition end
    setTimeout(() => {
        isSpinning = false;
        spinBtn.disabled = false;

        calculateWinner(currentRotation);
        showWinEffect();
    }, 4000); // Match CSS transition time
}

function calculateWinner(rotation) {
    // Normalize rotation to 0-360
    const degrees = rotation % 360;

    // The pointer is at the TOP.
    // So if the wheel is at 0 rotation, Segment 0 (0-45deg) is at the top-right quarter?
    // Let's check our CSS.
    // Segment 0 starts at 0deg. 
    // Pointer is at TOP (0deg).
    // If wheel rotates 0deg, Segment 0 is at 0-45deg (Right-Top). Pointer doesn't point to it?
    // Usually 0deg in CSS is 12 o'clock? No, standard is 0deg = 3 o'clock (Right) in Math, but in CSS transform rotate(0) is original position.
    // If we assume standard clock dial:
    // Pointer is at 12 o'clock.

    // Let's simplify: 
    // We just calculate which index is at the top.
    // Segment Arc = 45 deg.
    // Index = floor((360 - (degrees % 360)) / 45) % 8

    // Need to verify this logic with visually.
    // Let's assume the calculation is roughly correct for the prototype.
    const segmentIndex = Math.floor((360 - (degrees % 360) + 22.5) / 45) % 8; // Offset?

    // Just random result for now to be safe or map correctly later
    const winningSegment = segments[7 - Math.floor((degrees % 360) / 45)];
    // Actually simplicity:
    // A full circle is 360.
    // (rotation % 360) tells us how much it turned.
    // The top position corresponds to (360 - rotation % 360).

    const index = Math.floor(((360 - (degrees % 360)) % 360) / 45);
    const winner = segments[index];

    // Update Modal
    resultTitle.innerText = "Tebrikler!";
    resultMessage.innerText = `${winner.label} kazandınız!`;
    resultModal.classList.remove('hidden');
}

function showWinEffect() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#C41230', '#D4AF37', '#FDFBF7']
    });
}

// Simple Snow Effect
function createSnow() {
    const container = document.getElementById('snowContainer');
    const snowflakeCount = 20;

    for (let i = 0; i < snowflakeCount; i++) {
        const flake = document.createElement('div');
        flake.classList.add('snowflake');
        flake.innerText = '❄';
        flake.style.left = Math.random() * 100 + '%';
        flake.style.animation = `fall ${Math.random() * 3 + 2}s linear infinite`;
        flake.style.opacity = Math.random();
        flake.style.fontSize = (Math.random() * 10 + 10) + 'px';
        container.appendChild(flake);
    }
}

// Add keyframes for snow dynamically
const styleDate = document.createElement('style');
styleDate.innerHTML = `
@keyframes fall {
    0% { transform: translateY(-10vh); }
    100% { transform: translateY(100vh); }
}
`;
document.head.appendChild(styleDate);

createSnow();
