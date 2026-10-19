"use client";

import React, { useEffect, useRef } from "react";

interface FloatingParticlesProps {
  /** If true, sits fixed covering the whole viewport; if false, covers parent container */
  fixed?: boolean;
  count?: number;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  baseAlpha: number;
  alpha: number;
  speedY: number;
  speedX: number;
  color: string;
  glowColor: string;
  swaySpeed: number;
  swayOffset: number;
  pulseSpeed: number;
  pulsePhase: number;
}

const MINT_COLORS = [
  { fill: "#A6E4D1", glow: "rgba(166, 228, 209, 0.65)" }, // Signature Soft Mint
  { fill: "#237A60", glow: "rgba(35, 122, 96, 0.45)" },   // Deep Mint Accent
  { fill: "#8CE0C7", glow: "rgba(140, 224, 199, 0.6)" },  // Bright Jade Mint
  { fill: "#C9F5E8", glow: "rgba(201, 245, 232, 0.7)" },  // Pastel Mint White
  { fill: "#52B79A", glow: "rgba(82, 183, 154, 0.5)" },   // Emerald Tint
];

export default function FloatingParticles({
  fixed = true,
  count,
  className = "",
}: FloatingParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mousePos = useRef<{ x: number; y: number; active: boolean }>({
    x: -9999,
    y: -9999,
    active: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];

    const handleResize = () => {
      if (!canvas) return;
      const rect = fixed
        ? { width: window.innerWidth, height: window.innerHeight }
        : canvas.parentElement?.getBoundingClientRect() ?? {
            width: window.innerWidth,
            height: window.innerHeight,
          };

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);

      // Determine particle count based on screen size (minimal & subtle)
      const targetCount = count ?? (width < 768 ? 10 : 18);

      // Re-populate particles (soft circular glowing mint dots only - minimalist)
      particles = [];
      for (let i = 0; i < targetCount; i++) {
        const col = MINT_COLORS[Math.floor(Math.random() * MINT_COLORS.length)];
        const size = 1.2 + Math.random() * 1.6; // tiny & delicate
        const baseAlpha = 0.15 + Math.random() * 0.3; // soft & transparent

        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size,
          baseAlpha,
          alpha: baseAlpha,
          speedY: -(0.1 + Math.random() * 0.22), // very slow gentle float
          speedX: (Math.random() - 0.5) * 0.15,
          color: col.fill,
          glowColor: col.glow,
          swaySpeed: 0.0006 + Math.random() * 0.001,
          swayOffset: Math.random() * Math.PI * 2,
          pulseSpeed: 0.0015 + Math.random() * 0.002,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const onMouseMove = (e: MouseEvent) => {
      if (fixed) {
        mousePos.current = { x: e.clientX, y: e.clientY, active: true };
      } else if (canvas) {
        const rect = canvas.getBoundingClientRect();
        mousePos.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          active: true,
        };
      }
    };

    const onMouseLeave = () => {
      mousePos.current.active = false;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseleave", onMouseLeave);

    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = Math.min(now - lastTime, 64);
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      const mx = mousePos.current.x;
      const my = mousePos.current.y;
      const mouseActive = mousePos.current.active;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Gentle drift & sway motion
        const sway = Math.sin(now * p.swaySpeed + p.swayOffset) * p.speedX * 1.5;
        p.x += sway;
        p.y += p.speedY * (dt / 16);

        // Gentle mouse avoidance / breeze
        if (mouseActive) {
          const dx = p.x - mx;
          const dy = p.y - my;
          const distSq = dx * dx + dy * dy;
          const maxDist = 120;
          if (distSq < maxDist * maxDist && distSq > 0) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / maxDist) * 1.0;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force;
          }
        }

        // Loop around when passing off the top or edges
        if (p.y < -15) {
          p.y = height + 15;
          p.x = Math.random() * width;
        } else if (p.y > height + 15) {
          p.y = -15;
        }

        if (p.x < -15) p.x = width + 15;
        if (p.x > width + 15) p.x = -15;

        // Twinkle / pulse opacity
        const pulse = Math.sin(now * p.pulseSpeed + p.pulsePhase);
        p.alpha = Math.max(0.18, Math.min(0.85, p.baseAlpha + pulse * 0.25));

        // Draw particle as a soft round glowing mint dot
        ctx.save();
        ctx.globalAlpha = p.alpha;

        // Soft radial halo glow
        const glowRadius = p.size * 2.8;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowRadius);
        grad.addColorStop(0, p.color);
        grad.addColorStop(0.35, p.glowColor);
        grad.addColorStop(1, "transparent");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Soft inner round core
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.75, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [fixed, count]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none select-none ${className}`}
      style={{
        position: fixed ? "fixed" : "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: fixed ? 1 : 0,
        pointerEvents: "none",
        opacity: 0.55,
      }}
      aria-hidden="true"
    />
  );
}
