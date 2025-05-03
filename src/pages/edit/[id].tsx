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
        router.push("/");
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
  }, [id, session, router]);

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
      <main className="max-w-3xl mx-auto px-6 pt-12 pb-24 text-black space-y-8">
        <h2 className="text-2xl font-light tracking-tight">글 수정</h2>

        <form onSubmit={handleUpdate} className="space-y-6">
          <input
            type="text"
            placeholder="제목"
            className="w-full rounded-md border border-neutral-300 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-black"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            placeholder="내용을 입력하세요"
            className="w-full min-h-[200px] rounded-md border border-neutral-300 px-4 py-3 text-base resize-none focus:outline-none focus:ring-2 focus:ring-black"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-sm rounded-md border border-neutral-300 text-neutral-700 hover:bg-neutral-100"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm rounded-md bg-black text-white hover:bg-neutral-800"
            >
              저장
            </button>
          </div>
        </form>
      </main>
    </Layout>
  );
}