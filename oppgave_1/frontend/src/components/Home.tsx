"use client";

import { ReactNode } from "react";
import { ROUTES } from "../config/config";

interface HomeProps {
  children: ReactNode;
}

export default function Home({ children }: HomeProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl grid-rows-[auto_minmax(900px,_1fr)_auto] px-4 sm:px-6 lg:px-8">
        <nav className="sticky top-0 z-50 py-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold uppercase tracking-wider text-emerald-600 transition-colors hover:text-emerald-700" data-testid="logo">
              <a href={ROUTES.home} className="flex items-center gap-2">
                <span className="text-3xl">📚</span>
                Mikro LMS
              </a>
            </h1>
            <ul className="flex gap-8" data-testid="nav">
              <li data-testid="nav_courses">
                <a 
                  href={ROUTES.courses}
                  className="text-base font-medium text-slate-600 transition-all duration-200 hover:text-emerald-600 hover:underline hover:underline-offset-4 active:text-emerald-800 active:scale-95"
                >
                  Kurs
                </a>
              </li>
              <li data-testid="nav_new">
                <a 
                  href={ROUTES.new}
                  className="rounded-full bg-emerald-600 px-6 py-2 text-base font-medium text-white transition-all duration-200 hover:bg-emerald-700 hover:shadow-lg active:bg-emerald-800 active:shadow-sm active:translate-y-0.5"
                >
                  Nytt kurs
                </a>
              </li>
            </ul>
          </div>
        </nav>
        <main className="py-8">
          {children}
        </main>
        <footer className="border-t border-slate-200 py-6" data-testid="footer">
          <div className="flex flex-col justify-between gap-4 text-sm text-slate-600 sm:flex-row sm:items-center">
            <p className="font-medium">Mikro LMS AS, 2024</p>
            <div className="flex items-center gap-4">
              <a href="tel:99000000" className="hover:text-emerald-600">99 00 00 00</a>
              <span>•</span>
              <a href="mailto:mail@lms.no" className="hover:text-emerald-600">mail@lms.no</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
