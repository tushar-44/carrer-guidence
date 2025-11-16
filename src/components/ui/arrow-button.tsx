import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { gsap } from "gsap";

interface ArrowButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export function ArrowButton({ children, onClick }: ArrowButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (buttonRef.current && arrowRef.current) {
      // Magnetic effect on hover
      const handleMouseMove = (e: MouseEvent) => {
        if (buttonRef.current && arrowRef.current) {
          const rect = buttonRef.current.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const deltaX = e.clientX - centerX;
          const deltaY = e.clientY - centerY;
          const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

          if (distance < 80 && isHovered) {
            gsap.to(arrowRef.current, {
              x: deltaX * 0.5,
              y: deltaY * 0.5,
              scale: 1.2,
              duration: 0.3,
              ease: "power2.out"
            });
          } else {
            gsap.to(arrowRef.current, {
              x: 0,
              y: 0,
              scale: 1,
              duration: 0.3,
              ease: "power2.out"
            });
          }
        }
      };

      if (isHovered) {
        window.addEventListener('mousemove', handleMouseMove);
      }

      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [isHovered]);

  return (
    <motion.button
      ref={buttonRef}
      className="relative overflow-hidden font-heading z-10 cursor-pointer text-sm pl-6 rounded-full glass-texture flex items-center justify-between"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Expanding background circle (now vertically centred & anchored right) */}
      <motion.div
        className="absolute right-1 top-1/2 -translate-y-1/2 h-[34px] rounded-full cursor-glass-effect"
        initial={{ width: 34 }}
        animate={{ width: isHovered ? 'calc(100% - 8px)' : 34 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ transformOrigin: 'right center' }}
      />

      {/* Text */}
      <motion.span
        className="relative z-10 mt-1"
        animate={{ color: "#f2f2f2" }}
        transition={{ duration: 0.4, ease: "linear" }}
      >
        {children}
      </motion.span>

      {/* Arrow chip */}
      <motion.div
        ref={arrowRef}
        className="relative z-10 rounded-full p-1 m-1"
        animate={{ x: isHovered ? -16 : 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <ArrowRight className="w-6 h-6 text-[#f2f2f2]" />
      </motion.div>
    </motion.button>
  );
}
