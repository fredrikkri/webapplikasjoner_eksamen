"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";

interface HomeProps {
  children: ReactNode;
}

export default function Home({ children }: HomeProps) {
  const pathname = usePathname();

  {/* SRC: kilde: chatgpt.com */}
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="mx-auto grid min-h-screen w-full grid-rows-[auto_minmax(900px,_1fr)_auto] px-4 sm:px-6 lg:px-8">
        <nav className="sticky top-0 z-50 backdrop-blur-sm bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 shadow-xl w-screen left-0 -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <h1 className="relative group" data-testid="logo">
                <a href="/events" className="flex items-center gap-3 group">
                  <span className="text-4xl transform group-hover:scale-110 transition-transform duration-200">🥷🏻</span>
                  <span className="text-2xl font-bold uppercase tracking-wider text-white group-hover:text-slate-100 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-white after:transition-all group-hover:after:w-full">
                    Booking Arena
                  </span>
                </a>
              </h1>

              <ul className="flex items-center gap-6" data-testid="nav">
                <li data-testid="nav_events">
                  <a 
                    href="/events" 
                    className={`relative px-6 py-2.5 rounded-full font-bold transition-all duration-200 overflow-hidden group ${
                      pathname.startsWith('/events')
                      ? 'bg-white text-teal-600 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                      : 'text-white hover:bg-white/10'
                    }`}
                  >
                    <span className="relative z-10">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Arrangementer
                    </span>
                  </a>
                </li>
                <li data-testid="nav_templates">
                  <a 
                    href="/templates" 
                    className={`relative px-6 py-2.5 rounded-full font-bold transition-all duration-200 overflow-hidden group ${
                      pathname.startsWith('/templates')
                      ? 'bg-white text-teal-600 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                      : 'text-white hover:bg-white/10'
                    }`}
                  >
                    <span className="relative z-10">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                      </svg>
                      Mal
                    </span>
                  </a>
                </li>
                <li data-testid="nav_new">
                  <a 
                    href="/opprett" 
                    className={`relative px-6 py-2.5 rounded-full font-bold transition-all duration-200 overflow-hidden group ${
                      pathname.startsWith('/opprett')
                      ? 'bg-white text-teal-600 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                      : 'text-white hover:bg-white/10'
                    }`}
                  >
                    <span className="relative z-10">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Opprett arrangement
                    </span>
                  </a>
                </li>
                <li data-testid="nav_statistics">
                  <a 
                    href="/statistikk" 
                    className={`relative px-6 py-2.5 rounded-full font-bold transition-all duration-200 overflow-hidden group ${
                      pathname.startsWith('/statistikk')
                      ? 'bg-white text-teal-600 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                      : 'text-white hover:bg-white/10'
                    }`}
                  >
                    <span className="relative z-10">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Statistikk
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <main className="py-8">
          {children}
        </main>

        <footer className="relative border-t border-slate-200 py-8 bg-gradient-to-r from-blue-500 via-teal-500 to-emerald-500 text-white shadow-inner w-screen left-0 -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🥷🏻</span>
                <p className="font-medium text-lg">BOOKING ARENA, 2024</p>
              </div>
              <div className="flex items-center gap-6">
                <a 
                  href="tel:99000000" 
                  className="flex items-center gap-2 hover:text-slate-200 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  99 00 00 00
                </a>
                <span className="w-1.5 h-1.5 rounded-full bg-white/50"></span>
                <a 
                  href="mailto:bookingarena@arena.no" 
                  className="flex items-center gap-2 hover:text-slate-200 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  bookingarena@arena.no
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
