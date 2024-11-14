"use client";
import { EditLessonForm } from "../../../../../components/forms/EditLessonForm";
import Link from "next/link";

export default function EditLessonPage({ params }: { params: { slug: string; lessonSlug: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Rediger leksjon</h1>
          <p className="mt-2 text-slate-600">
            Oppdater innholdet i leksjonen her.
          </p>
        </div>
        <Link
          href={`/kurs/${params.slug}/${params.lessonSlug}`}
          className="flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 font-medium text-slate-700 transition-all hover:bg-slate-200"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Tilbake til leksjon
        </Link>
      </div>
      <EditLessonForm courseSlug={params.slug} lessonSlug={params.lessonSlug} />
    </div>
  );
}
