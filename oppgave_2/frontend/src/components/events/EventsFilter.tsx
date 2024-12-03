import React, { useState } from 'react';
import ListEvents from './ListEvents';

// SRC: kilde: chatgpt.com
const EventsFilter = () => {
  const [month, setMonth] = useState<number | null>(null);
  const [year, setYear] = useState<number | null>(null);
  const [category, setCategory] = useState<string | null>(null);

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setMonth(value === "" ? null : Number(value));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setYear(value === "" ? null : Number(value));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCategory(value === "" ? null : value);
  };

  const handleClearDate = () => {
    setMonth(null);
    setYear(null);
  };
  const handleClearCategory = () => {
    setCategory(null);
  };

  const selectClasses = "appearance-none px-4 pr-10 py-2 bg-white border border-slate-300 rounded-lg text-sm shadow-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all duration-200 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_0.5rem_center] bg-no-repeat";
  const buttonClasses = "inline-flex items-center px-3 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 transition-all duration-200";

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-teal-900 mb-2">Arrangementer</h1>
        <p className="text-teal-600">Filtrer arrangementer etter dato og kategori</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 space-y-6">
        {/*   // SRC: kilde: chatgpt.com  || med endringer / */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Datofilter</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <select 
              onChange={handleMonthChange} 
              value={month !== null ? month : ""} 
              title='måneder'
              className={selectClasses}
            >
              <option value="">Alle måneder</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>{i + 1}</option>
              ))}
            </select>
            
            <select 
              onChange={handleYearChange} 
              value={year !== null ? year : ""} 
              title='år'
              className={selectClasses}
            >
              <option value="">Alle år</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={2020 + i}>{2020 + i}</option>
              ))}
            </select>
            
            <button 
              onClick={handleClearDate}
              className={buttonClasses}
              title="Nullstill datofilter"
            >
              Nullstill dato
            </button>
          </div>
        </div>

        {/*   // SRC: kilde: chatgpt.com  || med endringer / */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Kategorifilter</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <select 
              onChange={handleCategoryChange} 
              value={category || ""} 
              title="kategori"
              className={selectClasses}
            >
              <option value="">Ingen kategori</option>
              <option value="Seminar">Seminar</option>
              <option value="Webinar">Webinar</option>
              <option value="Kurs">Kurs</option>
              <option value="Konsert">Konsert</option>
              <option value="Opplæring">Opplæring</option>
              <option value="Presentasjon">Presentasjon</option>
              <option value="Forelesning">Forelesning</option>
              <option value="Kunngjøring">Kunngjøring</option>
            </select>
            <button 
              onClick={handleClearCategory}
              className={buttonClasses}
              title="Nullstill kategorifilter"
            >
              Nullstill kategori
            </button>
          </div>
        </div>
      </div>

      <ListEvents selectedMonth={month} selectedYear={year} selectedCategory={category}/>
    </div>
  );
};

export default EventsFilter;
