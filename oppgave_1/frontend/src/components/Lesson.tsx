import { useState } from "react";
import { useLesson } from "../hooks/useLessons";
import { useComments, useCreateComment} from "../hooks/useComments";
import { type Comment, type CommentData } from "../types/types";
import { useRouter } from "next/navigation";
import { deleteLesson } from "../lib/services/lessons";
import Link from "next/link";

interface LessonProps {
  courseSlug: string;
  lessonSlug: string;
}

// Helper function to check if content contains HTML
const containsHTML = (text: string): boolean => {
  const doc = new DOMParser().parseFromString(text, 'text/html');
  return Array.from(doc.body.childNodes).some(node => node.nodeType === 1);
};

function Lesson({ courseSlug, lessonSlug }: LessonProps) {
  const router = useRouter();
  const { lesson, loading: lessonLoading, error: lessonError } = useLesson(
    courseSlug,
    lessonSlug
  );
  const { comments, loading: commentsLoading, error: commentsError, refreshComments } = useComments(
    lesson?.id ?? ''
  );
  const { addComment, loading: addingComment } = useCreateComment();
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState(false);
  const [showEditButtons, setShowEditButtons] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(false);
    setSuccess(false);
    if (!comment || !name || !lesson?.id) {
      setFormError(true);
    } else {
      try {
        const commentData: CommentData = {
          id: `${Math.floor(Math.random() * 1000 + 1)}`,
          createdBy: { id: Math.floor(Math.random() * 1000 + 1), name },
          comment,
          lesson: { id: lesson.id },
        };
        await addComment(commentData);
        await refreshComments(); // Refresh comments after successful submission
        setComment("");
        setName("");
        setSuccess(true);
      } catch (error) {
        setFormError(true);
      }
    }
  };

  const handleDeleteLesson = async () => {
    if (!courseSlug || !lessonSlug || !confirm("Er du sikker på at du vil slette denne leksjonen?")) return;
    
    try {
      setIsDeleting(true);
      await deleteLesson(courseSlug, lessonSlug);
      router.push(`/kurs/${courseSlug}`);
    } catch (error) {
      console.error("Error deleting lesson:", error);
      alert("Kunne ikke slette leksjonen");
    } finally {
      setIsDeleting(false);
    }
  };

  if (lessonLoading || commentsLoading) return (
    <div className="animate-fade-in space-y-4">
      <div className="h-8 w-2/3 animate-pulse rounded-lg bg-slate-200"></div>
      <div className="h-4 w-full animate-pulse rounded-lg bg-slate-200"></div>
      <div className="space-y-2">
        <div className="h-4 w-full animate-pulse rounded-lg bg-slate-200"></div>
        <div className="h-4 w-5/6 animate-pulse rounded-lg bg-slate-200"></div>
        <div className="h-4 w-4/6 animate-pulse rounded-lg bg-slate-200"></div>
      </div>
    </div>
  );

  if (lessonError || commentsError) return (
    <div className="animate-fade-in rounded-lg border-2 border-red-100 bg-red-50 p-6 text-center">
      <p className="text-lg font-medium text-red-800">
        Noe gikk galt: {lessonError?.message || commentsError?.message}
      </p>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="relative mb-6">
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
          className="bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-2xl font-bold text-transparent" 
          data-testid="lesson_title"
        >
          {lesson?.title}
        </h2>
        {showEditButtons && (
          <div className="absolute right-0 top-12 flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
            <Link
              href={`/kurs/${courseSlug}/${lessonSlug}/rediger`}
              className="group flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2 font-medium text-emerald-700 transition-all duration-200 hover:bg-emerald-100"
            >
              <svg className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Endre leksjon
            </Link>
            <button
              onClick={handleDeleteLesson}
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
                "Slett leksjon"
              )}
            </button>
          </div>
        )}
      </div>
      <p 
        data-testid="lesson_preAmble" 
        className="mt-4 font-semibold leading-relaxed text-slate-700"
      >
        {lesson?.preAmble}
      </p>
      {lesson?.text && lesson.text.length > 0 &&
        lesson.text.map((text) => (
          <div key={text.id}>
            {containsHTML(text.text) ? (
              <div 
                data-testid="lesson_text"
                className="mt-4 leading-relaxed text-slate-600 prose prose-slate max-w-none"
                dangerouslySetInnerHTML={{ __html: text.text }}
              />
            ) : (
              <p 
                data-testid="lesson_text" 
                className="mt-4 leading-relaxed text-slate-600"
              >
                {text.text}
              </p>
            )}
          </div>
        ))}
      <section data-testid="comments" className="mt-12">
        <h4 className="mb-6 text-lg font-bold text-slate-800">
          Kommentarer ({comments?.length})
        </h4>
        <form 
          data-testid="comment_form" 
          onSubmit={handleSubmit} 
          noValidate 
          className={`mb-8 space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md ${formError ? 'animate-shake' : ''}`}
        >
          <label className="block" htmlFor="name">
            <span className="mb-1.5 block font-medium text-slate-700">
              Navn<span className="text-emerald-600">*</span>
            </span>
            <input
              data-testid="form_name"
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={addingComment}
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 shadow-sm transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-100 disabled:opacity-50"
              placeholder="Skriv ditt navn"
            />
          </label>
          <label className="block" htmlFor="comment">
            <span className="mb-1.5 block font-medium text-slate-700">
              Kommentar<span className="text-emerald-600">*</span>
            </span>
            <textarea
              data-testid="form_textarea"
              name="comment"
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={addingComment}
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 shadow-sm transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-100 disabled:opacity-50"
              placeholder="Skriv din kommentar"
              rows={4}
            />
          </label>
          <button
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 font-medium text-white transition-all duration-200 hover:bg-emerald-700 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-emerald-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-emerald-600 disabled:hover:shadow-none"
            data-testid="form_submit"
            type="submit"
            disabled={addingComment}
          >
            {addingComment ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                <span>Sender...</span>
              </>
            ) : (
              "Legg til kommentar"
            )}
          </button>
          
          {formError && (
            <div className="rounded-lg bg-red-50 p-3 text-center">
              <p className="font-medium text-red-800">
                Fyll ut alle påkrevde felt
              </p>
            </div>
          )}
          {success && (
            <div className="rounded-lg bg-emerald-50 p-3 text-center">
              <p className="font-medium text-emerald-800">
                Kommentar lagt til!
              </p>
            </div>
          )}
        </form>
        
        <ul className="space-y-4" data-testid="comments_list">
          {comments?.length > 0 ? (
            comments.map((c: Comment) => (
              <li 
                key={c.id}
                className="group rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-2 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-medium text-emerald-800 transition-transform duration-200 group-hover:scale-110">
                    {c.createdBy.name.charAt(0)}
                  </div>
                  <h5 className="font-bold text-slate-800 transition-colors duration-200 group-hover:text-emerald-600">
                    {c.createdBy.name}
                  </h5>
                </div>
                <p className="text-slate-600">{c.comment}</p>
              </li>
            ))
          ) : (
            <li className="rounded-lg border-2 border-dashed border-slate-200 p-8 text-center">
              <p className="text-slate-600">
                Ingen kommentarer enda. Bli den første til å kommentere!
              </p>
            </li>
          )}
        </ul>
     </section>
   </div>
  );
}

export default Lesson;
