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

  return (
  <div className='w-full'>
      <h1 className="text-3xl font-bold text-gray-800 my-6 text-center">Arrangementer</h1>
      <div className='"flex items-center gap-2"'>
        <select onChange={handleMonthChange} value={month !== null ? month : ""} title='måneder'>
          <option value="">Alle måneder</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i}>{i + 1}</option>
          ))}
        </select>
        
        <select onChange={handleYearChange} value={year !== null ? year : ""} title='år'>
          <option value="">Alle år</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={2020 + i}>{2020 + i}</option>
          ))}
        </select>
        
        <button className='ml-2' onClick={handleClearDate}>Clear</button>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <select onChange={handleCategoryChange} value={category || ""} title="kategori">
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
        <button className="ml-2" onClick={handleClearCategory}>Clear</button>
      </div>

      <ListEvents selectedMonth={month} selectedYear={year} selectedCategory={category}/>
    </div>
  );
};

export default EventsFilter;
