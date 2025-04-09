import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuthContext } from "../context/AuthContext";

export const LoginPage = () => {
  const { login } = useAuthContext();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/api/auth/login", { email, password });
      login(response.data.user, response.data.token);
      toast.success("Login successful!");
      navigate("/products");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail) return toast.warning("Please enter your email.");
    try {
      await axios.post("/api/auth/forgot-password", { email: forgotEmail });
      toast.success("Check your email for reset instructions.");
      (document.getElementById("forgot-password-modal") as HTMLInputElement).checked = false;
      setForgotEmail("");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error sending reset email");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="input input-bordered w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="input input-bordered w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex justify-end">
            <label htmlFor="forgot-password-modal" className="text-sm text-violet-500 hover:underline cursor-pointer">
              Forgot password?
            </label>
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>

      {/* Forgot Password Modal */}
      <input type="checkbox" id="forgot-password-modal" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Reset your password</h3>
          <input
            type="email"
            className="input input-bordered w-full"
            placeholder="Enter your email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
          />
          <div className="modal-action">
            <label htmlFor="forgot-password-modal" className="btn">
              Cancel
            </label>
            <button onClick={handleForgotPassword} className="btn btn-primary">
              Send Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
