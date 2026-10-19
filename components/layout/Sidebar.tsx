'use client';

import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import { routes } from '@/constants/routes';
import { useLocale } from '@/hooks/useDirection';
import { useUiStore } from '@/store/ui.store';
import { cn } from '@/utils/cn';

const drawerWidth = 240;

export function Sidebar() {
  const { t } = useTranslation('common');
  const locale = useLocale();
  const pathname = usePathname();
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);
  const setSidebarOpen = useUiStore((s) => s.setSidebarOpen);

  const items = [
    {
      href: routes.users(locale),
      label: t('users'),
      icon: <PeopleOutlinedIcon />,
    },
  ];

  const content = (
    <List className="pt-4">
      {items.map((item) => {
        const active = pathname.startsWith(item.href);
        return (
          <ListItemButton
            key={item.href}
            component={Link}
            href={item.href}
            selected={active}
            onClick={() => setSidebarOpen(false)}
            className={cn(active && 'bg-teal-50')}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        );
      })}
    </List>
  );

  return (
    <>
      <Drawer
        variant="temporary"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: drawerWidth },
        }}
      >
        {content}
      </Drawer>
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: 'none', md: 'block' },
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            position: 'relative',
            border: 0,
            borderInlineEnd: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        {content}
      </Drawer>
    </>
  );
}
