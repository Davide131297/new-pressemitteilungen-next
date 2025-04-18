import { Box } from '@mui/material';
import Image from 'next/image';
import FinderLogo from '../assets/FinderIcon.png';

export default function Logo() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        color: 'black',
        width: '100%',
        marginTop: '20px',
      }}
    >
      <Image src={FinderLogo} alt="Finder Logo" className="w-15 mr-5" />
      <h1>PresseFinder</h1>
    </Box>
  );
}
