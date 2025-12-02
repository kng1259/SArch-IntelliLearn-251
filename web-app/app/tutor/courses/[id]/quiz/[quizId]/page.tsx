'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import assessmentService, { QuizResponse, Question, Option, QuestionUpdateRequest } from '@/lib/services/assessmentService';
import { useToast } from '@/app/components/Toast';

// Component cho một Option
interface OptionEditorProps {
  option: Option;
  index: number;
  questionIndex: number;
  onChange: (index: number, option: Option, isSettingCorrect?: boolean) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

function OptionEditor({ option, index, questionIndex, onChange, onRemove, canRemove }: OptionEditorProps) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
      <input
        type="radio"
        name={`question-${questionIndex}-correct`}
        checked={option.correct}
        onChange={() => onChange(index, { ...option, correct: true }, true)}
        className="w-4 h-4 text-green-600 cursor-pointer"
        title="Đánh dấu là đáp án đúng"
      />
      <span className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full text-sm font-medium text-gray-700">
        {String.fromCharCode(65 + index)}
      </span>
      <input
        type="text"
        value={option.value}
        onChange={(e) => onChange(index, { ...option, value: e.target.value })}
        placeholder={`Option ${String.fromCharCode(65 + index)}`}
        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
      />
      {option.correct && (
        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
          Correct
        </span>
      )}
      {canRemove && (
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="p-1 hover:bg-red-100 rounded transition-colors"
          title="Remove option"
        >
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

// Component cho một Question
interface QuestionEditorProps {
  question: Question;
  questionIndex: number;
  onChange: (question: Question) => void;
  onRemove: () => void;
  canRemove: boolean;
}

function QuestionEditor({ question, questionIndex, onChange, onRemove, canRemove }: QuestionEditorProps) {
  const handleContentChange = (content: string) => {
    onChange({ ...question, content });
  };

  const handleOptionChange = (optionIndex: number, option: Option, isSettingCorrect: boolean = false) => {
    const newOptions = [...question.options];
    // Chỉ khi đang click radio để set correct, mới unset tất cả options khác
    if (isSettingCorrect) {
      newOptions.forEach((opt, idx) => {
        newOptions[idx] = { ...opt, correct: idx === optionIndex };
      });
    } else {
      // Cập nhật option bình thường (ví dụ: thay đổi text)
      newOptions[optionIndex] = option;
    }
    onChange({ ...question, options: newOptions });
  };

  const handleRemoveOption = (optionIndex: number) => {
    const newOptions = question.options.filter((_, idx) => idx !== optionIndex)
      .map((opt, idx) => ({ ...opt, order: idx + 1 }));
    onChange({ ...question, options: newOptions });
  };

  const handleAddOption = () => {
    const newOption: Option = {
      order: question.options.length + 1,
      value: '',
      correct: false,
    };
    onChange({ ...question, options: [...question.options, newOption] });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 flex items-center justify-center bg-indigo-100 text-indigo-700 rounded-lg font-semibold">
            {questionIndex + 1}
          </span>
          <span className="text-sm text-gray-500">Question</span>
        </div>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="p-2 hover:bg-red-100 rounded-lg transition-colors"
            title="Remove question"
          >
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>

      <div className="mb-4">
        <textarea
          value={question.content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder="Enter your question here..."
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-gray-900"
        />
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Answer Options</label>
          <span className="text-xs text-gray-500">Select the correct answer</span>
        </div>
        {question.options.map((option, optionIndex) => (
          <OptionEditor
            key={optionIndex}
            option={option}
            index={optionIndex}
            questionIndex={questionIndex}
            onChange={handleOptionChange}
            onRemove={handleRemoveOption}
            canRemove={question.options.length > 2}
          />
        ))}
      </div>

      {question.options.length < 6 && (
        <button
          type="button"
          onClick={handleAddOption}
          className="flex items-center gap-2 px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Option
        </button>
      )}
    </div>
  );
}

// Main Quiz Detail Page
export default function QuizDetailPage({ params }: { params: Promise<{ id: string; quizId: string }> }) {
  const { id: courseId, quizId } = use(params);
  const toast = useToast();
  
  const [quiz, setQuiz] = useState<QuizResponse | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch quiz details
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await assessmentService.getQuiz(quizId);
        setQuiz(data);
        setQuestions(data.questions || []);
      } catch (err: any) {
        console.error('Failed to fetch quiz:', err);
        setError(err.message || 'Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  const handleQuestionChange = (index: number, question: Question) => {
    const newQuestions = [...questions];
    newQuestions[index] = question;
    setQuestions(newQuestions);
    setHasChanges(true);
  };

  const handleRemoveQuestion = (index: number) => {
    if (confirm('Bạn có chắc muốn xóa câu hỏi này?')) {
      setQuestions(questions.filter((_, idx) => idx !== index));
      setHasChanges(true);
    }
  };

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      content: '',
      options: [
        { order: 1, value: '', correct: true },
        { order: 2, value: '', correct: false },
        { order: 3, value: '', correct: false },
        { order: 4, value: '', correct: false },
      ],
    };
    setQuestions([...questions, newQuestion]);
    setHasChanges(true);
  };

  const validateQuestions = (): string | null => {
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.content.trim()) {
        return `Question ${i + 1}: Content is required`;
      }
      if (q.options.length < 2) {
        return `Question ${i + 1}: At least 2 options are required`;
      }
      const hasCorrect = q.options.some(opt => opt.correct);
      if (!hasCorrect) {
        return `Question ${i + 1}: Please select a correct answer`;
      }
      const emptyOption = q.options.find(opt => !opt.value.trim());
      if (emptyOption) {
        return `Question ${i + 1}: All options must have a value`;
      }
    }
    return null;
  };

  const handleSaveQuestions = async () => {
    const validationError = validateQuestions();
    if (validationError) {
      toast.warning(validationError);
      return;
    }

    setSaving(true);
    try {
      // Convert questions to QuestionUpdateRequest format
      const questionsToSave: QuestionUpdateRequest[] = questions.map(q => ({
        id: q.id,
        content: q.content,
        options: q.options,
      }));

      // Update quiz with new questions
      await assessmentService.updateQuizWithQuestions(quizId, {
        name: quiz?.name,
        description: quiz?.description,
        startAt: quiz?.startAt,
        duration: quiz?.duration,
        level: quiz?.level,
        questions: questionsToSave,
      });
      
      toast.success('Lưu câu hỏi thành công!');
      setHasChanges(false);
    } catch (err: any) {
      console.error('Failed to save questions:', err);
      toast.error(`Lỗi: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const getLevelBadgeColor = (level?: string) => {
    switch (level?.toUpperCase()) {
      case 'EASY':
        return 'bg-green-100 text-green-700';
      case 'HARD':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Not set';
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Quiz</h2>
          <p className="text-gray-600 mb-4">{error || 'Quiz not found'}</p>
          <Link
            href={`/tutor/courses/${courseId}`}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            ← Back to Course
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={`/tutor/courses/${courseId}`}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Course
            </Link>
          </div>
          <div className="flex items-center gap-3">
            {hasChanges && (
              <span className="text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                Unsaved changes
              </span>
            )}
            <button
              onClick={handleSaveQuestions}
              disabled={saving || !hasChanges}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                saving || !hasChanges
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Questions
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Quiz Info Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{quiz.name}</h1>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getLevelBadgeColor(quiz.level)}`}>
                  {quiz.level || 'NORMAL'}
                </span>
              </div>
              {quiz.description && (
                <p className="text-gray-600 mb-4">{quiz.description}</p>
              )}
            </div>
            <div className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-500 mb-1">Start Date</div>
              <div className="font-medium text-gray-900">{formatDate(quiz.startAt)}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-500 mb-1">Duration</div>
              <div className="font-medium text-gray-900">{quiz.duration || 0} minutes</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-500 mb-1">Questions</div>
              <div className="font-medium text-gray-900">{questions.length} questions</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-500 mb-1">Created</div>
              <div className="font-medium text-gray-900">{formatDate(quiz.createdAt)}</div>
            </div>
          </div>
        </div>

        {/* Questions Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Questions</h2>
              <p className="text-sm text-gray-600">Create and manage quiz questions</p>
            </div>
            <button
              onClick={handleAddQuestion}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Question
            </button>
          </div>

          {questions.length === 0 ? (
            <div className="bg-white border border-dashed border-gray-300 rounded-xl p-12 text-center">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Questions Yet</h3>
              <p className="text-gray-600 mb-4">Start by adding your first question to this quiz</p>
              <button
                onClick={handleAddQuestion}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add First Question
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {questions.map((question, index) => (
                <QuestionEditor
                  key={index}
                  question={question}
                  questionIndex={index}
                  onChange={(q) => handleQuestionChange(index, q)}
                  onRemove={() => handleRemoveQuestion(index)}
                  canRemove={questions.length > 0}
                />
              ))}
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        {questions.length > 0 && (
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              onClick={handleAddQuestion}
              className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Another Question
            </button>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                Total: {questions.length} question{questions.length !== 1 ? 's' : ''}
              </span>
              <button
                onClick={handleSaveQuestions}
                disabled={saving || !hasChanges}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-colors ${
                  saving || !hasChanges
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {saving ? 'Saving...' : 'Save All Questions'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
