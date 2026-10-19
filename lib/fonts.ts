import localFont from 'next/font/local';

/** Kalameh Web — Persian UI from `public/fonts/woff`. */
export const kalameh = localFont({
  src: [
    {
      path: '../public/fonts/woff/KalamehWeb-Thin.woff',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../public/fonts/woff/KalamehWeb-ExtraLight.woff',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../public/fonts/woff/KalamehWeb-Light.woff',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/woff/KalamehWeb-Regular.woff',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/woff/KalamehWeb-Medium.woff',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/woff/KalamehWeb-SemiBold.woff',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/woff/KalamehWeb-Bold.woff',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/woff/KalamehWeb-ExtraBold.woff',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../public/fonts/woff/KalamehWeb-Black.woff',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-fa',
  display: 'swap',
});

/** Satoshi (Fontshare) — Latin UI for English. */
export const satoshi = localFont({
  src: [
    {
      path: '../public/fonts/satoshi/Satoshi-Variable.woff2',
      weight: '300 900',
      style: 'normal',
    },
  ],
  variable: '--font-en',
  display: 'swap',
});
