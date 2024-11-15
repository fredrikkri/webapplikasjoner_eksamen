import React, { useState } from 'react';
import Events from './Events';

// SRC: kilde: chatgpt.com
const EventsByDate = () => {
  const [month, setMonth] = useState<number | null>(null); // null betyr "Alle"
  const [year, setYear] = useState<number | null>(null); // null betyr "Alle"

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setMonth(value === "" ? null : Number(value));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setYear(value === "" ? null : Number(value));
  };

  const handleClear = () => {
    setMonth(null);
    setYear(null);
  };

  return (
    

    <div>
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
          {Array.from({ length: 10 }, (_, i) => (
            <option key={i} value={2020 + i}>{2020 + i}</option>
          ))}
        </select>
        
        <button className='ml-4' onClick={handleClear}>Clear</button>
      </div>

      <Events selectedMonth={month} selectedYear={year} />
    </div>
  );
};

export default EventsByDate;
