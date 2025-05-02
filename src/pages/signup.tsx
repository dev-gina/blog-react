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
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      alert("가입 성공! 이메일을 확인해주세요.");
      router.push("/login");
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-6 pt-12 pb-24">
        <form
          onSubmit={handleSignUp}
          className="w-full max-w-sm mx-auto space-y-6"
        >
          <h2 className="text-xl font-light tracking-tight text-left">회원가입</h2>

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
              가입하기
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
