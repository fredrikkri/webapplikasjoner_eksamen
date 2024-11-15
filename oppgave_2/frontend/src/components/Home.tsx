"use client";

import { ReactNode } from "react";

interface HomeProps {
  children: ReactNode;
}

export default function Home({ children }: HomeProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="mx-auto grid min-h-screen w-full grid-rows-[auto_minmax(900px,_1fr)_auto] px-4 sm:px-6 lg:px-8">
        <nav className="sticky top-0 z-50 py-6 backdrop-blur-sm bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 shadow-lg w-screen left-0 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold uppercase tracking-wider text-white transition-colors hover:text-slate-200" data-testid="logo">
              <a href="/events" className="flex items-center gap-2">
                <span className="text-3xl">🥷🏻</span>
                Booking Arena
              </a>
            </h1>
            <ul className="flex gap-8" data-testid="nav">
            <li data-testid="nav_events">
                <a 
                  href="/events" 
                  className="text-black rounded-full bg-gray-200 py-2 px-6 font-bold text-sky-900 transition-all hover:bg-gray-300 hover:shadow-lg"
                >
                  Arrangementer
                </a>
              </li>
              <li data-testid="nav_templates">
                <a 
                  href="/templates" 
                  className="text-black rounded-full bg-gray-200 py-2 px-6 font-bold text-sky-900 transition-all hover:bg-gray-300 hover:shadow-lg"
                >
                  Mal
                </a>
              </li>
              <li data-testid="nav_new">
                <a 
                  href="/opprett" 
                  className="rounded-full bg-teal-400 px-6 py-2 text-black font-medium transition-all hover:bg-teal-500 hover:shadow-lg"
                >
                  Opprett arangement
                </a>
              </li>
            </ul>
          </div>
        </nav>
        <main className="py-8">
          {children}
        </main>
        <footer className="border-t border-slate-200 py-6 bg-gradient-to-r from-blue-500 via-teal-500 to-emerald-500 text-white shadow-inner w-screen left-0 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 text-sm sm:flex-row sm:items-center max-w-7xl mx-auto">
            <p className="font-medium">BOOKING ARENA, 2024</p>
            <div className="flex items-center gap-4">
              <a href="tel:99000000" className="hover:text-slate-200 transition-colors">99 00 00 00</a>
              <span>•</span>
              <a href="mailto:mail@lms.no" className="hover:text-slate-200 transition-colors">bookingarena@arena.no</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}


