import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // 이메일 중복 확인
      const res = await fetch(`/api/check-user?email=${email}`);
      const data = await res.json();

      if (data.exists) {
        if (data.provider === "google") {
          setError("이 이메일은 Google 계정으로 가입되어 있습니다. Google 로그인을 이용해주세요.");
        } else {
          setError("이미 가입된 이메일입니다. 로그인 해주세요.");
        }
        return;
      }

      const { error } = await supabase.auth.signUp({ email, password });

      if (error) {
        setError(error.message);
      } else {
        // ✅ 회원가입 성공 → 로그인 페이지로 이동
        router.push("/login");
      }
    } catch {
      setError("회원가입 중 오류가 발생했습니다.");
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
        <h2 className="text-2xl font-semibold text-left mb-6">회원가입</h2>

        <form onSubmit={handleSignUp} className="space-y-4">
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
            가입하기
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
          Google 계정으로 가입 / 로그인
        </button>
      </div>
    </Layout>
  );
}
