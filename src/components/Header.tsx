import { useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import { authService } from "../services/auth";

const Header = () => {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout(); 
    navigate("/login");
  };

  return (
    <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-100 py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-50">
      {/* Brand / Logo */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <div className="bg-blue-600 flex items-center p-1 rounded-lg text-white w-12">
          <img src="/image1.png" alt="logo"/>
        </div>
        <h1 className="text:lg sm:text-xl font-black text-slate-800 tracking-tight ">
          QUIZ<span className="text-blue-600">APP</span>
        </h1>
      </div>

      {/* User Info & Action */}
      <div className="flex items-center gap-4">
        <div className="flex-col items-end flex">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Logged in as
          </span>
          <span className="text-sm font-bold text-slate-700">
            {currentUser?.username || "Guest"}
          </span>
        </div>

        <div className="hidden h-10 w-10 bg-slate-100 rounded-full md:flex items-center justify-center border-2 border-white shadow-sm">
          <User size={20} className="text-slate-500" />
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl text-sm font-bold transition-all active:scale-95 group"
        >
          <LogOut
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
