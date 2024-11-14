import { useEffect, useState } from "react";
import { courses, categories } from "../data/data";
import Link from "next/link";
import { useAllCourses } from "@/hooks/useCourse";

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
}

function Courses() {
  const { courses: allCourses, loading, error } = useAllCourses(); 
  const [value, setValue] = useState<string>("");
  const [data, setData] = useState<Course[]>([]);

  useEffect(() => {
    if (allCourses) {
      setData(allCourses);
    }
  }, [allCourses]);

  const handleFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const category = event.target.value;
    setValue(category);
    if (category && category.length > 0) {
      const content = courses.filter((course) =>
        course.category.toLocaleLowerCase().includes(category.toLowerCase())
      );
      setData(content);
    } else {
      setData(courses);
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      <header className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800" data-testid="title">
            Alle kurs
          </h2>
          <p className="mt-2 text-slate-600">
            Utforsk våre kurs og start din læringsreise
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-slate-700" htmlFor="filter">
            Kategori:
          </label>
          <select
            id="filter"
            name="filter"
            data-testid="filter"
            value={value}
            onChange={handleFilter}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-emerald-600 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
          >
            <option value="">Alle kategorier</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </header>

      <section 
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" 
        data-testid="courses"
      >
        {data && data.length > 0 ? (
          data.map((course) => (
            <article
              key={course.id}
              data-testid="course_wrapper"
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800">
                  {course.category}
                </span>
                <div className="h-8 w-8 rounded-full bg-emerald-50 p-2">
                  📚
                </div>
              </div>
              
              <h3 
                className="mb-3 text-xl font-bold text-slate-800 group-hover:text-emerald-600" 
                data-testid="courses_title"
              >
                <Link href={`/kurs/${course.slug}`} className="block">
                  {course.title}
                </Link>
              </h3>
              
              <p 
                className="mb-6 text-base text-slate-600" 
                data-testid="courses_description"
              >
                {course.description}
              </p>
              
              <Link
                className="inline-flex items-center gap-2 font-medium text-emerald-600 transition-colors hover:text-emerald-700"
                data-testid="courses_url"
                href={`/kurs/${course.slug}`}
              >
                Start kurset
                <svg 
                  className="h-4 w-4 transition-transform group-hover:translate-x-1" 
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
            </article>
          ))
        ) : (
          <div 
            className="col-span-full rounded-lg border-2 border-dashed border-slate-200 p-12 text-center"
            data-testid="empty"
          >
            <div className="mx-auto max-w-sm">
              <p className="text-lg font-medium text-slate-700">
                Ingen kurs funnet
              </p>
              <p className="mt-2 text-slate-600">
                Prøv å velge en annen kategori eller kom tilbake senere.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default Courses;
