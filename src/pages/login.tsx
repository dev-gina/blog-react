import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
  
    const { error } = await supabase.auth.signInWithPassword({ email, password });
  
    if (error) {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
    } else {
      router.push("/auth/callback"); 
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      alert("구글 로그인 실패: " + error.message);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto px-6 pt-20 pb-24">
        <h2 className="text-2xl font-semibold text-left mb-6">로그인</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="이메일"
            className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="비밀번호"
            className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="text-sm text-red-500 text-left">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-neutral-800 transition"
          >
            로그인
          </button>
        </form>

        <div className="text-center text-sm text-gray-500 my-6">또는</div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-2 w-full py-2 px-4 border border-gray-300 rounded hover:bg-gray-100 transition text-sm font-medium"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Google 계정으로 로그인
        </button>
      </div>
    </Layout>
  );
}
