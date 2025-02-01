/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import MoveType from "./MoveType";
import { winner } from "../../constants";

function Canvas() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null); // To track the animation frame

  useEffect(() => {
    const TWO_PI = Math.PI * 2;
    const HALF_PI = Math.PI * 0.5;

    let ctx;
    let particles = [];
    const timeStep = 1 / 60;
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

      if (particles.every((p) => p.complete)) {
        createParticles();
      }

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

    initCanvas();

    const interval = setInterval(initCanvas, 5000); // Reinitialize every 2 seconds

    return () => {
      clearInterval(interval); // Clear interval on unmount
      stopAnimation(); // Stop animation on unmount
      particles = [];
      ctx = null; // Clean up
    };
  }, []);

  return (
    <canvas
      id="drawing_canvas"
      ref={canvasRef}
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        top: "-50%",
        left: "50%",
        transform: "translateX(-50%)",
        right: 0,
        pointerEvents: "none",
        zIndex: 9999,
        // backgroundColor:"pink"
      }}
    ></canvas>
  );
}

function WinnerBoard({ playerColor, winnerReason, isCheckMate, setCheckMate }) {
  function isYourWin() {
    return (
      playerColor == isCheckMate ||
      playerColor == isCheckMate ||
      isCheckMate == winner.draw
    );
  }

  if (!isCheckMate) return;

  return (
    <div className="flex justify-center items-center w-dvw h-dvh fixed top-0 left-0 z-[999] bg-[rgba(0,0,0,0.5)]">
      <div className="relative bg-blackDarkest rounded-md text-white w-[min(100dvw,20rem)] flex flex-col items-center justify-center shadow-lg">
        <div className="flex justify-center items-center bg-blackLight p-4 w-[min(100dvw,20rem)] rounded-tl-md rounded-tr-md">
          <img
            src="/images/cross.png"
            onClick={(e) => setCheckMate(0)}
            alt=""
            className="z-50 absolute hover:cursor-pointer right-0 top-0 rounded-md w-8"
          />
          {isYourWin() ? (
            <>
              {<Canvas />}
              <img src="/images/trophy.png" alt="" className="mr-4" />
              <div className="flex flex-col items-center justify-center">
                <p className="font-bold text-2xl">You Won!</p>
                <span className="text-sm text-gray-300">{winnerReason}</span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <p className="font-bold text-2xl">You Lost!</p>
              <span className="text-sm text-gray-300">{winnerReason}</span>
            </div>
          )}
        </div>
        <div className="w-full p-4 z-10">
          <ul className="grid grid-cols-3 justify-between items-center">
            <li className="flex flex-col justify-center items-center">
              <span className="flex items-center gap-2 text-orange-300 font-bold">
                {<MoveType bgColor={"#fdba74"} value={"?"} />}
                {1}
              </span>
              <span className="font-bold text-orange-300">Mistake</span>
            </li>
            <li className="flex flex-col justify-center items-center">
              <span className="flex items-center gap-2 text-[#FF0000] font-bold">
                {<MoveType bgColor={"red"} value={"??"} />}
                {1}
              </span>
              <span className="font-bold text-[#FF0000]">Blunders</span>
            </li>
            <li className="flex flex-col justify-center items-center">
              <span className="flex items-center gap-2 text-rose-400 font-bold">
                {<MoveType bgColor={"#fb7185"} value={"x"} />}
                {1}
              </span>
              <span className="font-bold text-rose-400">Misses</span>
            </li>
          </ul>
          <button className="bg-buttonLight w-full rounded-lg h-12 p-4 py-3 hover:cursor-pointer min-h-fit flex justify-center items-center gap-5 font-extrabold text-[1.3rem] text-white shadow-[0_5px_0px_0px_rgb(69,116,61)] mt-4 }">
            Game Review
          </button>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <button className="rounded-md bg-blackLight px-4 py-2">
              New 3 days
            </button>
            <button className="rounded-md bg-blackLight px-4 py-2">
              Rematch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WinnerBoard;
