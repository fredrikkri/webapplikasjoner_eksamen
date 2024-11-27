// 📁frontend/src/components/Course.tsx

import { useCourse } from "../hooks/useCourse";
import Lesson from "./Lesson";
import { users } from "../data/data";
import Link from "next/link";
import { useParams, useRouter, usePathname } from "next/navigation";
import { deleteCourse } from "../lib/services/courses";
import { useState } from "react";

interface CourseProps {
  slug?: string;
}

function Course({ slug = "javascript-101" }: CourseProps) {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const lessonSlug = params?.lessonSlug as string;
  const { course, loading, error } = useCourse(slug);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showEditButtons, setShowEditButtons] = useState(false);

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

  if (loading) return (
    <div className="flex min-h-[400px] animate-fade-in items-center justify-center">
      <div className="text-center">
        <div className="relative mb-4 h-12 w-12">
          <div className="absolute h-12 w-12 animate-ping rounded-full border-4 border-emerald-200 opacity-75"></div>
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"></div>
        </div>
        <p className="text-lg font-medium text-slate-600">Laster innhold...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="animate-fade-in rounded-lg border-2 border-red-100 bg-red-50 p-6 text-center">
      <p className="text-lg font-medium text-red-800">
        Noe gikk galt: {error.message}
      </p>
    </div>
  );

  if (!course) return (
    <div className="animate-fade-in rounded-lg border-2 border-slate-100 bg-slate-50 p-6 text-center">
      <p className="text-lg font-medium text-slate-800">
        Fant ikke kurset
      </p>
    </div>
  );

  const selectedLesson = course.lessons?.find(lesson => lesson.slug === lessonSlug);
  const isLessonPage = pathname?.includes(`/kurs/${course.slug}/`) && pathname !== `/kurs/${course.slug}/rediger` && selectedLesson;

  return (
    <div className="animate-fade-in grid grid-cols-[280px_minmax(20%,1fr)_300px] gap-8">
      <div className="relative">
        <aside className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-800">Leksjoner</h3>
          </div>
          <ul data-testid="lessons" className="space-y-3">
            {course.lessons?.map((lesson, index) => (
              <li
                key={lesson.id}
                className={`group relative overflow-hidden rounded-lg transition-all duration-200 ${
                  lessonSlug === lesson.slug 
                    ? "bg-emerald-100 shadow-sm" 
                    : "hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between p-2">
                  <Link
                    data-testid="lesson_url"
                    data-slug={lessonSlug}
                    className={`flex flex-1 items-center gap-3 transition-colors duration-200 ${
                      lessonSlug === lesson.slug 
                        ? "text-emerald-900" 
                        : "text-slate-700 hover:text-emerald-600"
                    }`}
                    href={`/kurs/${course.slug}/${lesson.slug}`}
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white font-medium text-sm shadow-sm transition-transform duration-200 group-hover:scale-110">
                      {index + 1}
                    </span>
                    <span className="font-medium">{lesson.title}</span>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <main className="min-h-[600px] rounded-lg border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-md">
        {lessonSlug ? (
          <article>
            <Lesson courseSlug={slug} lessonSlug={lessonSlug} />
          </article>
        ) : (
          <section>
            <div className="mb-8 border-b border-slate-200 pb-8">
              <div className="relative mb-4">
                <button
                  onClick={() => setShowEditButtons(!showEditButtons)}
                  className="absolute right-0 top-0 group flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-200"
                >
                  <svg className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Rediger
                </button>
                <h2 
                  className="bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-3xl font-bold text-transparent" 
                  data-testid="course_title"
                >
                  {course.title}
                </h2>
                {showEditButtons && (
                  <div className="absolute right-0 top-12 flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
                    <Link
                      href={`/kurs/${course.slug}/rediger`}
                      className="group flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2 font-medium text-emerald-700 transition-all duration-200 hover:bg-emerald-100"
                    >
                      <svg className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Endre kurs
                    </Link>
                    <button
                      onClick={handleDeleteCourse}
                      disabled={isDeleting}
                      className="group flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 font-medium text-red-700 transition-all duration-200 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-red-50"
                    >
                      <svg className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      {isDeleting ? (
                        <span className="flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-700 border-t-transparent"></div>
                          Sletter...
                        </span>
                      ) : (
                        "Slett kurs"
                      )}
                    </button>
                  </div>
                )}
              </div>
              <p
                className="text-lg leading-relaxed text-slate-600"
                data-testid="course_description"
              >
                {course.description}
              </p>
            </div>
            
            <div className="rounded-lg bg-emerald-50 p-6 transition-all duration-300 hover:bg-emerald-100">
              <h3 className="mb-4 text-lg font-bold text-emerald-900">
                Kom i gang
              </h3>
              <p className="mb-6 text-emerald-800">
                Velg en leksjon fra menyen til venstre for å starte kurset.
              </p>
              {course.lessons?.[0] && (
                <Link
                  href={`/kurs/${course.slug}/${course.lessons[0].slug}`}
                  className="group inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2 font-medium text-white transition-all duration-200 hover:bg-emerald-700 hover:shadow-lg active:bg-emerald-800"
                >
                  Start første leksjon
                  <svg 
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" 
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
        className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md"
      >
        <h3 className="mb-6 text-lg font-bold text-slate-800">Deltakere</h3>
        <ul data-testid="course_enrollments" className="space-y-4">
          {users?.map((user) => (
            <li 
              key={user.id}
              className="group flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3 transition-all duration-200 hover:border-emerald-200 hover:bg-emerald-50"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-medium text-emerald-800 transition-transform duration-200 group-hover:scale-110">
                {user.name.charAt(0)}
              </div>
              <span className="font-medium text-slate-700 transition-colors duration-200 group-hover:text-emerald-700">
                {user.name}
              </span>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}

export default Course;
