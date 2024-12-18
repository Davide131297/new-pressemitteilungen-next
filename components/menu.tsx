import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import { useRouter, usePathname } from 'next/navigation';
import { useMediaQuery } from '@mui/material';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  borderRadius: '30px',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
  '&.active': {
    backgroundColor: '#dce1e6', // Dunklere Farbe für aktives Menü
    color: '#000', // Schwarzer Text
  },
}));

export default function MenuBox() {
  const router = useRouter();
  const currentPath = usePathname();
  const isMobile = useMediaQuery('(max-width:600px)');

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <Box
      sx={{
        mt: '20px',
        mb: '20px',
        width: isMobile ? '80%' : '50%',
        mx: 'auto',
        borderRadius: '30px',
        backgroundColor: '#f8f9fa',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        padding: '10px',
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Item
            className={clsx({ active: currentPath === '/' })}
            onClick={() => handleNavigation('/')}
          >
            Home
          </Item>
        </Grid>
        <Grid item xs={6}>
          <Item
            className={clsx({ active: currentPath === '/news' })}
            onClick={() => handleNavigation('/news')}
          >
            News
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}
