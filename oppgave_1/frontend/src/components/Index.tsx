export default function Index() {
  return (
    <div className="flex min-h-[600px] flex-col items-center justify-center text-center">
      <h1 className="mb-6 text-4xl font-bold text-slate-800">
        Velkommen til Mikro LMS
      </h1>
      <p className="max-w-2xl text-lg text-slate-600">
        Din plattform for læring og utvikling. Utforsk våre kurs og start din læringsreise i dag.
      </p>
      <div className="mt-12 flex gap-6">
        <a 
          href="/kurs" 
          className="rounded-full bg-emerald-600 px-8 py-3 text-lg font-medium text-white transition-all hover:bg-emerald-700 hover:shadow-lg"
        >
          Utforsk kurs
        </a>
        <a 
          href="/ny" 
          className="rounded-full border-2 border-emerald-600 px-8 py-3 text-lg font-medium text-emerald-600 transition-all hover:bg-emerald-50"
        >
          Lag nytt kurs
        </a>
      </div>
    </div>
  );
}
