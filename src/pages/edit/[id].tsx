import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/hooks/useSession";
import Layout from "@/components/Layout";
import toast from "react-hot-toast";

export default function EditPostPage() {
  const router = useRouter();
  const { id } = router.query;
  const { session } = useSession();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || !session?.user?.id) return;

    const fetchPost = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("title, content, user_id")
        .eq("id", id)
        .single();

      if (error || !data) {
        toast.error("글을 불러올 수 없습니다.");
        return;
      }

      if (data.user_id !== session.user.id) {
        toast.error("수정 권한이 없습니다.");
        router.push(`/post/${id}`);
        return;
      }

      setTitle(data.title);
      setContent(data.content);
      setLoading(false);
    };

    fetchPost();
  }, [id, session]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase
      .from("posts")
      .update({ title, content })
      .eq("id", id);

    if (error) {
      toast.error("수정 실패: " + error.message);
    } else {
      toast.success("수정 완료!");
      router.push(`/post/${id}`);
    }
  };

  if (loading) return <p className="text-center py-10">로딩 중</p>;

  return (
    <Layout>
      <main className="max-w-3xl mx-auto px-6 pt-12 pb-24 text-black">
        <form onSubmit={handleUpdate} className="space-y-6">
          <h2 className="text-xl font-light tracking-tight text-left">글 수정</h2>

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

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-black text-white rounded hover:bg-neutral-800 transition"
            >
              수정하기
            </button>
          </div>
        </form>
      </main>
    </Layout>
  );
}
