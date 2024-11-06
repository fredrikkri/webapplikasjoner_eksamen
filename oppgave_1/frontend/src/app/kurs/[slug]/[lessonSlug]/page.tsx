"use client";

import Course from "@/components/Course";
import { useParams } from "next/navigation";

export default function LessonPage() {
  const params = useParams();
  const slug = params?.slug as string;

  if (!slug) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Course slug={slug} />
    </div>
  );
}
