import MenuBox from './menu';
import Logo from './logo';

export default function Header() {
  return (
    <div className="sticky top-0 z-50 bg-white pb-5">
      <div className="pt-5">
        <MenuBox />
        <Logo />
      </div>
    </div>
  );
}
