import { useState } from "react";
import { useCreateCourse, type CourseData } from "../hooks/useCourse";
import { isValid } from "../lib/services";
import { EditorWrapper, defaultEditorConfig, tiptapEditorConfig, EditorConfig } from "./editors";

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

const steps = [
  { id: 0, name: "Kursdetaljer" },
  { id: 1, name: "Leksjoner" },
];

function Create() {
  const [current, setCurrent] = useState<number>(0);
  const [currentLesson, setCurrentLesson] = useState<number>(0);
  const [editorConfig, setEditorConfig] = useState<EditorConfig>(tiptapEditorConfig);
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

  const handleLessonTextChange = (value: string, index: number) => {
    const updatedLessons = lessons.map((lesson, i) =>
      i === index ? {
        ...lesson,
        text: [{
          id: lesson.text[0]?.id || `${Math.floor(Math.random() * 1000 + 1)}`,
          text: value
        }]
      } : lesson
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
        text: [{
          id: `${Math.floor(Math.random() * 1000 + 1)}`,
          text: ""
        }],
        order: `${lessons.length}`,
      },
    ]);
    setCurrentLesson(lessons.length);
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold text-slate-800" data-testid="title">
          Lag nytt kurs
        </h2>
        <p className="mt-2 text-slate-600">
          Fyll ut informasjonen under for å opprette et nytt kurs
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-12">
        <div className="relative">
          <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-slate-200"></div>
          <div 
            className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-emerald-600 transition-all duration-500"
            style={{ width: `${(current / (steps.length - 1)) * 100}%` }}
          ></div>
          <div className="relative flex justify-between">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => index <= current && setCurrent(index)}
                disabled={index > current}
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                  index <= current
                    ? "border-emerald-600 bg-emerald-600 text-white"
                    : "border-slate-300 bg-white text-slate-500"
                } transition-all duration-200 ${
                  index <= current ? "cursor-pointer hover:shadow-lg" : "cursor-not-allowed"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 flex justify-between">
          {steps.map((step, index) => (
            <span
              key={step.id}
              className={`text-sm font-medium ${
                index <= current ? "text-emerald-600" : "text-slate-500"
              }`}
            >
              {step.name}
            </span>
          ))}
        </div>
      </div>

      <form className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm" data-testid="form" onSubmit={handleSubmit} noValidate>
        {current === 0 ? (
          <div data-testid="course_step" className="max-w-2xl">
            <div className="mb-6">
              <label className="mb-2 block font-medium text-slate-700" htmlFor="title">
                Tittel<span className="text-emerald-600">*</span>
              </label>
              <input
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 transition-colors focus:border-emerald-600 focus:outline-none"
                data-testid="form_title"
                type="text"
                name="title"
                id="title"
                placeholder="F.eks. Introduksjon til React"
                value={courseFields.title}
                onChange={handleCourseFieldChange}
              />
            </div>

            <div className="mb-6">
              <label className="mb-2 block font-medium text-slate-700" htmlFor="slug">
                Slug<span className="text-emerald-600">*</span>
              </label>
              <input
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 transition-colors focus:border-emerald-600 focus:outline-none"
                data-testid="form_slug"
                type="text"
                name="slug"
                id="slug"
                placeholder="F.eks. intro-til-react"
                value={courseFields.slug}
                onChange={handleCourseFieldChange}
              />
            </div>

            <div className="mb-6">
              <label className="mb-2 block font-medium text-slate-700" htmlFor="description">
                Beskrivelse<span className="text-emerald-600">*</span>
              </label>
              <input
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 transition-colors focus:border-emerald-600 focus:outline-none"
                data-testid="form_description"
                type="text"
                name="description"
                id="description"
                placeholder="Kort beskrivelse av kurset"
                value={courseFields.description}
                onChange={handleCourseFieldChange}
              />
            </div>

            <div className="mb-6">
              <label className="mb-2 block font-medium text-slate-700" htmlFor="category">
                Kategori<span className="text-emerald-600">*</span>
              </label>
              <select
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 transition-colors focus:border-emerald-600 focus:outline-none"
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
            </div>
          </div>
        ) : null}

        {current === 1 ? (
          <>
            <div className="mb-4 flex justify-end">
              <select
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm"
                value={editorConfig.type}
                onChange={(e) => setEditorConfig(e.target.value === 'textarea' ? defaultEditorConfig : tiptapEditorConfig)}
              >
                <option value="textarea">Simple Editor</option>
                <option value="tiptap">Rich Text Editor</option>
              </select>
            </div>
            <div data-testid="lesson_step" className="grid w-full grid-cols-[300px_minmax(50%,_1fr)] gap-8">
              <aside className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <h3 className="mb-4 text-lg font-bold text-slate-800">Leksjoner</h3>
                <ul data-testid="lessons" className="mb-4 space-y-2">
                  {lessons.length > 0 &&
                    lessons.map((lesson, index) => (
                      <li
                        className={`rounded-lg transition-all ${
                          index === currentLesson
                            ? "bg-emerald-100 shadow-sm"
                            : "hover:bg-white"
                        }`}
                        key={lesson.id}
                      >
                        <button
                          type="button"
                          data-testid="select_lesson_btn"
                          className="w-full p-3 text-left"
                          onClick={() => setCurrentLesson(index)}
                        >
                          <div className="flex items-center gap-3">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-sm font-medium">
                              {index + 1}
                            </span>
                            <span className="font-medium">
                              {lesson.title || `Leksjon ${index + 1}`}
                            </span>
                          </div>
                        </button>
                      </li>
                    ))}
                </ul>
                <button
                  className="w-full rounded-lg border-2 border-dashed border-slate-300 bg-white px-4 py-3 font-medium text-slate-700 transition-all hover:border-emerald-600 hover:text-emerald-600"
                  type="button"
                  onClick={addLesson}
                  data-testid="form_lesson_add"
                >
                  + Legg til leksjon
                </button>
              </aside>

              {lessons.length > 0 ? (
                <div className="rounded-lg border border-slate-200 bg-white p-6">
                  <div className="mb-6">
                    <label className="mb-2 block font-medium text-slate-700" htmlFor="lessonTitle">
                      Leksjonstittel<span className="text-emerald-600">*</span>
                    </label>
                    <input
                      className="w-full rounded-lg border border-slate-200 px-4 py-2.5 transition-colors focus:border-emerald-600 focus:outline-none"
                      data-testid="form_lesson_title"
                      type="text"
                      name="title"
                      id="lessonTitle"
                      placeholder="F.eks. Introduksjon til komponenter"
                      value={lessons[currentLesson]?.title}
                      onChange={(e) => handleLessonFieldChange(e, currentLesson)}
                    />
                  </div>

                  <div className="mb-6">
                    <label className="mb-2 block font-medium text-slate-700" htmlFor="lessonSlug">
                      Slug<span className="text-emerald-600">*</span>
                    </label>
                    <input
                      className="w-full rounded-lg border border-slate-200 px-4 py-2.5 transition-colors focus:border-emerald-600 focus:outline-none"
                      data-testid="form_lesson_slug"
                      type="text"
                      name="slug"
                      id="lessonSlug"
                      placeholder="F.eks. intro-til-komponenter"
                      value={lessons[currentLesson]?.slug}
                      onChange={(e) => handleLessonFieldChange(e, currentLesson)}
                    />
                  </div>

                  <div className="mb-6">
                    <label className="mb-2 block font-medium text-slate-700" htmlFor="lessonPreAmble">
                      Ingress<span className="text-emerald-600">*</span>
                    </label>
                    <input
                      className="w-full rounded-lg border border-slate-200 px-4 py-2.5 transition-colors focus:border-emerald-600 focus:outline-none"
                      data-testid="form_lesson_preAmble"
                      type="text"
                      name="preAmble"
                      id="lessonPreAmble"
                      placeholder="Kort beskrivelse av leksjonen"
                      value={lessons[currentLesson]?.preAmble}
                      onChange={(e) => handleLessonFieldChange(e, currentLesson)}
                    />
                  </div>

                  <div className="mb-6">
                    <label className="mb-2 block font-medium text-slate-700" htmlFor="lessonText">
                      Innhold<span className="text-emerald-600">*</span>
                    </label>
                    <EditorWrapper
                      value={lessons[currentLesson]?.text[0]?.text || ""}
                      onChange={(value) => handleLessonTextChange(value, currentLesson)}
                      placeholder="Skriv leksjonsinnholdet her..."
                      config={editorConfig}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-slate-200 p-8">
                  <div className="text-center">
                    <p className="mb-2 text-lg font-medium text-slate-700">
                      Ingen leksjoner lagt til
                    </p>
                    <p className="text-slate-600">
                      Klikk på "Legg til leksjon" for å komme i gang
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : null}

        {formError && (
          <div className="mb-6 mt-6 rounded-lg bg-red-50 p-4 text-center">
            <p className="font-medium text-red-800">
              Fyll ut alle påkrevde felt markert med *
            </p>
          </div>
        )}

        {success && (
          <div className="mb-6 mt-6 rounded-lg bg-emerald-50 p-4 text-center">
            <p className="font-medium text-emerald-800">
              Kurset er opprettet!
            </p>
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <button
            className={`inline-flex items-center gap-2 rounded-lg px-6 py-2.5 font-medium transition-all ${
              current === 1
                ? "bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg"
                : "bg-slate-800 text-white hover:bg-slate-900 hover:shadow-lg"
            }`}
            type={current === 1 ? "submit" : "button"}
            onClick={() => current === 0 && setCurrent(1)}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                <span>Lagrer...</span>
              </>
            ) : current === 1 ? (
              "Publiser kurs"
            ) : (
              "Neste steg"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Create;
