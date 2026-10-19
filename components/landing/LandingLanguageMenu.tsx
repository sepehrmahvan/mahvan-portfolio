'use client';

import { CaretDownIcon } from '@phosphor-icons/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';

import { localeCodes, localeLabels, locales, type Locale } from '@/types/locale';
import { cn } from '@/utils/cn';

function pathForLocale(pathname: string, next: Locale) {
  const segments = pathname.split('/');
  if (segments.length > 1) {
    segments[1] = next;
  }
  return segments.join('/') || `/${next}`;
}

interface LandingLanguageMenuProps {
  locale: Locale;
  /** Accessible name for the trigger (e.g. “Language”). */
  label: string;
}

export function LandingLanguageMenu({ locale, label }: LandingLanguageMenuProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-9 items-center gap-1.5 border border-white/25 px-2.5 font-mono text-[11px] font-semibold tracking-[0.14em] text-white transition-colors hover:border-white hover:bg-white hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
      >
        <span dir="ltr">{localeCodes[locale]}</span>
        <CaretDownIcon
          size={12}
          weight="bold"
          className={cn('transition-transform duration-200', open && 'rotate-180')}
          aria-hidden
        />
      </button>

      {open ? (
        <ul
          id={menuId}
          role="listbox"
          aria-label={label}
          className="absolute end-0 top-[calc(100%+0.35rem)] z-50 min-w-[10.5rem] border border-white/15 bg-zinc-950/95 py-1 shadow-[0_18px_40px_-20px_rgb(0_0_0/0.7)] backdrop-blur-xl"
        >
          {locales.map((item) => {
            const selected = item === locale;
            return (
              <li key={item} role="option" aria-selected={selected}>
                <Link
                  href={pathForLocale(pathname, item)}
                  hrefLang={item}
                  lang={item}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center justify-between gap-4 px-3 py-2.5 text-[13px] transition-colors',
                    selected
                      ? 'bg-white text-zinc-950'
                      : 'text-white/90 hover:bg-white/10 hover:text-white',
                  )}
                >
                  <span>{localeLabels[item]}</span>
                  <span
                    dir="ltr"
                    className={cn(
                      'font-mono text-[10px] tracking-[0.16em]',
                      selected ? 'text-zinc-600' : 'text-white/50',
                    )}
                  >
                    {localeCodes[item]}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
