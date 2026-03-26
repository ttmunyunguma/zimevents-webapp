import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Zim Events - Discover Events for Zimbabweans in the UK',
  description: 'Find and explore upcoming events for Zimbabweans in the UK. From concerts to conferences, discover what\'s happening in the Zimbabwean community.',
  keywords: 'Zimbabwean events UK, Zimbabwe diaspora events, Zimbabwean community UK, community events, concerts, conferences',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main>{children}</main>
        <footer className="bg-gray-900 text-white mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Zim Events</h3>
                <p className="text-gray-400 text-sm">
                  Your go-to platform for discovering events for Zimbabweans in the UK.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="/" className="text-gray-400 hover:text-white transition-colors">
                      Browse Events
                    </a>
                  </li>
                  <li>
                    <a href="/submit" className="text-gray-400 hover:text-white transition-colors">
                      Submit Event
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">About</h3>
                <p className="text-gray-400 text-sm">
                  Zim Events helps you stay connected with the Zimbabwean community in the UK.
                </p>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
              <p>&copy; {new Date().getFullYear()} Zim Events. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

// Made with Bob
