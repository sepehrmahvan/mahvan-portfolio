'use client';

import LanguageIcon from '@mui/icons-material/Language';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useLocale } from '@/hooks/useDirection';
import { localeLabels, locales, type Locale } from '@/types/locale';

export function LanguageSwitcher() {
  const { t } = useTranslation('common');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  function switchLocale(next: Locale) {
    const segments = pathname.split('/');
    if (segments.length > 1) {
      segments[1] = next;
    }
    const nextPath = segments.join('/') || `/${next}`;
    router.push(nextPath);
    setAnchorEl(null);
  }

  return (
    <>
      <Button
        startIcon={<LanguageIcon />}
        onClick={(event) => setAnchorEl(event.currentTarget)}
        color="inherit"
        size="small"
      >
        {localeLabels[locale]}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        slotProps={{ paper: { 'aria-label': t('language') } }}
      >
        {locales.map((item) => (
          <MenuItem
            key={item}
            selected={item === locale}
            onClick={() => switchLocale(item)}
          >
            {localeLabels[item]}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
