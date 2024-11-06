// 📁frontend/src/components/Course.tsx

import { useCourse } from "../hooks/useCourse";
import Lesson from "./Lesson";
import { users } from "../data/data";
import Link from "next/link";
import { useParams } from "next/navigation";

class CourseProps {
  slug?: string;
}

function Course({ slug = "javascript-101" }: CourseProps) {
  const params = useParams();
  const lessonSlug = params?.lessonSlug as string;
  const { course, loading, error } = useCourse(slug);

  if (loading) return <p>Laster...</p>;
  if (error) return <p>Noe gikk galt: {error.message}</p>;
  if (!course) return <p>Fant ikke kurset</p>;

  return (
    <div className="grid grid-cols-[250px_minmax(20%,1fr)_1fr] gap-16">
      <aside className="border-r border-slate-200 pr-6">
        <h3 className="mb-4 text-base font-bold">Leksjoner</h3>
        <ul data-testid="lessons">
          {course.lessons?.map((lesson) => (
            <li
              className={`text-sm mb-4 w-full max-w-[95%] rounded-lg border border-slate-300 px-4 py-2 ${
                lessonSlug === lesson.slug ? "bg-emerald-300" : "bg-transparent"
              }`}
              key={lesson.id}
            >
              <Link
                data-testid="lesson_url"
                data-slug={lessonSlug}
                className="block h-full w-full"
                href={`/kurs/${course.slug}/${lesson.slug}`}
              >
                {lesson.title}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
      {lessonSlug ? (
        <article>
          <Lesson courseSlug={slug} lessonSlug={lessonSlug} />
        </article>
      ) : (
        <section>
          <>
            <h2 className="text-2xl font-bold" data-testid="course_title">
              {course.title}
            </h2>
            <p
              className="mt-4 font-semibold leading-relaxed"
              data-testid="course_description"
            >
              {course.description}
            </p>
          </>
        </section>
      )}
      <aside data-testid="enrollments" className="border-l border-slate-200 pl-6">
        <h3 className="mb-4 text-base font-bold">Deltakere</h3>
        <ul data-testid="course_enrollments">
          {users?.map((user) => (
            <li className="mb-1" key={user.id}>
              {user.name}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}

export default Course;
