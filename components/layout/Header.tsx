'use client';

import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import { useUiStore } from '@/store/ui.store';

export function Header() {
  const { t } = useTranslation('common');
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      className="border-b border-slate-200 bg-white/90 backdrop-blur"
    >
      <Toolbar className="gap-2">
        <IconButton
          edge="start"
          onClick={toggleSidebar}
          aria-label="toggle sidebar"
          className="md:hidden"
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" className="flex-1 font-semibold text-slate-900">
          {t('appName')}
        </Typography>
        <LanguageSwitcher />
      </Toolbar>
    </AppBar>
  );
}
