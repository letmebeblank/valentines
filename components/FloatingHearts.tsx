
import React, { useEffect, useRef } from 'react';

const FloatingHearts: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let hearts: Heart[] = [];

    const resize = () => {
      // Set actual canvas size to window size for sharp rendering
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Heart {
      x: number;
      y: number;
      size: number;
      speed: number;
      opacity: number;
      rotation: number;
      rotationSpeed: number;
      color: string;

      constructor() {
        this.x = Math.random() * canvas!.width;
        // Start randomly on screen or just below
        this.y = Math.random() * canvas!.height; 
        this.size = Math.random() * 20 + 10; // Size between 10 and 30
        this.speed = Math.random() * 1.5 + 0.5; // Speed between 0.5 and 2
        this.opacity = Math.random() * 0.5 + 0.2; // Opacity between 0.2 and 0.7
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.05;
        // Randomize between a few shades of pink/red
        const colors = ['255, 182, 193', '255, 105, 180', '255, 192, 203', '250, 128, 114'];
        const selectedColor = colors[Math.floor(Math.random() * colors.length)];
        this.color = `rgba(${selectedColor}, ${this.opacity})`;
      }

      update() {
        this.y -= this.speed;
        this.rotation += this.rotationSpeed;

        // Reset if it goes off the top
        if (this.y < -50) {
          this.y = canvas!.height + 50;
          this.x = Math.random() * canvas!.width;
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        // Scale based on size. The SVG path is roughly 24x24 units.
        const scale = this.size / 24;
        ctx.scale(scale, scale);
        // Center the heart
        ctx.translate(-12, -12);

        ctx.fillStyle = this.color;
        
        // Heart Path (M12 21.35...)
        ctx.beginPath();
        ctx.moveTo(12, 21.35);
        ctx.bezierCurveTo(5.4, 15.36, 2, 12.28, 2, 8.5);
        ctx.bezierCurveTo(2, 5.42, 4.42, 3, 7.5, 3);
        ctx.bezierCurveTo(9.24, 3, 10.91, 3.81, 12, 5.09);
        ctx.bezierCurveTo(13.09, 3.81, 14.76, 3, 16.5, 3);
        ctx.bezierCurveTo(19.58, 3, 22, 5.42, 22, 8.5);
        ctx.bezierCurveTo(22, 12.28, 18.6, 15.36, 13.55, 20.04);
        ctx.lineTo(12, 21.35);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }
    }

    const init = () => {
      resize();
      // Initialize 60 hearts
      hearts = Array.from({ length: 60 }, () => new Heart());
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      hearts.forEach(heart => {
        heart.update();
        heart.draw(ctx);
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    init();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

export default FloatingHearts;
