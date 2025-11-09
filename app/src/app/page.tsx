'use client';

import { useEffect, useRef, useState } from "react";

const VIDEO_DURATION = 9000;
const KICK_START = 0.55;

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hasFinished, setHasFinished] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    const sizeCanvas = () => {
      const dpr = window.devicePixelRatio ?? 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    sizeCanvas();
    window.addEventListener("resize", sizeCanvas);

    return () => {
      window.removeEventListener("resize", sizeCanvas);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    const drawFrame = (progress: number) => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      ctx.clearRect(0, 0, width, height);

      const dpr = window.devicePixelRatio ?? 1;
      const scaledWidth = width * dpr;
      const scaledHeight = height * dpr;

      if (canvas.width !== scaledWidth || canvas.height !== scaledHeight) {
        ctx.resetTransform();
        canvas.width = scaledWidth;
        canvas.height = scaledHeight;
        ctx.scale(dpr, dpr);
      }

      ctx.fillStyle = "#4070ff";
      ctx.fillRect(0, 0, width, height);

      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "rgba(255,255,255,0.35)");
      gradient.addColorStop(0.4, "rgba(255,255,255,0)");
      gradient.addColorStop(1, "rgba(10,40,10,1)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      const fieldMargin = 40;
      const fieldHeight = height * 0.35;
      const fieldTop = height - fieldHeight - fieldMargin;
      ctx.fillStyle = "#1f7a1f";
      ctx.fillRect(fieldMargin, fieldTop, width - fieldMargin * 2, fieldHeight);

      ctx.strokeStyle = "rgba(255,255,255,0.7)";
      ctx.lineWidth = 2;
      ctx.strokeRect(fieldMargin + 12, fieldTop + 18, width - (fieldMargin + 12) * 2, fieldHeight - 36);

      ctx.beginPath();
      ctx.arc(width * 0.5, fieldTop + fieldHeight / 2, 35, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.fillRect(width - fieldMargin - 46, fieldTop + fieldHeight / 2 - 40, 6, 80);

      ctx.fillStyle = "#1d2a62";
      ctx.fillRect(width - fieldMargin - 120, fieldMargin, 100, 70);
      ctx.fillStyle = "#f4c542";
      ctx.beginPath();
      ctx.ellipse(width - fieldMargin - 70, fieldMargin + 40, 22, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = "600 12px 'Arial'";
      ctx.fillText("KOSOVA", width - fieldMargin - 116, fieldMargin + 18);

      const baseGround = fieldTop + fieldHeight - 20;
      const movement = Math.sin(progress * Math.PI * 4);
      const childTravel = width * 0.35;
      const childStartX = fieldMargin + 120;
      const childX = childStartX + childTravel * Math.min(progress / KICK_START, 1);
      const childY = baseGround - 60 - Math.abs(movement) * 6;

      const torsoLength = 40;
      const legLength = 38;
      const armLength = 32;
      const headRadius = 14;

      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const skinTone = "#f5d0a5";
      const jersey = "#0f3ca6";
      const shorts = "#f8d347";

      ctx.fillStyle = skinTone;
      ctx.beginPath();
      ctx.arc(childX, childY, headRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#000";
      ctx.beginPath();
      ctx.arc(childX - 4, childY - 4, 2, 0, Math.PI * 2);
      ctx.arc(childX + 4, childY - 4, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(childX, childY + 3, 6, 0, Math.PI);
      ctx.strokeStyle = "#6b3f2d";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.lineWidth = 8;
      ctx.strokeStyle = jersey;
      ctx.beginPath();
      ctx.moveTo(childX, childY + headRadius);
      ctx.lineTo(childX, childY + headRadius + torsoLength);
      ctx.stroke();

      const armSwing = movement * 8;
      ctx.strokeStyle = jersey;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(childX, childY + headRadius + 8);
      ctx.lineTo(childX - armLength + armSwing, childY + headRadius + 18);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(childX, childY + headRadius + 8);
      ctx.lineTo(childX + armLength + armSwing, childY + headRadius + 18);
      ctx.stroke();

      const shortsTop = childY + headRadius + torsoLength;
      ctx.strokeStyle = shorts;
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(childX, shortsTop);
      ctx.lineTo(childX, shortsTop + 4);
      ctx.stroke();

      const kickProgress = progress < KICK_START ? 0 : (progress - KICK_START) / (1 - KICK_START);
      const anchorLegAngle = Math.PI / 2 + 0.15 * Math.sin(progress * Math.PI * 2);
      const anchorLegX = childX - Math.cos(anchorLegAngle) * legLength * 0.4;

      ctx.strokeStyle = "#0e0e0e";
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(childX - 4, shortsTop + 2);
      ctx.lineTo(anchorLegX, baseGround - 4);
      ctx.stroke();

      const swingAngle =
        kickProgress <= 0
          ? Math.PI / 2.4 - movement * 0.1
          : Math.PI / 2.4 - kickProgress * 1.4 + Math.sin(progress * Math.PI * 4) * 0.05;
      const swingX = childX + Math.cos(swingAngle) * legLength;
      const swingY = shortsTop + 2 + Math.sin(swingAngle) * legLength;
      ctx.beginPath();
      ctx.moveTo(childX + 4, shortsTop + 2);
      ctx.lineTo(swingX, swingY);
      ctx.stroke();

      ctx.fillStyle = "#d08234";
      ctx.fillRect(childX - 12, childY + headRadius - 6, 24, 10);

      const ballRadius = 12;
      let ballX = swingX + 4;
      let ballY = swingY + 6;

      if (kickProgress <= 0) {
        ballX = childX + 26;
        ballY = baseGround - 6;
      } else {
        const flight = Math.min(kickProgress, 1);
        const flightDistance = width * 0.35;
        ballX = childX + 26 + flight * flightDistance;
        const arcHeight = 65;
        ballY = baseGround - 6 - Math.sin(Math.min(flight * Math.PI, Math.PI)) * arcHeight - flight * 12;
      }

      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#111111";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ballX - ballRadius, ballY);
      ctx.lineTo(ballX + ballRadius, ballY);
      ctx.moveTo(ballX, ballY - ballRadius);
      ctx.lineTo(ballX, ballY + ballRadius);
      ctx.stroke();

      ctx.font = "900 32px 'Arial'";
      ctx.fillStyle = "rgba(255,255,255,0.92)";
      ctx.fillText("KOSOVAR DREAMS", fieldMargin, fieldMargin + 28);

      ctx.font = "600 18px 'Arial'";
      ctx.fillStyle = "rgba(255,255,255,0.8)";
      ctx.fillText("Pristina Junior League Finals", fieldMargin, fieldMargin + 52);

      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.font = "700 14px 'Arial'";
      const clockSeconds = Math.max(0, (1 - progress) * 10);
      ctx.fillText(`00:${clockSeconds.toFixed(1).padStart(4, "0")}`, width / 2 - 36, fieldMargin + 18);

      if (kickProgress > 0.2) {
        ctx.globalAlpha = Math.min((kickProgress - 0.2) * 2, 0.9);
        ctx.strokeStyle = "rgba(255,255,255,1)";
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(ballX - 24, ballY - 18);
        ctx.lineTo(ballX, ballY);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    };

    if (!isPlaying) {
      return;
    }

    const start = performance.now();
    const render = (timestamp: number) => {
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / VIDEO_DURATION, 1);
      drawFrame(progress);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(render);
      } else {
        setIsPlaying(false);
        setHasFinished(true);
      }
    };

    animationRef.current = requestAnimationFrame(render);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isPlaying]);

  const handleReplay = () => {
    setHasFinished(false);
    setIsPlaying(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#061743] to-[#0a1f55] p-4 text-white">
      <main className="flex w-full max-w-5xl flex-col items-center gap-8">
        <h1 className="text-center text-3xl font-semibold uppercase tracking-[0.35rem] text-white/90 sm:text-4xl">
          Young Lions of Kosovo
        </h1>
        <p className="max-w-3xl text-center text-base text-white/80 sm:text-lg">
          A hand-crafted glimpse of a Kosovar child taking their winning shot during a neighborhood
          football match. Enjoy the short animated playback and replay it as many times as you like.
        </p>
        <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-black/60 shadow-2xl backdrop-blur">
          <div className="relative w-full pb-[56.25%]">
            <canvas
              ref={canvasRef}
              className="absolute inset-0 h-full w-full"
            />
          </div>
          <div className="flex items-center justify-between px-6 py-4">
            <span className="text-sm uppercase tracking-widest text-white/70">
              Kosovar Youth Football — Ultra Short Feature
            </span>
            <div className="flex items-center gap-3">
              {hasFinished ? (
                <button
                  onClick={handleReplay}
                  className="rounded-full border border-white/20 px-5 py-2 text-sm font-medium uppercase tracking-wider text-white transition hover:border-white/50 hover:text-white"
                >
                  Replay
                </button>
              ) : (
                <span className="text-xs uppercase tracking-[0.3rem] text-white/60">
                  Playing
                </span>
              )}
            </div>
          </div>
        </div>
        <footer className="text-xs uppercase tracking-[0.25rem] text-white/40">
          Captured in code • Inspired by Pristina&apos;s spirited streets
        </footer>
      </main>
    </div>
  );
}
