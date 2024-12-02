'use client';

import Logo from '@/components/logo';
import MenuBox from '@/components/menu';
import Image from 'next/image';

export default function News() {
  return (
    <>
      <MenuBox />
      <Logo />
      <Image
        src="https://placehold.co/600x400/png"
        alt="Finder Logo"
        width={200}
        height={200}
      />
    </>
  );
}
