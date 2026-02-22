import { useEffect, useRef, useCallback } from 'react';
import { useTheme } from '@mui/material';

interface Snowflake {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  swayOffset: number;
  swaySpeed: number;
}

interface SnowEffectProps {
  enabled: boolean;
}

export default function SnowEffect({ enabled }: SnowEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snowflakesRef = useRef<Snowflake[]>([]);
  const animationRef = useRef<number | undefined>(undefined);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const initSnowflakes = useCallback((width: number, height: number) => {
    const count = Math.floor((width * height) / 8000); // Density based on screen size
    snowflakesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 1, // 1-3px
      speed: Math.random() * 1 + 0.5, // 0.5-1.5px per frame
      opacity: Math.random() * 0.5 + 0.3, // 0.3-0.8
      swayOffset: Math.random() * Math.PI * 2,
      swaySpeed: Math.random() * 0.02 + 0.01,
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !enabled) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initSnowflakes(canvas.width, canvas.height);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let frameCount = 0;
    const animate = () => {
      frameCount++;
      // Render every 2nd frame for performance (30fps)
      if (frameCount % 2 === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const snowColor = isDark ? '211, 211, 211' : '255, 255, 255';

        snowflakesRef.current.forEach((flake) => {
          // Update position
          flake.y += flake.speed;
          flake.swayOffset += flake.swaySpeed;
          const swayX = Math.sin(flake.swayOffset) * 0.5;

          // Reset if off screen
          if (flake.y > canvas.height) {
            flake.y = -5;
            flake.x = Math.random() * canvas.width;
          }

          // Draw snowflake
          ctx.beginPath();
          ctx.arc(flake.x + swayX, flake.y, flake.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${snowColor}, ${flake.opacity})`;
          ctx.fill();
        });
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [enabled, isDark, initSnowflakes]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
}
