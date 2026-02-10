import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Home,
  Award,
  BarChart3,
  HelpCircle,
} from "lucide-react";
import type { QuizResultProps } from "../utils/type";

const QuizResult = ({ questions, userAnswers, onReset }: QuizResultProps) => {
  const correctCount = userAnswers.filter(
    (ans, i) => ans === questions[i].correct_answer,
  ).length;

  const totalQuestions = questions.length;
  const skippedCount = questions.filter((_, i) => {
    return !userAnswers[i];
  }).length;
  const wrongCount = totalQuestions - correctCount - skippedCount;
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  console.log("Jumlah Soal:", questions.length);
  console.log("Jumlah Jawaban Masuk:", userAnswers.length);
  console.log("Isi userAnswers:", userAnswers);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-100 p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-3xl bg-white rounded-4xl shadow-2xl shadow-blue-900/10 overflow-hidden border border-white mb-8">
        <div className="bg-blue-600 p-8 text-center text-white relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Award size={120} />
          </div>

          <div className="relative z-10">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-blue-200 mb-2">
              Quiz Results
            </h2>
            <div className="text-7xl font-black mb-2">{percentage}%</div>
            <p className="text-blue-100 font-medium italic">
              {percentage === 100
                ? "Perfect Score! You're a Genius! 🏆"
                : percentage >= 70
                  ? "Great job! Almost there! 🔥"
                  : "Keep learning, practice makes perfect! 💪"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 border-b border-slate-100">
          <div className="p-6 text-center border-r border-slate-100">
            <div className="text-slate-400 text-[10px] font-black uppercase mb-1">
              Correct
            </div>
            <div className="text-2xl font-black text-green-600">
              {correctCount}
            </div>
          </div>
          <div className="p-6 text-center border-r border-slate-100">
            <div className="text-slate-400 text-[10px] font-black uppercase mb-1">
              Wrong
            </div>
            <div className="text-2xl font-black text-red-600">{wrongCount}</div>
          </div>
          <div className="p-6 text-center border-r border-slate-100">
            <div className="text-slate-400 text-[10px] font-black uppercase mb-1">
              Skipped
            </div>
            <div className="text-2xl font-black text-orange-500">
              {skippedCount}
            </div>
          </div>
          <div className="p-6 text-center">
            <div className="text-slate-400 text-[10px] font-black uppercase mb-1">
              Total
            </div>
            <div className="text-2xl font-black text-slate-800">
              {totalQuestions}
            </div>
          </div>
        </div>

        {/* 3. Action Buttons */}
        {/*  */}
        <div className="p-6 bg-slate-50/50 flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => onReset(false)}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-200"
          >
            <RotateCcw size={20} /> Play Again
          </button>
          <button
            onClick={() => onReset(true)}
            className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-slate-200 text-slate-600 font-bold py-4 rounded-2xl hover:bg-slate-50 transition-all active:scale-95"
          >
            <Home size={20} /> Home
          </button>
        </div>
      </div>

      {/* 4. Detailed Review List */}
      <div className="w-full max-w-3xl space-y-6 mb-12">
        <div className="flex items-center gap-3 px-2">
          <BarChart3 className="text-slate-400" size={24} />
          <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">
            Answer Review
          </h3>
        </div>

        {questions.map((q, i) => {
          const isUserCorrect = userAnswers[i] === q.correct_answer;

          return (
            <div
              key={i}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold ${isUserCorrect ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                >
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p
                    className="font-bold text-slate-800 text-lg leading-snug mb-4"
                    dangerouslySetInnerHTML={{ __html: q.question }}
                  />

                  <div className="grid gap-3">
                    {/* User Answer */}
                    <div
                      className={`p-4 rounded-2xl flex items-center justify-between border-2 ${
                        isUserCorrect
                          ? "bg-green-50/50 border-green-100"
                          : "bg-red-50/50 border-red-100"
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase text-slate-400 mb-1">
                          Your Choice
                        </span>
                        <span
                          className={`font-bold ${isUserCorrect ? "text-green-700" : "text-red-700"}`}
                          dangerouslySetInnerHTML={{
                            __html: userAnswers[i] || "Skipped",
                          }}
                        />
                      </div>
                      {isUserCorrect ? (
                        <CheckCircle2 className="text-green-500" />
                      ) : (
                        <XCircle className="text-red-500" />
                      )}
                    </div>

                    {/* Correct Answer (Show only if wrong) */}
                    {!isUserCorrect && (
                      <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 flex flex-col">
                        <span className="text-[10px] font-black uppercase text-slate-400 mb-1">
                          Correct Answer
                        </span>
                        <span
                          className="font-bold text-slate-700"
                          dangerouslySetInnerHTML={{ __html: q.correct_answer }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Hint */}
      <div className="flex items-center gap-2 text-slate-400 pb-8">
        <HelpCircle size={16} />
        <span className="text-xs font-medium italic text-center">
          Data is saved locally. You can refresh anytime.
        </span>
      </div>
    </div>
  );
};

export default QuizResult;
