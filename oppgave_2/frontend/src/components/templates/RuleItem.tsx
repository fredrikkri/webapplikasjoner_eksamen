type RuleItemProps = {
  label: string;
  description: string;
  value: string | null;
};

export default function RuleItem({ label, description, value }: RuleItemProps) {
  if (label === "Tillatte dager") {
    const days = value ? value.split(',') : [];    
    {/* SRC: kilde: chatgpt.com  || Tailwind laget med gpt */}
    return (
      <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200 hover:border-indigo-300 transition-colors duration-200">
        {days.length > 0 ? (
          <div>
            <h4 className="text-sm font-semibold text-slate-900">{label}</h4>
            <p className="text-xs text-slate-500 mt-1">{description}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {days.map((day) => (
                <span
                  key={day}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"
                >
                  {day.trim()}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-sm font-semibold text-slate-900">{label}</h4>
              <p className="text-xs text-slate-500 mt-1">{description}</p>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
              Alle dager
            </span>
          </div>
        )}
      </div>
    );
  }
    {/* SRC: kilde: chatgpt.com  || Tailwind laget med gpt */}
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200 hover:border-indigo-300 transition-colors duration-200">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-sm font-semibold text-slate-900">{label}</h4>
          <p className="text-xs text-slate-500 mt-1">{description}</p>
        </div>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value === "true" ? 'bg-indigo-100 text-indigo-800' : 
          value === "false" ? 'bg-slate-100 text-slate-800' :
          value ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'
        }`}>
          {value === "true" ? "Ja" : 
           value === "false" ? "Nei" :
           value || "Alle"}
        </span>
      </div>
    </div>
  );
}
