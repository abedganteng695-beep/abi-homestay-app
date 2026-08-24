"use client";

import { useEffect, useState } from "react";

interface AnimatedCounterProps {
  target: number;
  duration?: number;
  formatCurrency?: boolean;
  className?: string;
}

// helper --------------------------------------------------------------------------
// function AnimatedCounter untuk animasi angka bertambah secara halus
// input param : target (number), duration (number optional), formatCurrency (boolean optional)
// output : React component JSX yang menampilkan angka ter-animasi
// end of helper ------------------------------------------------------------------
export default function AnimatedCounter({
  target,
  duration = 1200,
  formatCurrency = false,
  className = "",
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * target));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };
    window.requestAnimationFrame(step);
  }, [target, duration]);

  const formatted = formatCurrency
    ? count.toLocaleString("id-ID")
    : count.toString();

  return <span className={className}>{formatted}</span>;
}
