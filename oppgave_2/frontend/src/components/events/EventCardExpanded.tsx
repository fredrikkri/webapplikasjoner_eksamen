import Link from "next/link";

type EventCardProps = {
  title: string;
  description: string;
  date: Date;
  location: string;
  slug: string;
  event_type: string;
  total_slots: number;
  available_slots: number;
  price: number;
};

export default function EventCardExpanded({title, description, slug, date, location, event_type, total_slots, available_slots, price,}: EventCardProps) {


  const { addRegistration, loading, error } = useCreateRegistration();

  const [registrations, setRegistrations] = useState<RegistrationType[]>([
    { id: crypto.randomUUID(), event_id: slug, email: "", has_paid: "false", registration_date: "" },
  ]);

  // SRC: kilde: chatgpt.com
  const handleAddEmailField = () => {
    setRegistrations([
      ...registrations,
      { id: crypto.randomUUID(), event_id: slug, email: "", has_paid: "false", registration_date: "" },
    ]);
  };

  // SRC: kilde: chatgpt.com
  const handleRemoveEmailField = (index: number) => {
    const updatedRegistrations = registrations.filter((_, i) => i !== index);
    setRegistrations(updatedRegistrations);
  };

  // SRC: kilde: chatgpt.com / med endringer
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, value, checked } = e.target;
    const updatedRegistrations = [...registrations];

    if (name === "email") {
      updatedRegistrations[index].email = value;
    } else if (name === "has_paid") {
      updatedRegistrations[index].has_paid = checked ? "true" : "false";
    }

    setRegistrations(updatedRegistrations);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const registrationData = registrations.map(({ id, email, has_paid, event_id, registration_date }) => ({
      id,
      event_id,
      email,
      has_paid,
      registration_date,
    }));
    try {
      for (const registration of registrationData) {
        await addRegistration(registration);
      }

    } catch (error) {
      console.error("error, could not create registration:", error);
      alert(`Det oppsto en feil, kunne ikke gjennomføre registrering.`);
    } 
  }

  return (
    <div className="p-2.5 my-6 rounded-xl">
      <h2 className="text-2xl font-bold text-gray-800 my-3">{title}</h2>
      <p>{description}</p>
      <p>
        <strong>Dato:</strong>{" "}
        {new Date(date).toLocaleDateString("no-NO", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
      <p>
        <strong>Lokasjon:</strong> {location}
      </p>
      <p>
        <strong>Kategori:</strong> {event_type}
      </p>
      <p>
        <strong>Antall plasser:</strong> {total_slots}
      </p>
      <p>
        <strong>Ledige plasser:</strong> {available_slots}
      </p>
      <p>
        <strong>Pris:</strong> {price}
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {registrations.map((registration, index) => (
          <div key={registration.id} className="flex flex-col space-y-2">
            <input
              type="email"
              name="email"
              value={registration.email}
              onChange={(e) => handleChange(e, index)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              placeholder="E-postadresse"
              required
            />
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="has_paid"
                checked={registration.has_paid === "true"}
                onChange={(e) => handleChange(e, index)}
                className="h-4 w-4"
              />
              <label htmlFor={`has_paid-${index}`} className="text-sm">
                Betalt?
              </label>
            </div>
            {registrations.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveEmailField(index)}
                className="bg-red-500 text-white px-2 py-1 rounded-md"
              >
                Fjern
              </button>
            )}
          </div>
        ))}

        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleAddEmailField}
            className="bg-gray-300 text-white py-2 px-4 rounded-md"
          >
            Legg til flere personer
          </button>
          <button
            type="submit"
            className="bg-emerald-600 text-white py-2 px-4 rounded-md"
          >
            Registrer person(er)
          </button>
        </div>
      </form>
    </div>
  );
}
