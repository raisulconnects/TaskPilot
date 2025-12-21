import { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, loading, error } = useAuthContext();

  const submitHander = async (e) => {
    e.preventDefault();
    console.log("Login Button Pressed!");
    console.log(email, password);

    await login(email, password);

    setEmail("");
    setPassword("");
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-gray-800 to-black">
      {/* Card */}
      <div className="w-full max-w-md rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl p-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-white tracking-tight">
            Welcome Back
          </h1>
          <p className="text-gray-400 mt-2 text-sm">
            Login to continue to TaskPilot
          </p>
        </div>

        {/* Form */}
        <form onSubmit={submitHander} className="space-y-5">
          {/* Email */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="email"
              className="text-sm text-gray-300 font-medium"
            >
              Email
            </label>
            <input
              required={true}
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              id="email"
              placeholder="you@example.com"
              className="w-full rounded-xl bg-gray-900/70 border border-gray-700 px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="password"
              className="text-sm text-gray-300 font-medium"
            >
              Password
            </label>
            <input
              required={true}
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              id="password"
              placeholder="••••••••"
              className="w-full rounded-xl bg-gray-900/70 border border-gray-700 px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-2">
            {error && <p className="text-white text-center">{error}</p>}
            <button
              type="submit"
              className="w-full rounded-xl bg-amber-400 text-gray-900 font-semibold py-2.5 hover:bg-amber-300 active:scale-[0.98] transition"
              disabled={loading}
            >
              Login
            </button>

            <button
              type="reset"
              onClick={() => {
                setEmail("");
                setPassword("");
              }}
              className="w-full rounded-xl border border-gray-700 text-gray-300 py-2.5 hover:bg-gray-800 transition"
            >
              Clear
            </button>
          </div>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-400 mt-6">
          TaskPilot EMS - Internal Use Only
        </p>
      </div>
    </div>
  );
}
