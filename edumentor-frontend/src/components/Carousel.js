import React, { useEffect, useState } from "react";

export default function Carousel({ items, autoPlay = true, interval = 4000 }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!autoPlay || items.length <= 1) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % items.length);
    }, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, items.length]);

  return (
    <div className="carousel-shell">
      <div className="carousel-track" style={{ transform: `translateX(-${active * 100}%)` }}>
        {items.map((item, index) => (
          <div className="carousel-item" key={index}>
            <div className="carousel-card">{item}</div>
          </div>
        ))}
      </div>
      <div className="carousel-dots">
        {items.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`carousel-dot ${index === active ? "active" : ""}`}
            onClick={() => setActive(index)}
            aria-label={`Show slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
