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
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
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
    setIsSubmitting(true);
    setFormError(false);
    setSuccess(false);
    
    if (formIsValid.length === 0) {
      setSuccess(true);
      setTimeout(() => {
        router.push("/home");
      }, 500);
    } else {
      setFormError(true);
      setIsSubmitting(false);
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
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-lg transition-transform duration-200 hover:shadow-xl">
        <div className="mb-8 text-center">
          <h2 className="mb-2 bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-3xl font-bold text-transparent" data-testid="title">
            Bli medlem
          </h2>
          <p className="text-slate-600">Opprett en konto for å få tilgang til alle kurs</p>
        </div>
        
        <form 
          data-testid="form" 
          onSubmit={handleSubmit} 
          noValidate 
          className={`space-y-6 ${formError ? 'animate-shake' : ''}`}
        >
          <div>
            <label className="mb-1.5 block font-medium text-slate-700" htmlFor="name">
              Navn<span className="text-emerald-600">*</span>
            </label>
            <input
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 shadow-sm transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-100 disabled:opacity-50"
              data-testid="form_name"
              type="text"
              name="name"
              id="name"
              value={fields.name}
              onChange={handleChange}
              placeholder="Skriv ditt navn"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="mb-1.5 block font-medium text-slate-700" htmlFor="email">
              E-post<span className="text-emerald-600">*</span>
            </label>
            <input
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 shadow-sm transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-100 disabled:opacity-50"
              data-testid="form_email"
              type="email"
              name="email"
              id="email"
              value={fields.email}
              onChange={handleChange}
              placeholder="din@epost.no"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              className="h-5 w-5 rounded border-slate-300 text-emerald-600 transition-all duration-200 hover:border-emerald-600 focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 disabled:opacity-50"
              data-testid="form_admin"
              type="checkbox"
              name="admin"
              id="admin"
              onChange={handleChange}
              checked={fields.admin}
              disabled={isSubmitting}
            />
            <label className="font-medium text-slate-700" htmlFor="admin">
              Registrer som administrator
            </label>
          </div>

          <button
            className="relative mt-8 w-full rounded-lg bg-emerald-600 py-3 text-base font-medium text-white transition-all duration-200 hover:bg-emerald-700 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-emerald-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-emerald-600 disabled:hover:shadow-none"
            data-testid="form_submit"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                <span>Oppretter konto...</span>
              </div>
            ) : (
              "Opprett konto"
            )}
          </button>

          {formError && (
            <div className="mt-4 rounded-lg bg-red-50 p-3 text-center" data-testid="form_error">
              <p className="font-medium text-red-800">
                Fyll ut alle påkrevde felt
              </p>
            </div>
          )}
          {success && (
            <div className="mt-4 rounded-lg bg-emerald-50 p-3 text-center" data-testid="form_success">
              <p className="font-medium text-emerald-800">
                Konto opprettet! Omdirigerer...
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default SignUp;
