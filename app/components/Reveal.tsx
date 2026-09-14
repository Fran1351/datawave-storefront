"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
};

export default function Reveal({
  children,
  className = "",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.15,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`
        transition-all
        duration-1000
        ease-out
        ${
          visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-12"
        }
        ${className}
      `}
    >
      {children}
    </div>
  );
}