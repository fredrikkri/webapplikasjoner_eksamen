import { useEffect, useState } from "react";
import Link from "next/link";
import { useAllCourses } from "../hooks/useCourse";
import { useCategories } from "../hooks/useCategories";

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
}

function Courses() {
  const { 
    courses: allCourses, 
    loading: coursesLoading, 
    error: coursesError,
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    nextPage,
    previousPage
  } = useAllCourses();
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const [value, setValue] = useState<string>("");
  const [data, setData] = useState<Course[]>([]);

  useEffect(() => {
    if (allCourses) {
      console.log('Setting data with courses:', allCourses);
      setData(allCourses);
    }
  }, [allCourses]);

  const handleFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const category = event.target.value;
    setValue(category);
    
    if (!allCourses) return;

    if (category && category.length > 0) {
      const content = allCourses.filter((course) =>
        course.category.toLowerCase() === category.toLowerCase()
      );
      setData(content);
    } else {
      setData(allCourses);
    }
  };

  if (coursesLoading || categoriesLoading) {
    return (
      <div className="mx-auto max-w-7xl animate-fade-in">
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3">
            <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200"></div>
            <div className="h-4 w-64 animate-pulse rounded-lg bg-slate-200"></div>
          </div>
          <div className="h-10 w-48 animate-pulse rounded-lg bg-slate-200"></div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-64 animate-pulse rounded-2xl bg-slate-200"></div>
          ))}
        </div>
      </div>
    );
  }

  if (coursesError || categoriesError) {
    return (
      <div className="mx-auto max-w-7xl">
        <div className="rounded-lg border-2 border-red-100 bg-red-50 p-6 text-center">
          <p className="text-lg font-medium text-red-800">
            {coursesError ? `Kunne ikke laste kurs: ${coursesError.message}` : 
             categoriesError ? `Kunne ikke laste kategorier: ${categoriesError.message}` : 
             'En feil har oppstått'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl animate-fade-in">
      <header className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-3xl font-bold text-transparent" data-testid="title">
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
            className="rounded-lg border border-slate-200 bg-white px-4 pr-8 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:border-emerald-600 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          >
            <option value="">Alle kategorier</option>
            {categories?.map((category) => (
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
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800 transition-colors group-hover:bg-emerald-200">
                  {course.category}
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 p-2 transition-transform duration-300 group-hover:rotate-12">
                  📚
                </div>
              </div>
              
              <h3 
                className="mb-3 text-xl font-bold text-slate-800 transition-colors group-hover:text-emerald-600" 
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
                className="inline-flex items-center gap-2 font-medium text-emerald-600 transition-all duration-200 hover:text-emerald-700 group-hover:gap-3"
                data-testid="courses_url"
                href={`/kurs/${course.slug}`}
              >
                Start kurset
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
            </article>
          ))
        ) : (
          <div 
            className="col-span-full rounded-lg border-2 border-dashed border-slate-200 p-12 text-center transition-all duration-300 hover:border-emerald-600 hover:bg-emerald-50"
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

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={previousPage}
            disabled={!hasPreviousPage}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200
              ${hasPreviousPage 
                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
          >
            Forrige side
          </button>
          <span className="text-sm font-medium text-slate-600">
            Side {currentPage} av {totalPages}
          </span>
          <button
            onClick={nextPage}
            disabled={!hasNextPage}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200
              ${hasNextPage 
                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
          >
            Neste side
          </button>
        </div>
      )}
    </div>
  );
}

export default Courses;
