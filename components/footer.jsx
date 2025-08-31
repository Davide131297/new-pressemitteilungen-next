import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-blue-500 text-white text-center py-4 mt-8">
      <p className="text-sm">© 2024 PresseFinder. Alle Rechte vorbehalten.</p>
      <div className="flex justify-center gap-4">
        <p className="text-sm text-white underline">
          <Link href="/impressum">Impressum</Link>
        </p>
        <p>|</p>
        <p className="text-sm text-white underline">
          <Link href="/datenschutz">Datenschutz</Link>
        </p>
      </div>
    </footer>
  );
}
