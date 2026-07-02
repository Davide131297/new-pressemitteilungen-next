import Image from 'next/image';
import Link from 'next/link';
import FinderLogo from '../assets/FinderIcon.png';

export default function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 text-foreground transition-opacity hover:opacity-80"
    >
      <Image src={FinderLogo} alt="" className="h-8 w-8 sm:h-9 sm:w-9" />
      <span className="text-lg font-semibold tracking-tight sm:text-xl">
        PresseFinder
      </span>
    </Link>
  );
}
