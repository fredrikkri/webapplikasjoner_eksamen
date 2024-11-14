"use client";

import Home from "@/components/Home";
import Course from "@/components/Course";
import { useParams } from "next/navigation";

export default function CoursePage() {
  const params = useParams();
  const slug = params?.slug as string;

  if (!slug) {
    return <div>Loading...</div>;
  }

  return (
    <Home>
      <div className="container mx-auto px-4 py-8">
        <Course slug={slug} />
      </div>
    </Home>
  );
}
