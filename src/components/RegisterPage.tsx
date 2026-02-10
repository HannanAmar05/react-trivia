import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  UserPlus,
  Mail,
  Lock,
  User,
  AlertCircle,
  ArrowRight,
  EyeClosed,
  Eye,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/auth";
import { useState } from "react";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState({
    pw: false,
    confirmpw: false,
  });
  const handleShowPassword = (key: "pw" | "confirmpw") => {
    setShowPassword((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, "Username must contain at least 3 character")
      .required("Username must be filled"),
    email: Yup.string()
      .email("Email format is invalid")
      .required("Email must be filled"),
    password: Yup.string()
      .min(6, "Password must contain at least 6 character long")
      .required("Password must be filled"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Password doesn't match")
      .required("Password confirmation must be filled"),
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-slate-100 to-blue-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col md:flex-row min-h-162.5">
        {/* KOLOM KIRI: Background Image (Samain sama Login biar konsisten) */}
        <div
          className="hidden md:block md:w-1/2 bg-cover bg-center relative"
          style={{ backgroundImage: "url('/background.png')" }}
        >
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent flex flex-col justify-end p-12 text-white">
            <h3 className="text-3xl font-black uppercase tracking-tighter">
              Join the Quest
            </h3>
            <p className="text-slate-200 font-medium ">
              Knowledge is the only treasure that increases when shared.
            </p>
          </div>
        </div>

        {/* KOLOM KANAN: Form Register */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center overflow-y-auto">
          <div className="mb-6 text-center md:text-left">
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 mx-auto md:mx-0">
              <UserPlus className="text-blue-600" size={28} />
            </div>
            <h2 className="text-4xl font-black text-slate-800 tracking-tight">
              Register
            </h2>
            <p className="text-slate-500 mt-1 font-medium">
              Create your account to start the quiz.
            </p>
          </div>

          <Formik
            initialValues={{
              username: "",
              email: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setStatus }) => {
              try {
                const { confirmPassword, ...userData } = values;
                authService.register({
                  ...userData,
                  id: Date.now().toString(),
                });
                setTimeout(() => navigate("/login"), 500);
              } catch (error: any) {
                setStatus(error.message);
              }
            }}
          >
            {({ status, errors, touched }) => (
              <Form className="space-y-4">
                {status && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-medium">
                    <AlertCircle size={18} /> {status}
                  </div>
                )}

                {/* Username */}
                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <User size={16} /> Username
                  </label>
                  <Field
                    name="username"
                    placeholder="Your username"
                    className={`w-full p-3.5 bg-slate-50 border-2 rounded-2xl outline-none transition-all ${
                      errors.username && touched.username
                        ? "border-red-300"
                        : "border-slate-100 focus:border-indigo-500"
                    }`}
                  />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="text-red-500 text-xs font-bold px-1"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Mail size={16} /> Email
                  </label>
                  <Field
                    name="email"
                    type="email"
                    placeholder="name@email.com"
                    className={`w-full p-3.5 bg-slate-50 border-2 rounded-2xl outline-none transition-all ${
                      errors.email && touched.email
                        ? "border-red-300"
                        : "border-slate-100 focus:border-indigo-500"
                    }`}
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-xs font-bold px-1"
                  />
                </div>

                {/* Password Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <Lock size={16} /> Password
                    </label>
                    <div className="relative">
                      <Field
                        name="password"
                        type={showPassword.pw ? "text" : "password"}
                        placeholder="••••••••"
                        className={`w-full p-3.5 bg-slate-50 border-2 rounded-2xl outline-none transition-all ${
                          errors.password && touched.password
                            ? "border-red-300"
                            : "border-slate-100 focus:border-indigo-500"
                        }`}
                      />
                      <span
                        onClick={() => handleShowPassword("pw")}
                        className="absolute right-4 top-[35%]"
                      >
                        {showPassword.pw ? <Eye /> : <EyeClosed />}
                      </span>
                    </div>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 text-xs font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <Lock size={16} /> Confirm Password
                    </label>
                    <div className="relative">
                      <Field
                        name="confirmPassword"
                        type={showPassword.confirmpw ? "text" : "password"}
                        placeholder="••••••••"
                        className={`w-full p-3.5 bg-slate-50 border-2 rounded-2xl outline-none transition-all ${
                          errors.confirmPassword && touched.confirmPassword
                            ? "border-red-300"
                            : "border-slate-100 focus:border-indigo-500"
                        }`}
                      />
                      <span
                        onClick={() => handleShowPassword("confirmpw")}
                        className="absolute right-4 top-[35%]"
                      >
                        {showPassword.confirmpw ? <Eye /> : <EyeClosed />}
                      </span>
                    </div>
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="text-red-500 text-xs font-bold"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 active:scale-95 group mt-2"
                >
                  Create Account
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>

                <p className="text-center text-slate-500 text-sm mt-4">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-blue-600 font-bold hover:underline"
                  >
                    Login here
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

export default RegisterPage;
