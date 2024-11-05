import { useState } from "react";
import { useLesson } from "../hooks/useLessons";
import { useComments, useCreateComment, type Comment, type CommentData } from "../hooks/useComments";

interface LessonProps {
  courseSlug: string;
  lessonSlug: string;
}

function Lesson({ courseSlug, lessonSlug }: LessonProps) {
  const { lesson, loading: lessonLoading, error: lessonError } = useLesson(
    courseSlug,
    lessonSlug
  );
  const { comments, loading: commentsLoading, error: commentsError } = useComments(lessonSlug);
  const { addComment, loading: addingComment } = useCreateComment();
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(false);
    setSuccess(false);
    if (!comment || !name) {
      setFormError(true);
    } else {
      const commentData: CommentData = {
        id: `${Math.floor(Math.random() * 1000 + 1)}`,
        createdBy: { id: Math.floor(Math.random() * 1000 + 1), name },
        comment,
        lesson: { slug: lessonSlug },
      };
      await addComment(commentData);
      setComment("");
      setName("");
      setSuccess(true);
    }
  };

  if (lessonLoading || commentsLoading) return <p>Laster...</p>;
  if (lessonError || commentsError)
    return <p>Noe gikk galt: {lessonError?.message || commentsError?.message}</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold" data-testid="lesson_title">
        {lesson?.title}
      </h2>
      <p data-testid="lesson_preAmble" className="mt-4 font-semibold leading-relaxed">
        {lesson?.preAmble}
      </p>
      {lesson?.text && lesson.text.length > 0 &&
        lesson.text.map((text) => (
          <p data-testid="lesson_text" className="mt-4 font-normal" key={text.id}>
            {text.text}
          </p>
        ))}
      <section data-testid="comments">
        <h4 className="mt-8 mb-4 text-lg font-bold">Kommentarer ({comments?.length})</h4>
        <form data-testid="comment_form" onSubmit={handleSubmit} noValidate>
          <label className="mb-4 flex flex-col" htmlFor="name">
            <span className="mb-1 text-sm font-semibold">Navn*</span>
            <input
              data-testid="form_name"
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded bg-slate-100"
            />
          </label>
          <label className="mb-4 flex flex-col" htmlFor="comment">
            <span className="mb-1 text-sm font-semibold">Legg til kommentar*</span>
            <textarea
              data-testid="form_textarea"
              name="comment"
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full rounded bg-slate-100"
              cols={30}
            />
          </label>
          <button
            className="rounded bg-emerald-600 px-10 py-2 text-center text-base text-white"
            data-testid="form_submit"
            type="submit"
          >
            Legg til kommentar
          </button>
          {formError && <p className="font-semibold text-red-500">Fyll ut alle felter med *</p>}
          {success && <p className="font-semibold text-emerald-500">Skjema sendt</p>}
        </form>
        <ul className="mt-8" data-testid="comments_list">
          {comments?.length > 0 &&
            comments.map((c: Comment) => (
              <li className="mb-6 rounded border border-slate-200 px-4 py-6" key={c.id}>
                <h5 className="font-bold">{c.createdBy.name}</h5>
                <p>{c.comment}</p>
              </li>
            ))}
        </ul>
      </section>
    </div>
  );
}

export default Lesson;
