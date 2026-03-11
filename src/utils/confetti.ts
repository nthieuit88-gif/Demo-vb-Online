import confetti from 'canvas-confetti';

export function banPhaoHoa() {
  confetti({
    particleCount: 120,
    spread: 80,
    startVelocity: 45,
    decay: 0.9,
    gravity: 0.7,
    ticks: 200,
    origin: { y: 0.6 },
    colors: ['#3b82f6', '#16a34a', '#dc2626', '#f59e0b', '#8b5cf6'],
    shapes: ['square', 'circle'],
    zIndex: 9999
  });

  setTimeout(() => {
    confetti({ particleCount: 80, angle: 60, spread: 55, origin: { x: 0 } });
    confetti({ particleCount: 80, angle: 120, spread: 55, origin: { x: 1 } });
  }, 300);
}
