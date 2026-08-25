import React from "react";

export function KeralaMotif({ className = "w-full h-auto opacity-20" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {/* Backwater Waves Gradient */}
      <path
        d="M0 210C120 190 200 230 360 210C520 190 640 220 800 200V240H0V210Z"
        fill="currentColor"
        fillOpacity="0.3"
      />
      <path
        d="M0 225C150 210 280 235 480 220C680 205 740 230 800 220V240H0V225Z"
        fill="currentColor"
        fillOpacity="0.4"
      />

      {/* Stylized Coconut Palms Silhouettes */}
      <g opacity="0.6">
        {/* Palm 1 (Left) */}
        <path
          d="M100 220 C105 160 115 100 130 50"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* Palm Fronds 1 */}
        <path
          d="M130 50 C100 30 70 40 50 65 M130 50 C120 20 95 10 70 25 M130 50 C145 15 170 15 185 30 M130 50 C160 30 190 45 200 70 M130 50 C140 70 160 85 180 90 M130 50 C115 65 95 80 80 90"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Palm 2 (Right) */}
        <path
          d="M720 220 C715 155 700 90 680 40"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* Palm Fronds 2 */}
        <path
          d="M680 40 C650 20 620 30 600 55 M680 40 C670 10 645 5 620 15 M680 40 C695 10 720 10 740 25 M680 40 C710 20 740 35 750 60 M680 40 C690 60 710 75 730 80 M680 40 C665 55 645 70 630 80"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>

      {/* Stylized Banana Leaf Accent */}
      <g opacity="0.45">
        <path
          d="M240 180 C280 120 340 100 400 90"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M260 165 C300 130 350 115 400 90 C360 110 320 140 290 180 Z"
          fill="currentColor"
        />
      </g>
    </svg>
  );
}
