// van https://bundui.io/motion

"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Dot {
  id: number;
  x: number;
  y: number;
}

interface MouseTrailProps {
  dotColor?: string;
  dotSize?: number;
  spacing?: number;
  trailLength?: number;
  fadeDuration?: number;
}

export default function MouseTrail({
  dotColor = "#ffffff",
  dotSize = 8,
  spacing = 20,
  trailLength = 20,
  fadeDuration = 1000
}: MouseTrailProps) {
  const [dots, setDots] = useState<Dot[]>([]);
  const lastPositionRef = useRef({ x: 0, y: 0 });
  const dotIdRef = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      const lastPos = lastPositionRef.current;

      // Calculate distance from last dot
      const distance = Math.sqrt(Math.pow(x - lastPos.x, 2) + Math.pow(y - lastPos.y, 2));

      // Only add dot if we've moved far enough
      if (distance >= spacing) {
        const newDot: Dot = {
          id: dotIdRef.current++,
          x,
          y
        };

        setDots((prevDots) => {
          const updatedDots = [...prevDots, newDot];
          // Keep only the most recent dots based on trail length
          return updatedDots.slice(-trailLength);
        });

        lastPositionRef.current = { x, y };

        // Remove dot after fade duration
        setTimeout(() => {
          setDots((prevDots) => prevDots.filter((d) => d.id !== newDot.id));
        }, fadeDuration);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [spacing, trailLength, fadeDuration]);

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      <AnimatePresence>
        {dots.map((dot) => (
          <motion.div
            key={dot.id}
            className="absolute rounded-full"
            initial={{
              left: dot.x - dotSize / 2,
              top: dot.y - dotSize / 2,
              opacity: 1,
              scale: 0
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            exit={{
              opacity: 0,
              scale: 0.5
            }}
            transition={{
              duration: fadeDuration / 1000,
              ease: "easeOut"
            }}
            style={{
              width: dotSize,
              height: dotSize,
              backgroundColor: dotColor
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
