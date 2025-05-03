import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase";
import Layout from "@/components/Layout";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); 
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
    } else {
      console.log("선택 입력된 이름:", name);
      alert("가입 확인 메일을 전송했습니다. 이메일을 확인한 후 로그인해주세요.");
      router.replace("/login");
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
      <main className="max-w-md mx-auto px-6 pt-16 pb-24 space-y-8 text-black">
        <h2 className="text-2xl font-light text-center">회원가입</h2>

        <form onSubmit={handleSignUp} className="space-y-4">
          <input
            type="text"
            placeholder="이름(닉네임)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-neutral-300 px-4 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-neutral-300 px-4 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
            required
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-neutral-300 px-4 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
            required
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            className="w-full py-2 bg-black text-white text-sm rounded-md hover:bg-neutral-800"
          >
            가입하기
          </button>
        </form>

        <div className="text-center text-sm text-neutral-500">또는</div>

        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-2 w-full py-2 border border-neutral-300 rounded-md hover:bg-neutral-100 text-sm"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Google로 가입 / 로그인
        </button>

        <p className="text-center text-sm text-neutral-500 mt-4">
          이미 계정이 있으신가요?{" "}
          <a href="/login" className="underline text-black">
            로그인
          </a>
        </p>
      </main>
    </Layout>
  );
}
