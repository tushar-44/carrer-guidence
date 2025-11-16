import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export function useSkillRowAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const rows = Array.from(
      containerRef.current.querySelectorAll<HTMLDivElement>(".skill-row")
    );

    const init = () => {
      rows.forEach((row, index) => {
        gsap.killTweensOf(row);

        const singleWidth = row.scrollWidth / 2; // because I render [...row, ...row]
        const dir = index === 1 ? 1 : -1;
        const wrap = gsap.utils.wrap(-singleWidth, 0); // keep x in [-singleWidth, 0)

        gsap.set(row, { x: 0, willChange: "transform", force3D: true });

        gsap.to(row, {
          x: dir * -singleWidth,
          duration: 70,
          ease: "none",
          repeat: -1,
          modifiers: {
            x: (v) => `${wrap(parseFloat(v))}px`,
          },
        });
      });
    };

    init();

    const ro = new ResizeObserver(() => init());
    ro.observe(containerRef.current);

    return () => {
      ro.disconnect();
      rows.forEach((row) => gsap.killTweensOf(row));
    };
  }, { scope: containerRef });

  return containerRef;
}