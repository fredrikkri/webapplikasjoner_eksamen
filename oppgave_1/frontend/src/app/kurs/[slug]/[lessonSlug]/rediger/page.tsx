"use client";
import { EditLessonForm } from "../../../../../components/forms/EditLessonForm";

export default function EditLessonPage({ params }: { params: { slug: string; lessonSlug: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Rediger leksjon</h1>
      <EditLessonForm courseSlug={params.slug} lessonSlug={params.lessonSlug} />
    </div>
  );
}
