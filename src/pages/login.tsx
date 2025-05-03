import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase";
import Layout from "@/components/Layout";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
    } else if (!data.user?.email_confirmed_at) {
      setError("이메일을 아직 인증하지 않으셨습니다. 메일함을 확인해주세요.");
      await supabase.auth.signOut();
    } else {
      router.push("/");
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
        <h2 className="text-2xl font-light text-center">로그인</h2>

        <form onSubmit={handleLogin} className="space-y-4">
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
            로그인
          </button>
        </form>

        <div className="text-center text-sm text-neutral-500">또는</div>

        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-2 w-full py-2 border border-neutral-300 rounded-md hover:bg-neutral-100 text-sm"
        >
          <Image
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            width={20}
            height={20}
          />
          Google로 로그인
        </button>

        <p className="text-center text-sm text-neutral-500 mt-4">
          아직 계정이 없으신가요?{" "}
          <Link href="/signup" className="underline text-black">
            회원가입
          </Link>
        </p>
      </main>
    </Layout>
  );
}
