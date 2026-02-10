import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  LogIn,
  Mail,
  Lock,
  AlertCircle,
  ArrowRight,
  EyeClosed,
  Eye,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/auth";
import { useState } from "react";

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Email format is invalid")
      .required("Email must be filled"),
    password: Yup.string()
      .min(6, "Password must contain at least 6 character")
      .required("Password must be filled"),
  });

  const handleShowPassword = () => [setShowPassword((prev) => !prev)];

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-slate-100 to-blue-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col md:flex-row min-h-162.5 ">
        {/* KOLOM KIRI: Full Background Image */}
        <div
          className="hidden md:block md:w-1/2 bg-cover bg-center relative"
          style={{ backgroundImage: "url('/background.png')" }} // Pastikan file ada di folder /public
        >
          {/* Overlay Gelap dikit biar kalau ada text tetep kebaca */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent flex flex-col justify-end p-12 text-white">
            <h3 className="text-3xl font-black uppercase tracking-tighter">
              The Ultimate Quiz
            </h3>
            <p className="text-slate-200 font-medium">
              Challenge your brain and reach the top of the leaderboard.
            </p>
          </div>
        </div>

        {/* KOLOM KANAN: Form Login */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-10 text-center md:text-left">
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 mx-auto md:mx-0">
              <LogIn className="text-blue-600" size={28} />
            </div>
            <h2 className="text-4xl font-black text-slate-800 tracking-tight">
              Login
            </h2>
            <p className="text-slate-500 mt-2 font-medium">
              Welcome back, please login to your account.
            </p>
          </div>

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={(values, { setStatus }) => {
              try {
                authService.login(values);
                navigate("/");
              } catch (error: any) {
                setStatus(error.message);
              }
            }}
          >
            {({ status, errors, touched }) => (
              <Form className="space-y-6">
                {status && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-medium">
                    <AlertCircle size={18} /> {status}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Mail size={16} /> Email
                  </label>
                  <Field
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className={`w-full p-4 bg-slate-50 border-2 rounded-2xl outline-none transition-all ${
                      errors.email && touched.email
                        ? "border-red-300 focus:border-red-500"
                        : "border-slate-100 focus:border-blue-500"
                    }`}
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-xs font-bold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Lock size={16} /> Password
                  </label>
                  <div className="relative">
                    <Field
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className={`w-full p-4 bg-slate-50 border-2 rounded-2xl outline-none transition-all ${
                        errors.password && touched.password
                          ? "border-red-300 focus:border-red-500"
                          : "border-slate-100 focus:border-blue-500"
                      }`}
                    />
                    <span className="absolute right-4 top-[35%]">
                      {showPassword ? (
                        <Eye onClick={handleShowPassword} />
                      ) : (
                        <EyeClosed onClick={handleShowPassword} />
                      )}
                    </span>
                  </div>

                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-xs font-bold"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 active:scale-95 group"
                >
                  Sign In
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>

                <p className="text-center text-slate-500 text-sm mt-8">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-blue-600 font-bold hover:underline"
                  >
                    Create account
                  </Link>
                </p>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
