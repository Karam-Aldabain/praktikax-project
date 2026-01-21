import React, { useEffect, useState } from "react";

export default function CountUp({ value, duration = 1000, suffix = "" }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let frame = 0;
    const totalFrames = Math.max(1, Math.round(duration / 16));
    const increment = value / totalFrames;
    const timer = setInterval(() => {
      frame += 1;
      const nextValue = frame * increment;
      const isInteger = Number.isInteger(value);
      const formatted = isInteger ? Math.round(nextValue) : Number(nextValue.toFixed(1));
      setCount(Math.min(value, formatted));
      if (frame >= totalFrames) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);

  return (
    <span className="countup">
      {count}
      {suffix}
    </span>
  );
}
