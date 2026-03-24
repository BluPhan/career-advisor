import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleLogin() {
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      {/* Left panel — hidden on mobile */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-900 via-blue-800 to-gray-900 flex-col justify-between p-12">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            IT Career Advisor
          </h1>
          <p className="text-blue-300 text-sm">
            Your personalised IT career roadmap
          </p>
        </div>

        <div className="space-y-6">
          <Feature
            icon="🎯"
            title="Skill Matching"
            desc="Select your current IT skills and get matched to real careers."
          />
          <Feature
            icon="📊"
            title="Gap Analysis"
            desc="See exactly what skills you need to reach your goal career."
          />
          <Feature
            icon="📚"
            title="Course Recommendations"
            desc="Get curated courses to bridge every skill gap."
          />
        </div>

        <p className="text-blue-400 text-xs">
          Built for IT professionals at every level.
        </p>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile only title */}
          <div className="md:hidden text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-400 mb-2">
              IT Career Advisor
            </h1>
            <p className="text-gray-400 text-sm">
              Your personalised IT career roadmap
            </p>
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
          <p className="text-gray-400 text-sm mb-8">
            Sign in to continue your career journey
          </p>

          {/* Bio card */}
          <div className="bg-blue-600/10 border border-blue-600/30 rounded-xl p-4 mb-6">
            <p className="text-blue-300 text-sm leading-relaxed">
              🚀 Discover your ideal IT career path based on your skills. Take a
              short proficiency quiz, get matched to careers like{" "}
              <span className="text-white font-medium">Data Scientist</span>,{" "}
              <span className="text-white font-medium">DevOps Engineer</span>,
              or{" "}
              <span className="text-white font-medium">Frontend Developer</span>{" "}
              — then see exactly which courses will close your skill gaps.
            </p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 rounded-lg p-3 mb-4 text-sm">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-300 text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="you@email.com"
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-300 text-sm mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="••••••••"
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="text-gray-400 text-center mt-6 text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-400 hover:underline">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div className="flex items-start gap-4">
      <span className="text-2xl">{icon}</span>
      <div>
        <h3 className="text-white font-semibold text-sm">{title}</h3>
        <p className="text-blue-200 text-xs leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

export default Login;
