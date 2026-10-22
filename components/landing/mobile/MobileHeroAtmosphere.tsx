'use client';

import './mobile-stage.css';

type MobileHeroAtmosphereProps = {
  /** Giant chapter watermark — hero `01`, Build `03`, etc. */
  index?: string;
};

/**
 * Mobile/tablet kinetic field — court-green stage matching hero language.
 * Parent gates mount (typically below laptop).
 */
export function MobileHeroAtmosphere({ index = '01' }: MobileHeroAtmosphereProps) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden bg-[#03140f]"
    >
      {/* Deep ink base + soft court blooms */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,#0B6E4F55_0%,transparent_55%),linear-gradient(180deg,#041a14_0%,#020807_55%,#03140f_100%)]" />

      <div className="mahvan-bloom-a absolute -top-[20%] -left-[30%] h-[70vmax] w-[70vmax] rounded-full bg-[radial-gradient(circle,#0B6E4F66_0%,transparent_68%)] blur-2xl" />
      <div className="mahvan-bloom-b absolute -right-[25%] bottom-[-10%] h-[65vmax] w-[65vmax] rounded-full bg-[radial-gradient(circle,#34d39944_0%,transparent_70%)] blur-3xl" />

      {/* Court grid — restrained, not cockpit */}
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgb(255 255 255 / 0.35) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.28) 1px, transparent 1px)',
          backgroundSize: '18vw 18vw',
          maskImage:
            'radial-gradient(ellipse 80% 70% at 50% 40%, black 20%, transparent 75%)',
        }}
      />

      {/* Slow orbital ring */}
      <svg
        className="mahvan-orbit absolute top-1/2 left-1/2 h-[min(140vw,42rem)] w-[min(140vw,42rem)] -translate-x-1/2 -translate-y-[42%] opacity-40"
        viewBox="0 0 100 100"
        fill="none"
      >
        <circle
          cx="50"
          cy="50"
          r="46"
          stroke="#0B6E4F"
          strokeWidth="0.35"
          strokeDasharray="2 3.5"
          className="mahvan-dash"
        />
        <circle
          cx="50"
          cy="50"
          r="34"
          stroke="rgb(255 255 255 / 0.2)"
          strokeWidth="0.25"
          strokeDasharray="1 4"
        />
      </svg>

      {/* Vertical scan */}
      <div className="mahvan-scan absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,transparent,rgb(11_110_79_/_0.35),transparent)]" />

      {/* Giant chapter index */}
      <p className="absolute top-[18%] right-3 font-mono text-[clamp(5.5rem,28vw,9rem)] leading-none font-black tracking-tighter text-white/[0.06] select-none">
        {index}
      </p>

      {/* Bottom vignette for copy legibility */}
      <div className="absolute inset-x-0 bottom-0 h-[48%] bg-[linear-gradient(to_top,rgb(2_8_7_/_0.92)_0%,rgb(2_8_7_/_0.55)_45%,transparent_100%)]" />
    </div>
  );
}
