'use client';

import './mobile-stage.css';

/**
 * Mobile-only Ship stage when video is off — ink field with live green pulse.
 */
export function MobileShipAtmosphere() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden bg-[#05080a]"
    >
      <div className="absolute inset-0 bg-[linear-gradient(165deg,#071812_0%,#05080a_42%,#0a1210_100%)]" />

      <div className="mahvan-bloom-a absolute top-[-15%] left-[-20%] h-[55vmax] w-[55vmax] rounded-full bg-[radial-gradient(circle,#0B6E4F50_0%,transparent_68%)] blur-2xl" />
      <div className="mahvan-bloom-b absolute right-[-30%] bottom-[5%] h-[50vmax] w-[50vmax] rounded-full bg-[radial-gradient(circle,#10b98133_0%,transparent_70%)] blur-3xl" />

      {/* Diagonal court slash */}
      <div className="absolute inset-0 opacity-30 mix-blend-screen">
        <div className="absolute top-0 left-[-20%] h-full w-[55%] rotate-[-18deg] bg-[linear-gradient(90deg,transparent_0%,rgb(11_110_79_/_0.25)_48%,transparent_100%)]" />
      </div>

      {/* Live pulse behind the gallery band */}
      <div className="absolute top-[58%] left-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2">
        <span className="mahvan-pulse-ring absolute inset-0 rounded-full border border-emerald-400/50" />
        <span
          className="mahvan-pulse-ring absolute inset-0 rounded-full border border-emerald-400/35"
          style={{ animationDelay: '0.8s' }}
        />
        <span className="absolute inset-[28%] rounded-full bg-emerald-500/25 blur-md" />
      </div>

      <p className="absolute top-[14%] left-3 font-mono text-[clamp(4.5rem,24vw,7.5rem)] leading-none font-black tracking-tighter text-white/[0.05] select-none">
        04
      </p>

      <div className="absolute inset-x-0 top-0 h-32 bg-[linear-gradient(to_bottom,rgb(5_8_10_/_0.85),transparent)]" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(to_top,rgb(5_8_10_/_0.9),transparent)]" />
    </div>
  );
}
