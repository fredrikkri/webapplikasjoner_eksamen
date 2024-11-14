"use client";
import { EditCourseForm } from "../../../../components/forms/EditCourseForm";
import Link from "next/link";

export default function EditCoursePage({ params }: { params: { slug: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Rediger kurs</h1>
          <p className="mt-2 text-slate-600">
            Oppdater informasjonen om kurset her.
          </p>
        </div>
        <Link
          href={`/kurs/${params.slug}`}
          className="flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 font-medium text-slate-700 transition-all hover:bg-slate-200"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Tilbake til kurs
        </Link>
      </div>
      <EditCourseForm slug={params.slug} />
    </div>
  );
}
