import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import type { CursorProps } from "./types";

export const Cursor = ({ position }: CursorProps) => {
  const cursorRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (cursorRef.current) {
      // Add magnetic effect on hover
      const handleMouseMove = (e: MouseEvent) => {
        if (cursorRef.current) {
          const rect = cursorRef.current.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const deltaX = e.clientX - centerX;
          const deltaY = e.clientY - centerY;
          const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

          if (distance < 100) {
            gsap.to(cursorRef.current, {
              x: deltaX * 0.3,
              y: deltaY * 0.3,
              scale: 1.1,
              duration: 0.3,
              ease: "power2.out"
            });
          } else {
            gsap.to(cursorRef.current, {
              x: 0,
              y: 0,
              scale: 1,
              duration: 0.3,
              ease: "power2.out"
            });
          }
        }
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  return (
    <motion.li
      ref={cursorRef}
      initial={false}
      animate={{
        ...position,
      }}
      transition={{
        type: "spring",
        stiffness: 350,
        damping: 25,
      }}
      className="absolute z-0 h-[calc(100%-16px)] rounded-full bg-gray-100/80 shadow-sm"
    />
  );
};
