import { useRef, useEffect, useState } from "react";

function Canvas() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null); // To track the animation frame
  const [fadeOut, setFadeOut] = useState(false); // State to trigger fade-out

  useEffect(() => {
    const HALF_PI = Math.PI * 0.5;

    let ctx;
    let particles = [];
    const timeStep = 1 / 80;
    const viewWidth = 512;
    const viewHeight = 512;

    const Ease = {
      outCubic: (t, b, c, d) => {
        t /= d;
        t--;
        return c * (t * t * t + 1) + b;
      },
    };

    const cubeBezier = (p0, p1, p2, p3, t) => {
      const cX = 3 * (p1.x - p0.x);
      const bX = 3 * (p2.x - p1.x) - cX;
      const aX = p3.x - p0.x - cX - bX;

      const cY = 3 * (p1.y - p0.y);
      const bY = 3 * (p2.y - p1.y) - cY;
      const aY = p3.y - p0.y - cY - bY;

      const x = aX * Math.pow(t, 3) + bX * Math.pow(t, 2) + cX * t + p0.x;
      const y = aY * Math.pow(t, 3) + bY * Math.pow(t, 2) + cY * t + p0.y;

      return { x, y };
    };

    const Point = function (x, y) {
      this.x = x || 0;
      this.y = y || 0;
    };

    const Particle = function (p0, p1, p2, p3) {
      this.p0 = p0;
      this.p1 = p1;
      this.p2 = p2;
      this.p3 = p3;

      this.time = 0;
      this.duration = 3 + Math.random() * 2;
      this.color = `#${Math.floor(Math.random() * 0xffffff).toString(16)}`;

      this.w = 8;
      this.h = 6;

      this.complete = false;
    };

    Particle.prototype = {
      update: function () {
        this.time = Math.min(this.duration, this.time + timeStep);
        const f = Ease.outCubic(this.time, 0, 1, this.duration);
        const p = cubeBezier(this.p0, this.p1, this.p2, this.p3, f);

        const dx = p.x - this.x;
        const dy = p.y - this.y;

        this.r = Math.atan2(dy, dx) + HALF_PI;
        this.sy = Math.sin(Math.PI * f * 10);
        this.x = p.x;
        this.y = p.y;

        this.complete = this.time === this.duration;
      },
      draw: function () {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.r);
        ctx.scale(1, this.sy);

        ctx.fillStyle = this.color;
        ctx.fillRect(-this.w * 0.5, -this.h * 0.5, this.w, this.h);

        ctx.restore();
      },
    };

    const initCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = viewWidth;
      canvas.height = viewHeight;
      ctx = canvas.getContext("2d");

      createParticles();
      startAnimation();
    };

    const createParticles = () => {
      particles = [];
      for (let i = 0; i < 128; i++) {
        const p0 = new Point(viewWidth * 0.5, viewHeight * 0.5);
        const p1 = new Point(
          Math.random() * viewWidth,
          Math.random() * viewHeight
        );
        const p2 = new Point(
          Math.random() * viewWidth,
          Math.random() * viewHeight
        );
        const p3 = new Point(Math.random() * viewWidth, viewHeight + 64);

        particles.push(new Particle(p0, p1, p2, p3));
      }
    };

    const loop = () => {
      update();
      draw();

      // if (particles.every((p) => p.complete)) {
      //   createParticles();
      // }

      animationRef.current = requestAnimationFrame(loop);
    };

    const startAnimation = () => {
      cancelAnimationFrame(animationRef.current); // Stop any existing animation loop
      animationRef.current = requestAnimationFrame(loop); // Start a new one
    };

    const stopAnimation = () => {
      cancelAnimationFrame(animationRef.current);
    };

    const update = () => {
      particles.forEach((p) => p.update());
    };

    const draw = () => {
      ctx.clearRect(0, 0, viewWidth, viewHeight);
      particles.forEach((p) => p.draw());
    };

    initCanvas(); // Only call initCanvas once to start the animation

    // Fade-out effect triggered after 5 seconds
    setTimeout(() => {
      setFadeOut(true);
    }, 1500);

    return () => {
      stopAnimation(); // Ensure to stop animation on unmount
      particles = [];
      ctx = null; // Clean up
    };
  }, []); // Empty dependency array ensures the effect runs only once

  return (
    <canvas
      id="drawing_canvas"
      ref={canvasRef}
      style={{
        position: "fixed",
        width: "100%",
        height: "100%",
        top: "-50%",
        left: "50%",
        transform: "translateX(-50%)",
        opacity: fadeOut ? 0 : 1, // Opacity will fade out over time
        transition: "opacity 2s ease", // Smooth transition for both properties
        right: 0,
        pointerEvents: "none",
        zIndex: 9999,
      }}
    ></canvas>
  );
}

export default Canvas;
