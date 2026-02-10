import { ErrorMessage, Field, Form, Formik } from "formik";
import { useGetCategories } from "../services/get-categories";
import type { Category } from "../utils/type";
import * as Yup from "yup";
import {
  Settings,
  HelpCircle,
  Layers,
  Cpu,
  PlayCircle,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

const QuizSettings = () => {
  const { data: categories, isLoading } = useGetCategories();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    amount: Yup.number()
      .min(10, "Jumlah soal minimal 10")
      .max(50, "Jumlah soal tidak boleh lebih dari 50")
      .required("Jumlah soal harus diisi"),
    category: Yup.string().required("Pilih salah satu kategori quiz"),
    difficulty: Yup.string(),
    type: Yup.string(),
  });

  const initialValues = {
    amount: 10,
    category: "",
    difficulty: "",
    type: "",
  };

  return (
    <>
      <Header />
      <div className="flex items-center justify-center h-screen bg-linear-to-br from-slate-100 to-blue-50 p-4">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(value) => {
            const searchParams = new URLSearchParams(value as any).toString();
            navigate(`/quiz?${searchParams}`);
          }}
        >
          {({ errors, touched }) => (
            <Form className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl flex flex-col w-full max-w-xl overflow-hidden border border-white">
              {/* Header Section */}
              <div className="bg-blue-600 p-6 text-white flex items-center gap-3">
                <Settings className="animate-spin-slow" size={28} />
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">
                    Quiz Configuration
                  </h2>
                  <p className="text-blue-100 text-sm">
                    Customize your challenge before you start
                  </p>
                </div>
              </div>

              <div className="p-8 flex flex-col gap-6">
                {/* Number of Questions */}
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                    <HelpCircle size={18} /> Number of Questions
                  </label>
                  <Field
                    name="amount"
                    placeholder="Masukkan Jumlah soal pada quiz contoh: 10"
                    type="number"
                    className={`w-full border-2 mb-2 rounded-xl p-3 outline-none transition-all bg-gray-50/50 ${
                      errors.amount && touched.amount
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-100 focus:border-blue-500"
                    }`}
                  />
                  <ErrorMessage name="amount">
                    {(msg) => (
                      <div className="flex items-center gap-1 text-red-500 text-xs font-medium">
                        <AlertCircle size={16} /> {msg}
                      </div>
                    )}
                  </ErrorMessage>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Category */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <Layers size={18} /> Category
                    </label>
                    <Field
                      as="select"
                      name="category"
                      className={`w-full border-2 mb-2 rounded-xl p-3 outline-none transition-all bg-gray-50/50 ${
                        errors.category && touched.category
                          ? "border-red-300 focus:border-red-500"
                          : "border-gray-100 focus:border-blue-500"
                      }`}
                    >
                      <option value="">Any Category</option>
                      {isLoading ? (
                        <option disabled>Loading categories...</option>
                      ) : (
                        categories?.map((cat: Category) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))
                      )}
                    </Field>
                    <ErrorMessage name="category">
                      {(msg) => (
                        <div className="flex items-center gap-1 text-red-500 text-xs font-medium">
                          <AlertCircle size={16} /> {msg}
                        </div>
                      )}
                    </ErrorMessage>
                  </div>

                  {/* Difficulty */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <Cpu size={18} /> Difficulty
                    </label>
                    <Field
                      as="select"
                      name="difficulty"
                      className="w-full border-2 border-gray-100 rounded-xl p-3 outline-none focus:border-blue-500 transition-all bg-gray-50/50 appearance-none cursor-pointer"
                    >
                      <option value="">Any Difficulty</option>
                      <option value="easy">🟢 Easy</option>
                      <option value="medium">🟡 Medium</option>
                      <option value="hard">🔴 Hard</option>
                    </Field>
                  </div>
                </div>

                {/* Type */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <PlayCircle size={18} /> Question Type
                  </label>
                  <Field
                    as="select"
                    name="type"
                    className="w-full border-2 border-gray-100 rounded-xl p-3 outline-none focus:border-blue-500 transition-all bg-gray-50/50 appearance-none cursor-pointer"
                  >
                    <option value="">Any Type</option>
                    <option value="multiple">Multiple Choice</option>
                    <option value="boolean">True / False</option>
                  </Field>
                </div>

                {/* Submit Button */}
                <div className="mt-4">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 hover:shadow-blue-300 transForm hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-lg">
                    Start Quiz
                  </button>
                  <p className="text-center text-gray-400 text-xs mt-4 uppercase tracking-widest font-medium">
                    Powered by Open Trivia DB
                  </p>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default QuizSettings;
