import { useState } from "react";
import { useCreateCourse, type CourseData } from "../hooks/useCourse";
import { isValid } from "../lib/services";

interface CourseFields {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
}

interface LessonFields {
  id: string;
  title: string;
  slug: string;
  preAmble: string;
  text: { id: string; text: string; }[];
  order: string;
}

function Create() {
  const [current, setCurrent] = useState<number>(0);
  const [currentLesson, setCurrentLesson] = useState<number>(0);
  const [courseFields, setCourseFields] = useState<CourseFields>({
    id: `${Math.floor(Math.random() * 1000 + 1)}`,
    title: "",
    slug: "",
    description: "",
    category: "",
  });
  const [lessons, setLessons] = useState<LessonFields[]>([]);
  const { addCourse, loading, error } = useCreateCourse();
  const [formError, setFormError] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(false);
    setSuccess(false);

    if (lessons.length > 0 && isValid(lessons) && isValid(courseFields)) {
      const courseData: CourseData = {
        ...courseFields,
        lessons,
      };
      await addCourse(courseData);
      setSuccess(true);
    } else {
      setFormError(true);
    }
  };

  const handleCourseFieldChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setCourseFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleLessonFieldChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, value } = event.target;
    const updatedLessons = lessons.map((lesson, i) =>
      i === index ? { ...lesson, [name]: value } : lesson
    );
    setLessons(updatedLessons);
  };

  const addLesson = () => {
    setLessons((prev) => [
      ...prev,
      {
        id: `${Math.floor(Math.random() * 1000 + 1)}`,
        title: "",
        slug: "",
        preAmble: "",
        text: [],
        order: `${lessons.length}`,
      },
    ]);
    setCurrentLesson(lessons.length);
  };

  return (
    <>
      <h2 className="text-xl font-bold" data-testid="title">
        Lag nytt kurs
      </h2>
      <form className="mt-8 max-w-4xl" data-testid="form" onSubmit={handleSubmit} noValidate>
        {current === 0 ? (
          <div data-testid="course_step" className="max-w-lg">
            <label className="mb-4 flex flex-col" htmlFor="title">
              <span className="mb-1 font-semibold">Tittel*</span>
              <input
                className="rounded"
                data-testid="form_title"
                type="text"
                name="title"
                id="title"
                value={courseFields.title}
                onChange={handleCourseFieldChange}
              />
            </label>
            <label className="mb-4 flex flex-col" htmlFor="slug">
              <span className="mb-1 font-semibold">Slug*</span>
              <input
                className="rounded"
                data-testid="form_slug"
                type="text"
                name="slug"
                id="slug"
                value={courseFields.slug}
                onChange={handleCourseFieldChange}
              />
            </label>
            <label className="mb-4 flex flex-col" htmlFor="description">
              <span className="mb-1 font-semibold">Beskrivelse*</span>
              <input
                className="rounded"
                data-testid="form_description"
                type="text"
                name="description"
                id="description"
                value={courseFields.description}
                onChange={handleCourseFieldChange}
              />
            </label>
            <label className="mb-4 flex flex-col" htmlFor="category">
              <span className="mb-1 font-semibold">Kategori*</span>
              <select
                className="rounded"
                data-testid="form_category"
                name="category"
                id="category"
                value={courseFields.category}
                onChange={handleCourseFieldChange}
              >
                <option disabled value="">
                  Velg kategori
                </option>
                <option value="programmering">Programmering</option>
                <option value="design">Design</option>
              </select>
            </label>
          </div>
        ) : null}

        {current === 1 ? (
          <div data-testid="lesson_step" className="grid w-full grid-cols-[350px_minmax(50%,_1fr)] gap-12">
            <aside className="border-r border-slate-200 pr-6">
              <h3 className="mb-4 text-base font-bold">Leksjoner</h3>
              <ul data-testid="lessons">
                {lessons.length > 0 &&
                  lessons.map((lesson, index) => (
                    <li
                      className={`borde mb-4 w-full rounded px-4 py-2 text-base ${
                        index === currentLesson
                          ? "border border-transparent bg-emerald-200"
                          : "border border-slate-300 bg-transparent"
                      }`}
                      key={lesson.id}
                    >
                      <button
                        type="button"
                        data-testid="select_lesson_btn"
                        className="w-full max-w-full truncate pr-2 text-left"
                        onClick={() => setCurrentLesson(index)}
                      >
                        {lesson.title || `Leksjon ${index + 1}`}
                      </button>
                    </li>
                  ))}
              </ul>
              <button
                className="w-full bg-slate-100 px-2 py-2"
                type="button"
                onClick={addLesson}
                data-testid="form_lesson_add"
              >
                + Ny leksjon
              </button>
            </aside>
            {lessons.length > 0 && (
              <div className="w-full">
                <label className="mb-4 flex flex-col" htmlFor="lessonTitle">
                  <span className="mb-1 font-semibold">Leksjonstittel*</span>
                  <input
                    className="rounded"
                    data-testid="form_lesson_title"
                    type="text"
                    name="title"
                    id="lessonTitle"
                    value={lessons[currentLesson]?.title}
                    onChange={(e) => handleLessonFieldChange(e, currentLesson)}
                  />
                </label>
                <label className="mb-4 flex flex-col" htmlFor="lessonSlug">
                  <span className="mb-1 font-semibold">Slug*</span>
                  <input
                    className="rounded"
                    data-testid="form_lesson_slug"
                    type="text"
                    name="slug"
                    id="lessonSlug"
                    value={lessons[currentLesson]?.slug}
                    onChange={(e) => handleLessonFieldChange(e, currentLesson)}
                  />
                </label>
                <label className="mb-4 flex flex-col" htmlFor="lessonPreAmble">
                  <span className="mb-1 font-semibold">Ingress*</span>
                  <input
                    className="rounded"
                    data-testid="form_lesson_preAmble"
                    type="text"
                    name="preAmble"
                    id="lessonPreAmble"
                    value={lessons[currentLesson]?.preAmble}
                    onChange={(e) => handleLessonFieldChange(e, currentLesson)}
                  />
                </label>
              </div>
            )}
          </div>
        ) : null}

        {formError && (
          <p className="font-semibold text-red-500">Fyll ut alle felter med *</p>
        )}
        {success && (
          <p className="font-semibold text-emerald-500">Kurs opprettet!</p>
        )}

        <button
          className="mt-6 rounded bg-emerald-600 px-6 py-2 text-white"
          type={current === 1 ? "submit" : "button"}
          onClick={() => current === 0 && setCurrent(1)}
        >
          {current === 1 ? "Publiser kurs" : "Neste steg"}
        </button>
      </form>
    </>
  );
}

export default Create;
