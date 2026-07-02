import MenuBox from './menu';
import Logo from './logo';
import { ThemeToggle } from './theme-toggle';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Logo />
          <ThemeToggle />
        </div>
        <MenuBox />
      </div>
    </header>
  );
}
