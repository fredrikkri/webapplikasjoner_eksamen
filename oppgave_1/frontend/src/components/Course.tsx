// 📁frontend/src/components/Course.tsx

import { useCourse } from "../hooks/useCourse";
import Lesson from "./Lesson";
import { users } from "../data/data";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { deleteCourse } from "../lib/services/courses";
import { deleteLesson } from "../lib/services/lessons";
import { useState } from "react";

interface CourseProps {
  slug?: string;
}

function Course({ slug = "javascript-101" }: CourseProps) {
  const params = useParams();
  const router = useRouter();
  const lessonSlug = params?.lessonSlug as string;
  const { course, loading, error } = useCourse(slug);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteCourse = async () => {
    if (!course || !confirm("Er du sikker på at du vil slette dette kurset?")) return;
    
    try {
      setIsDeleting(true);
      await deleteCourse(course.slug);
      router.push("/kurs");
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("Kunne ikke slette kurset");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteLesson = async (lessonSlug: string) => {
    if (!course || !confirm("Er du sikker på at du vil slette denne leksjonen?")) return;
    
    try {
      await deleteLesson(course.slug, lessonSlug);
      router.refresh();
    } catch (error) {
      console.error("Error deleting lesson:", error);
      alert("Kunne ikke slette leksjonen");
    }
  };

  if (loading) return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="text-center">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"></div>
        <p className="text-lg font-medium text-slate-600">Laster innhold...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="rounded-lg border-2 border-red-100 bg-red-50 p-6 text-center">
      <p className="text-lg font-medium text-red-800">
        Noe gikk galt: {error.message}
      </p>
    </div>
  );

  if (!course) return (
    <div className="rounded-lg border-2 border-slate-100 bg-slate-50 p-6 text-center">
      <p className="text-lg font-medium text-slate-800">
        Fant ikke kurset
      </p>
    </div>
  );

  return (
    <div className="grid grid-cols-[280px_minmax(20%,1fr)_300px] gap-8">
      <aside className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">Leksjoner</h3>
          <Link
            href={`/kurs/${course.slug}/rediger`}
            className="group flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 transition-all hover:bg-emerald-100"
          >
            <svg className="h-4 w-4 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Rediger kurs
          </Link>
        </div>
        <ul data-testid="lessons" className="space-y-3">
          {course.lessons?.map((lesson, index) => (
            <li
              key={lesson.id}
              className={`group relative rounded-lg transition-all ${
                lessonSlug === lesson.slug 
                  ? "bg-emerald-100 shadow-sm" 
                  : "hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center justify-between p-2">
                <Link
                  data-testid="lesson_url"
                  data-slug={lessonSlug}
                  className={`flex flex-1 items-center gap-3 ${
                    lessonSlug === lesson.slug 
                      ? "text-emerald-900" 
                      : "text-slate-700 hover:text-emerald-600"
                  }`}
                  href={`/kurs/${course.slug}/${lesson.slug}`}
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white font-medium text-sm shadow-sm">
                    {index + 1}
                  </span>
                  <span className="font-medium">{lesson.title}</span>
                </Link>
                <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <Link
                    href={`/kurs/${course.slug}/${lesson.slug}/rediger`}
                    className="group/edit flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 transition-all hover:bg-slate-200"
                  >
                    <svg className="h-4 w-4 transition-transform group-hover/edit:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Rediger
                  </Link>
                  <button
                    onClick={() => handleDeleteLesson(lesson.slug)}
                    className="group/delete flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 transition-all hover:bg-red-100"
                  >
                    <svg className="h-4 w-4 transition-transform group-hover/delete:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Slett
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </aside>

      <main className="min-h-[600px] rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        {lessonSlug ? (
          <article>
            <Lesson courseSlug={slug} lessonSlug={lessonSlug} />
          </article>
        ) : (
          <section>
            <div className="mb-8 border-b border-slate-200 pb-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 
                  className="text-3xl font-bold text-slate-800" 
                  data-testid="course_title"
                >
                  {course.title}
                </h2>
                <div className="flex items-center gap-4">
                  <Link
                    href={`/kurs/${course.slug}/rediger`}
                    className="group flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2 font-medium text-emerald-700 transition-all hover:bg-emerald-100"
                  >
                    <svg className="h-5 w-5 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Rediger kurs
                  </Link>
                  <button
                    onClick={handleDeleteCourse}
                    disabled={isDeleting}
                    className="group flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 font-medium text-red-700 transition-all hover:bg-red-100 disabled:opacity-50"
                  >
                    <svg className="h-5 w-5 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    {isDeleting ? "Sletter..." : "Slett kurs"}
                  </button>
                </div>
              </div>
              <p
                className="text-lg leading-relaxed text-slate-600"
                data-testid="course_description"
              >
                {course.description}
              </p>
            </div>
            
            <div className="rounded-lg bg-emerald-50 p-6">
              <h3 className="mb-4 text-lg font-bold text-emerald-900">
                Kom i gang
              </h3>
              <p className="mb-6 text-emerald-800">
                Velg en leksjon fra menyen til venstre for å starte kurset.
              </p>
              {course.lessons?.[0] && (
                <Link
                  href={`/kurs/${course.slug}/${course.lessons[0].slug}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2 font-medium text-white transition-all hover:bg-emerald-700 hover:shadow-lg"
                >
                  Start første leksjon
                  <svg 
                    className="h-4 w-4" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 5l7 7-7 7" 
                    />
                  </svg>
                </Link>
              )}
            </div>
          </section>
        )}
      </main>

      <aside 
        data-testid="enrollments" 
        className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h3 className="mb-6 text-lg font-bold text-slate-800">Deltakere</h3>
        <ul data-testid="course_enrollments" className="space-y-4">
          {users?.map((user) => (
            <li 
              key={user.id}
              className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-medium text-emerald-800">
                {user.name.charAt(0)}
              </div>
              <span className="font-medium text-slate-700">{user.name}</span>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}

export default Course;
