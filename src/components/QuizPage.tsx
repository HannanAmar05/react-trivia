import { useEffect, useMemo, useState } from "react";
import { Timer, HelpCircle, CheckCircle2, XCircle, BarChart3 } from "lucide-react";
import { useGetQuestions } from "../services/get-quiz";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  type Difficulty,
  type QuestionType,
  type QuizState,
} from "../utils/type";
import QuizResult from "./QuizResult";
import Countdown from "./Countdown";
import NotFound from "./NotFound";

const STORAGE_KEY = "quiz_progress";

const QuizPage = () => {
  const [searchParams] = useSearchParams();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const navigate = useNavigate();
  const [quizState, setQuizState] = useState<QuizState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      currentQuestionIndex: 0,
      userAnswers: [],
      timeLeft: 300,
      isFinished: false,
      isStarted: false,
      savedQuestions: [],
    };
  });
  const [showCountdown, setShowCountdown] = useState(!quizState.isFinished);

  const params = useMemo(
    () => ({
      amount: Number(searchParams.get("amount")),
      category: Number(searchParams.get("category")),
      difficulty: searchParams.get("difficulty") as Difficulty,
      type: searchParams.get("type") as QuestionType,
    }),
    [searchParams],
  );

  const { data: apiQuestions, isPending, isError } = useGetQuestions(params);

  // Menyimpan data question dari API
  useEffect(() => {
    if (apiQuestions && quizState.savedQuestions?.length === 0) {
      setQuizState((prev) => ({ ...prev, savedQuestions: apiQuestions }));
    }
  }, [apiQuestions]);

  const questions = quizState.savedQuestions?.length
    ? quizState.savedQuestions
    : apiQuestions;

  // Quiz state
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quizState));
  }, [quizState]);

  // Timer Logic
  useEffect(() => {
    if (showCountdown || quizState.isFinished || !quizState.isStarted) return;

    if (quizState.timeLeft <= 0) {
      setQuizState((prev) => ({ ...prev, isFinished: true, timeLeft: 0 }));
    }

    const timer = setInterval(() => {
      setQuizState((prev) => {
        if (prev.timeLeft <= 1) {
          clearInterval(timer);
          return { ...prev, timeLeft: 0, isFinished: true };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [quizState.isFinished, showCountdown, quizState.isStarted]);

  const handleAnswerClick = (ans: string) => {
    if (isAnswered) return;
    setSelectedAnswer(ans);
    setIsAnswered(true);

    setTimeout(() => {
      const isLast = quizState.currentQuestionIndex + 1 === questions?.length;

      setQuizState((prev) => ({
        ...prev,
        userAnswers: [...prev.userAnswers, ans],
        currentQuestionIndex: isLast
          ? prev.currentQuestionIndex
          : prev.currentQuestionIndex + 1,
        isFinished: isLast,
      }));
      setSelectedAnswer(null);
      setIsAnswered(false);
    }, 1000);
  };

  const formatTime = (second: number) => {
    const mins = Math.floor(second / 60);
    const sec = second % 60;
    return `${mins.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  if (isPending && !quizState.isFinished) {
      return (
        <div className="min-h-screen bg-linear-to-br from-slate-100 to-blue-50 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-6">
          <div className="w-20 h-20 bg-white rounded-3xl shadow-xl shadow-blue-900/5 flex items-center justify-center border border-white">
            <HelpCircle size={40} className="text-blue-600 animate-pulse" />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              Getting Questions
            </h2>
            <p className="text-slate-500 font-medium mt-1">
              Preparing your quiz experience...
            </p>
          </div>
        </div>
      </div>
    );
  }
  if (isPending && quizState.isFinished ) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-100 to-blue-50 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-6">
          <div className="w-20 h-20 bg-white rounded-3xl shadow-xl shadow-blue-900/5 flex items-center justify-center border border-white">
            <BarChart3 size={40} className="text-green-600 animate-pulse" />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              Getting Results
            </h2>
            <p className="text-slate-500 font-medium mt-1">
              Analyzing your performance...
            </p>
          </div>
        </div>
      </div>
    );
  }
  const handleResetQuiz = (toHome: boolean = false) => {
    if (toHome) {
      localStorage.removeItem(STORAGE_KEY);
      navigate("/");
    } else {
      setQuizState((prev) => ({
        ...prev,
        currentQuestionIndex: 0,
        userAnswers: [],
        timeLeft: 300,
        isFinished: false,
        isStarted: false,
      }));
    }
    setShowCountdown(true);
  };

  if (isError || !questions || questions.length === 0)
    return <NotFound handleResetQuiz={handleResetQuiz} isError={isError} />;

  const handleCountComplete = () => {
    setShowCountdown(false);
    setQuizState((prev) => ({ ...prev, isStarted: true }));
  };

  if (showCountdown) {
    return <Countdown onComplete={handleCountComplete} />;
  }

  if (quizState.isFinished) {
    return (
      <QuizResult
        questions={questions}
        userAnswers={quizState.userAnswers}
        onReset={handleResetQuiz}
      />
    );
  }

  const currentQuestion = questions[quizState.currentQuestionIndex];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-slate-100 to-blue-50 p-4">
      <div className="w-full max-w-3xl">
        {/* Progress & Header */}
        <div className="flex justify-between items-end mb-4 px-2">
          <div>
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {currentQuestion?.category}
            </span>
            <h2 className="text-slate-800 text-lg font-medium mt-2">
              Question{" "}
              <span className="font-bold text-blue-600">
                {quizState.currentQuestionIndex + 1}
              </span>
              <span className="text-slate-400">/{questions.length}</span>
            </h2>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200">
            <Timer size={18} className="text-orange-500" />
            <span className="font-mono font-bold text-slate-700 text-lg">
              {formatTime(quizState.timeLeft)}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 h-2 rounded-full mb-8 overflow-hidden">
          <div
            className="bg-blue-500 h-full transition-all duration-500 ease-out"
            style={{
              width: `${((quizState.currentQuestionIndex + 1) / questions.length) * 100}%`,
            }}
          />
        </div>

        {/* Question Card */}

        <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-white p-8 md:p-12">
          <h1
            dangerouslySetInnerHTML={{ __html: currentQuestion.question }}
            className="text-2xl md:text-3xl font-bold text-slate-800 leading-snug mb-10"
          />

          {/* Options Grid */}
          <div
            className={`grid gap-4 ${
              currentQuestion.type === "boolean" ? "grid-cols-2" : "grid-cols-1"
            }`}
          >
            {currentQuestion.all_answers.map((ans, index) => {
              const isSelected = selectedAnswer === ans;
              const isCorrect = ans === currentQuestion.correct_answer;
              let buttonStyle =
                "border-slate-200 bg-slate-50/50 text-slate-800";
              let labelStyle = "bg-white border-slate-200 text-slate-400";
              if (isAnswered) {
                if (isCorrect) {
                  buttonStyle =
                    "border-green-500 bg-green-50 text-green-700 shadow-md ring-2 ring-green-500/20";
                  labelStyle = "bg-green-500 border-green-500 text-white";
                } else if (!isCorrect && isSelected) {
                  buttonStyle =
                    "border-red-500 bg-red-50 text-red-700 shadow-md ring-2 ring-red-500/20";
                  labelStyle = "bg-red-500 border-red-500 text-white";
                }
              } else if (isSelected) {
                buttonStyle =
                  "border-blue-500 bg-blue-50 text-blue-700 shadow-md ring-2 ring-blue-500/20 ";
                labelStyle = "bg-blue-500 text-white ";
              }
              return (
                <button
                  key={index}
                  disabled={isAnswered}
                  onClick={() => handleAnswerClick(ans)}
                  className={`group flex items-center justify-between p-5 rounded-2xl border-2 transition-all duration-200 text-left ${buttonStyle}
                  ${!isAnswered && !isSelected && "hover:border-blue-300 hover:bg-white hover:shadow-md active:scale-[0.98]"}
                  `}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`w-10 h-10 flex items-center justify-center border-2 rounded-xl font-bold transition-colors ${labelStyle}
                      ${!isAnswered && !isSelected && "group-hover:border-blue-400 group-hover:text-blue-500"}
                      `}
                    >
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span
                      dangerouslySetInnerHTML={{ __html: ans }}
                      className="font-medium text-lg"
                    />
                  </div>
                  <>
                    {isSelected && !isAnswered && (
                      <CheckCircle2 className="text-blue-500" size={24} />
                    )}
                    {isAnswered && isCorrect && (
                      <CheckCircle2
                        className="text-green-600 animate-in zoom-in duration-100"
                        size={24}
                      />
                    )}
                    {isAnswered && isSelected && !isCorrect && (
                      <XCircle
                        className="text-red-600 animate-in zoom-in duration-100 "
                        size={24}
                      />
                    )}
                  </>
                </button>
              );
            })}
          </div>

          {/* Action Footer */}
          <div className="mt-12 flex justify-between items-center">
            <button
              onClick={() => handleResetQuiz(true)}
              className="text-slate-400 font-semibold hover:text-slate-600 transition-colors"
            >
              Quit Quiz
            </button>
          </div>
        </div>

        {/* Fun Fact / Hint Box */}
        <div className="mt-6 flex items-center gap-3 bg-blue-200/50 border-2 border-gray-100 rounded-2xl p-4 text-blue-600">
          <HelpCircle size={20} />
          <p className="text-sm font-medium">
            Take your time, there's no rush for the perfect score!
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
