"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface FormFields {
  name: string;
  email: string;
  admin: boolean;
}

function SignUp() {
  const [success, setSuccess] = useState<boolean>(false);
  const [formError, setFormError] = useState<boolean>(false);
  const [fields, setFields] = useState<FormFields>({
    name: "",
    email: "",
    admin: false,
  });
  const router = useRouter();

  const formIsValid = Object.values(fields).filter((val) => 
    typeof val === 'string' ? val.length === 0 : false
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(false);
    setSuccess(false);
    if (formIsValid.length === 0) {
      setSuccess(true);
      setTimeout(() => {
        router.push("/home");
      }, 500);
    } else {
      setFormError(true);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setFields((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 shadow-lg">
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-3xl font-bold text-slate-800" data-testid="title">
          Bli medlem
        </h2>
        <p className="text-slate-600">Opprett en konto for å få tilgang til alle kurs</p>
      </div>
      
      <form data-testid="form" onSubmit={handleSubmit} noValidate className="space-y-6">
        <div>
          <label className="mb-1.5 block font-medium text-slate-700" htmlFor="name">
            Navn<span className="text-emerald-600">*</span>
          </label>
          <input
            className="w-full rounded-lg border border-slate-200 px-4 py-2.5 transition-colors focus:border-emerald-600 focus:outline-none"
            data-testid="form_name"
            type="text"
            name="name"
            id="name"
            value={fields.name}
            onChange={handleChange}
            placeholder="Skriv ditt navn"
          />
        </div>

        <div>
          <label className="mb-1.5 block font-medium text-slate-700" htmlFor="email">
            E-post<span className="text-emerald-600">*</span>
          </label>
          <input
            className="w-full rounded-lg border border-slate-200 px-4 py-2.5 transition-colors focus:border-emerald-600 focus:outline-none"
            data-testid="form_email"
            type="email"
            name="email"
            id="email"
            value={fields.email}
            onChange={handleChange}
            placeholder="din@epost.no"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            className="h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600"
            data-testid="form_admin"
            type="checkbox"
            name="admin"
            id="admin"
            onChange={handleChange}
            checked={fields.admin}
          />
          <label className="font-medium text-slate-700" htmlFor="admin">
            Registrer som administrator
          </label>
        </div>

        <button
          className="mt-8 w-full rounded-lg bg-emerald-600 py-3 text-base font-medium text-white transition-all hover:bg-emerald-700 hover:shadow-lg disabled:opacity-50"
          data-testid="form_submit"
          type="submit"
        >
          Opprett konto
        </button>

        {formError && (
          <p className="mt-4 text-center font-medium text-red-500" data-testid="form_error">
            Fyll ut alle påkrevde felt
          </p>
        )}
        {success && (
          <p className="mt-4 text-center font-medium text-emerald-600" data-testid="form_success">
            Konto opprettet! Omdirigerer...
          </p>
        )}
      </form>
    </div>
  );
}

export default SignUp;
