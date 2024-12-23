import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-blue-500 text-white text-center py-4 mt-8">
      <p className="text-sm">© 2024 PresseFinder. Alle Rechte vorbehalten.</p>
      <div className="flex justify-center gap-4">
        <p className="text-sm">
          <Link href="/impressum" legacyBehavior>
            <a className="text-white underline">Impressum</a>
          </Link>
        </p>
        <p>|</p>
        <p className="text-sm">
          <Link href="/datenschutz" legacyBehavior>
            <a className="text-white underline">Datenschutz</a>
          </Link>
        </p>
      </div>
    </footer>
  );
}
