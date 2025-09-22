import Image from 'next/image';
import FinderLogo from '../assets/FinderIcon.png';

export default function Logo() {
  return (
    <div className="flex justify-center align-middle bg-transparent text-black w-full mt-5">
      <Image src={FinderLogo} alt="Finder Logo" className="w-15 mr-5" />
      <h1>PresseFinder</h1>
    </div>
  );
}
