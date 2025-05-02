import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/hooks/useSession";
import { useAdmin } from "@/hooks/useAdmin";
import Layout from "@/components/Layout";
import toast from "react-hot-toast";

type Post = {
  id: number;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
};

type Comment = {
  id: number;
  content: string;
  created_at: string;
  user_id: string;
  parent_id: number | null;
  email?: string;
};

const PostDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { session, user, loading } = useSession();
  const isAdmin = useAdmin(session); 

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyToId, setReplyToId] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      const { data } = await supabase.from("posts").select("*").eq("id", id).single();
      setPost(data);
      setPageLoading(false);
    };

    const fetchComments = async () => {
      const { data } = await supabase
        .from("comments")
        .select("*")
        .eq("post_id", id)
        .order("created_at", { ascending: true });
      setComments(data || []);
    };

    fetchPost();
    fetchComments();
  }, [id]);

  const refreshComments = async () => {
    const { data } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", id)
      .order("created_at", { ascending: true });
    setComments(data || []);
  };

  const handleDelete = async () => {
    if (!session) {
      toast.error("로그인이 필요합니다.");
      router.push("/login");
      return;
    }
  
    if (!confirm("정말 삭제하시겠습니까?")) return;
  
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) {
      toast.error("삭제 실패: " + error.message);
    } else {
      toast.success("삭제 완료!");
      router.push("/");
    }
  };
  
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !session.user) {
      toast.error("로그인이 필요합니다.");
      router.push("/login");
      return;
    }
  
    if (!newComment.trim()) return;
  
    const { error } = await supabase.from("comments").insert({
      content: newComment,
      post_id: Number(id),
      user_id: session.user.id,
      parent_id: null,
      email: user?.email,
    });
  
    if (error) {
      toast.error("댓글 작성 실패: " + error.message);
    } else {
      toast.success("댓글 작성 완료!");
      setNewComment("");
      await refreshComments();
    }
  };
  
  const handleAddReply = async (e: React.FormEvent, parentId: number) => {
    e.preventDefault();
    if (!session || !session.user) {
      toast.error("로그인이 필요합니다.");
      router.push("/login");
      return;
    }
  
    if (!replyContent.trim()) return;
  
    const { error } = await supabase.from("comments").insert({
      content: replyContent,
      post_id: Number(id),
      user_id: session.user.id,
      parent_id: parentId,
      email: user?.email,
    });
  
    if (error) {
      toast.error("답글 작성 실패: " + error.message);
    } else {
      toast.success("답글 작성 완료!");
      setReplyContent("");
      setReplyToId(null);
      await refreshComments();
    }
  };

  if (pageLoading || loading) return <p className="text-center py-10">로딩 중</p>;
  if (!post) return <p className="text-center py-10">글을 찾을 수 없습니다.</p>;

  const isAuthor = session?.user?.id === post.user_id;
  const isLoggedIn = !!session?.user;
  const canEdit = !loading && isLoggedIn && (isAuthor || isAdmin);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-6 pt-12 pb-24 text-black space-y-12">
        <article className="space-y-6 border-b border-neutral-200 pb-8">
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-light tracking-tight">{post.title}</h1>
            {canEdit && (
              <div className="flex gap-2">
                <button
                  onClick={() => router.push(`/edit/${post.id}`)}
                  className="text-sm px-4 py-2 bg-black text-white rounded hover:bg-neutral-800"
                >
                  수정
                </button>
                <button
                  onClick={handleDelete}
                  className="text-sm px-4 py-2 bg-black text-white rounded hover:bg-neutral-800"
                >
                  삭제
                </button>
              </div>
            )}
          </div>
          <p className="text-sm text-neutral-500">
            {new Date(post.created_at).toLocaleString()}
          </p>
          <div className="whitespace-pre-wrap leading-relaxed text-base text-neutral-800">
            {post.content}
          </div>
        </article>

        <section className="space-y-6">
          <h2 className="text-lg font-light border-b border-neutral-200 pb-2">
            댓글 {comments.length}개
          </h2>

          {session && (
            <form onSubmit={handleAddComment} className="space-y-3">
              <textarea
                className="w-full border border-neutral-200 rounded-md px-4 py-3 text-base resize-none focus:outline-none"
                placeholder="댓글을 입력하세요"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <div className="flex justify-end">
                <button type="submit" className="text-sm px-4 py-2 bg-black text-white rounded hover:bg-neutral-800">
                  댓글 작성
                </button>
              </div>
            </form>
          )}

          {comments
            .filter((c) => c.parent_id === null)
            .map((parent) => (
              <div key={parent.id} className="border border-neutral-200 px-6 py-4 rounded space-y-2">
                <div className="text-sm text-neutral-500">
                  {parent.email ?? parent.user_id.slice(0, 6)} • {new Date(parent.created_at).toLocaleString()}
                </div>
                <p className="text-base text-neutral-800">{parent.content}</p>
                <div className="flex justify-end">
                  <button onClick={() => setReplyToId(parent.id)} className="text-sm text-neutral-600 underline">
                    답글
                  </button>
                </div>

                {replyToId === parent.id && (
                  <form onSubmit={(e) => handleAddReply(e, parent.id)} className="space-y-2 mt-2">
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      className="w-full border border-neutral-200 rounded-md px-3 py-2 text-base resize-none focus:outline-none"
                      placeholder="답글을 입력하세요"
                    />
                    <div className="flex justify-end">
                      <button type="submit" className="text-sm px-4 py-2 bg-black text-white rounded hover:bg-neutral-800">
                        답글 작성
                      </button>
                    </div>
                  </form>
                )}

                {comments
                  .filter((c) => c.parent_id === parent.id)
                  .map((child) => (
                    <div key={child.id} className="mt-4 ml-4 pl-4 border-l border-neutral-200 space-y-1">
                      <div className="text-xs text-neutral-500">
                        {child.email ?? child.user_id.slice(0, 6)} • {new Date(child.created_at).toLocaleString()}
                      </div>
                      <p className="text-sm text-neutral-700">{child.content}</p>
                    </div>
                  ))}
              </div>
            ))}
        </section>
      </div>
    </Layout>
  );
};

export default PostDetailPage;
