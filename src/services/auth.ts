import type { User } from "../utils/type";

const USERS_KEY = "quiz_users";
const SESSION_KEY = "user_session";

export const authService = {
  register: (newUser: User) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    const isExist = users.find((u: User) => u.email === newUser.email);

    if (isExist) throw new Error("Email sudah terdaftar!");

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  login: (credentials: Pick<User, "email" | "password">) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    const user = users.find(
      (u: User) =>
        u.email === credentials.email && u.password === credentials.password,
    );

    if (!user) throw new Error("Email atau password salah!");

    // Simpan session (data user yang login)
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  getCurrentUser: (): User | null => {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  },
};
