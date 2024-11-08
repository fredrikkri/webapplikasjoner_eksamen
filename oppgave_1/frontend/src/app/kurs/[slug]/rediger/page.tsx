"use client";

import { EditCourseForm } from "../../../../components/forms/EditCourseForm";

export default function EditCoursePage({ params }: { params: { slug: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Rediger kurs</h1>
      <EditCourseForm slug={params.slug} />
    </div>
  );
}
