import { createBrowserRouter, RouterProvider } from "react-router-dom";
import QuizPage from "./components/QuizPage";
import QuizSettings from "./components/QuizSettings";
import LoginPage from "./components/LoginPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import RegisterPage from "./components/RegisterPage";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <QuizSettings />
        </ProtectedRoute>
      ),
    },
    {
      path: "/quiz",
      element: (
        <ProtectedRoute>
          <QuizPage />
        </ProtectedRoute>
      ),
    },
    { path: "/login", element: <LoginPage /> },
    { path: "/register", element: <RegisterPage /> },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
