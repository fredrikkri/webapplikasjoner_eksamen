// 📁frontend/src/components/Course.tsx

import { useCourse } from "../hooks/useCourse";
import Lesson from "./Lesson";
import { users } from "../data/data";
import Link from "next/link";
import { useParams } from "next/navigation";

interface CourseProps {
  slug?: string;
}

function Course({ slug = "javascript-101" }: CourseProps) {
  const params = useParams();
  const lessonSlug = params?.lessonSlug as string;
  const { course, loading, error } = useCourse(slug);

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
        <h3 className="mb-6 text-lg font-bold text-slate-800">Leksjoner</h3>
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
              <Link
                data-testid="lesson_url"
                data-slug={lessonSlug}
                className={`flex items-center gap-3 p-3 ${
                  lessonSlug === lesson.slug 
                    ? "text-emerald-900" 
                    : "text-slate-700 hover:text-emerald-600"
                }`}
                href={`/kurs/${course.slug}/${lesson.slug}`}
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white font-medium text-sm">
                  {index + 1}
                </span>
                <span className="font-medium">{lesson.title}</span>
              </Link>
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
              <h2 
                className="mb-4 text-3xl font-bold text-slate-800" 
                data-testid="course_title"
              >
                {course.title}
              </h2>
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
