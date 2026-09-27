import { useMemo } from "react";

// Background layer: floating suit icons + slow falling hearts, stacked behind the card
const fallingHeartColors = ["#c98b8b", "#b08d57", "#e9dfc8", "#7c1f2b", "#e2b8b8"];

function useFallingHearts(count = 18) {
  return useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 96 + 2, // % across width, random start position
        color: fallingHeartColors[Math.floor(Math.random() * fallingHeartColors.length)],
        size: 10 + Math.random() * 16,
        duration: 12 + Math.random() * 10, // slow, varied speed
        delay: Math.random() * 14,
        drift: (Math.random() - 0.5) * 60,
      })),
    [count]
  );
}


export default function BackgroundHeartsLayer() {
  const fallingHearts = useFallingHearts(1000);

  return (
    <div
      className="background-hearts-layer"
    >
      {fallingHearts.map((h) => (
        <div
          key={`fall-${h.id}`}
          className="falling-heart"
          style={{
            left: `${h.left}%`,
            fontSize: h.size,
            color: h.color,
            "--drift": `${h.drift}px`,
            "--fall-duration": `${h.duration}s`,
            "--fall-delay": `${h.delay}s`,
          }}
        >
          &#10084;
        </div>
      ))}

      {/* {floatPositions.map((p, i) => (
        <div
          key={`float-${i}`}
          style={{
            position: "absolute",
            fontSize: 16 + (i % 3) * 8,
            opacity: 0.35,
            color: "#c98b8b",
            animation: `drift 9s ease-in-out ${i * 0.7}s infinite`,
            ...p,
          }}
        >
          {heartSymbols[i % heartSymbols.length]}
        </div>
      ))} */}
    </div>
  );
}