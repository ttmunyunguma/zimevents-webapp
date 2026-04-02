import Link from 'next/link';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const display = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata = {
  title: 'Zim Events - Discover Events for Zimbabweans in the UK',
  description: 'Find and explore upcoming events for Zimbabweans in the UK. From concerts to conferences, discover what\'s happening in the Zimbabwean community.',
  keywords: 'Zimbabwean events UK, Zimbabwe diaspora events, Zimbabwean community UK, community events, concerts, conferences',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${display.variable}`}>
      <body
        className={`${inter.className} min-h-screen bg-gradient-to-b from-slate-50 via-white to-indigo-50/30 antialiased text-slate-900`}
      >
        <Header />
        <main className="relative">{children}</main>
        <footer className="mt-20 border-t border-slate-200/80 bg-gradient-to-b from-slate-900 to-slate-950 text-slate-300">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-12">
              <div>
                <h3 className="mb-3 text-lg font-semibold tracking-tight text-white">Zim Events</h3>
                <p className="text-sm leading-relaxed text-slate-400">
                  Your go-to platform for discovering events for Zimbabweans in the UK.
                </p>
              </div>
              <div>
                <h3 className="mb-3 text-lg font-semibold tracking-tight text-white">Quick links</h3>
                <ul className="space-y-2.5 text-sm">
                  <li>
                    <Link
                      href="/"
                      className="text-slate-400 transition-colors hover:text-white"
                    >
                      Browse events
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/submit"
                      className="text-slate-400 transition-colors hover:text-white"
                    >
                      Submit an event
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="mb-3 text-lg font-semibold tracking-tight text-white">About</h3>
                <p className="text-sm leading-relaxed text-slate-400">
                  Stay connected with the Zimbabwean community in the UK.
                </p>
              </div>
            </div>
            <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-slate-500">
              <p>&copy; {new Date().getFullYear()} Zim Events. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

// Made with Bob
