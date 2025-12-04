const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    nome: string;
    email: string;
  };
}

interface RegisterRequest {
  nome: string;
  email: string;
  password: string;
}

export const authApi = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Credenciais inválidas");
    const result = await response.json();
    localStorage.setItem("authToken", result.token);
    localStorage.setItem("user", JSON.stringify(result.user));
    return result;
  },

  async register(data: RegisterRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Erro ao criar conta");
    const result = await response.json();
    localStorage.setItem("authToken", result.token);
    localStorage.setItem("user", JSON.stringify(result.user));
    return result;
  },

  logout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem("authToken");
  },

  getUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};