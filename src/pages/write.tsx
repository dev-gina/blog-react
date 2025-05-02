import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/hooks/useSession";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";

export default function WritePage() {
  const { session } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      alert("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    const { error } = await supabase.from("posts").insert([
      {
        title,
        content,
        user_id: session.user.id,
      },
    ]);

    if (error) {
      setError(error.message);
    } else {
      alert("글 작성 완료");
      router.push("/");
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-6 pt-12 pb-24">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xl mx-auto space-y-6"
        >
          <h2 className="text-xl font-light tracking-tight text-left">글 작성</h2>

          <input
            type="text"
            placeholder="제목"
            className="w-full border-b border-neutral-300 bg-transparent focus:outline-none text-base py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            placeholder="내용"
            className="w-full border border-neutral-200 bg-transparent rounded-md focus:outline-none text-base py-3 px-4 min-h-[200px] resize-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>

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
              작성하기
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}