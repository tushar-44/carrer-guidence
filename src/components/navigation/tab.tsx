import { useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { TabProps } from "./types";

export const Tab = ({ children, setPosition, href, isActive }: TabProps) => {
  const ref = useRef<HTMLLIElement>(null);

  // For multi-page navigation, use React Router Link
  const isRouteLink = href.startsWith('/');

  return (
    <motion.li
      ref={ref}
      onMouseEnter={() => {
        if (!ref?.current) return;

        const { width } = ref.current.getBoundingClientRect();

        setPosition({
          left: ref.current.offsetLeft,
          width,
          opacity: 1,
        });
      }}
      className="relative z-10 rounded-full"
      animate={{
        backgroundColor: isActive ? "rgba(0, 0, 0, 0.05)" : "rgba(0, 0, 0, 0)"
      }}
      transition={{
        type: "spring",
        stiffness: 350,
        damping: 25,
      }}
    >
      {isRouteLink ? (
        <Link
          to={href}
          className="relative z-10 block cursor-pointer px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 whitespace-nowrap transition-colors"
        >
          <span className="flex items-center gap-2">
            {children}
          </span>
        </Link>
      ) : (
        <a
          href={href}
          className="relative z-10 block cursor-pointer px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 whitespace-nowrap transition-colors"
        >
          <span className="flex items-center gap-2">
            {children}
          </span>
        </a>
      )}
    </motion.li>
  );
};
