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
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
    } else {
      alert("로그인 성공");
      router.push("/");
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-6 pt-12 pb-24">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm mx-auto space-y-6"
        >
          <h2 className="text-xl font-light tracking-tight text-left">로그인</h2>

          <input
            type="email"
            placeholder="이메일"
            className="w-full border-b border-neutral-300 bg-transparent focus:outline-none text-base py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="비밀번호"
            className="w-full border-b border-neutral-300 bg-transparent focus:outline-none text-base py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="text-red-500 text-sm text-left">
              {error}
            </p>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-black text-white rounded hover:bg-neutral-800 transition"
            >
              로그인
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}