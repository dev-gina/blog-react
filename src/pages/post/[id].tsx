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

const buttonStyle =
  "bg-neutral-700 hover:bg-neutral-600 text-white text-xs px-4 py-1.5 rounded-md transition";
const textareaStyle =
  "w-full border border-neutral-300 rounded-md px-4 py-2 text-xs resize-none focus:outline-none focus:ring-2 focus:ring-neutral-400";

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
    if (error) toast.error("삭제 실패: " + error.message);
    else {
      toast.success("삭제 완료!");
      router.push("/");
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
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
    if (error) toast.error("댓글 작성 실패: " + error.message);
    else {
      toast.success("댓글 작성 완료!");
      setNewComment("");
      await refreshComments();
    }
  };

  const handleAddReply = async (e: React.FormEvent, parentId: number) => {
    e.preventDefault();
    if (!session?.user) {
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
    if (error) toast.error("대댓글 작성 실패: " + error.message);
    else {
      toast.success("대댓글 작성 완료!");
      setReplyContent("");
      setReplyToId(null);
      await refreshComments();
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    const confirmed = window.confirm("댓글을 삭제하시겠습니까?");
    if (!confirmed) return;
  
    // 대댓글 삭제
    await supabase.from("comments").delete().eq("parent_id", commentId);
  
    // 그런 다음 부모 댓글 삭제함
    const { error } = await supabase.from("comments").delete().eq("id", commentId);
  
    if (error) {
      toast.error("삭제 실패: " + error.message);
    } else {
      toast.success("삭제 완료!");
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
      <div className="max-w-3xl mx-auto px-6 py-12 space-y-12 text-black">
        <div className="space-y-4 border-b border-neutral-300 pb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>
            {canEdit && (
              <div className="flex gap-2">
                <button onClick={() => router.push(`/edit/${post.id}`)} className={buttonStyle}>수정</button>
                <button onClick={handleDelete} className={buttonStyle}>삭제</button>
              </div>
            )}
          </div>
          <p className="text-sm text-neutral-500">{new Date(post.created_at).toLocaleString()}</p>
          <div className="whitespace-pre-wrap text-base leading-relaxed text-neutral-800">{post.content}</div>
        </div>

        <section className="space-y-6">
          <h2 className="text-xl font-semibold">댓글 {comments.length}개</h2>

          {session && (
            <form onSubmit={handleAddComment} className="space-y-3">
              <textarea
                className={textareaStyle}
                placeholder="댓글을 입력하세요"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <div className="flex justify-end">
                <button type="submit" className={buttonStyle}>댓글 작성</button>
              </div>
            </form>
          )}

          {comments.filter((c) => c.parent_id === null).map((parent) => (
            <div key={parent.id} className="border border-neutral-200 rounded-md p-4 space-y-2 bg-white shadow-sm">
              <div className="flex justify-between text-sm text-neutral-500">
                <span>{parent.email ?? parent.user_id.slice(0, 6)} • {new Date(parent.created_at).toLocaleString()}</span>
                <div className="flex gap-2">
                  <button onClick={() => setReplyToId(parent.id)} className={buttonStyle}>댓글</button>
                  {(session?.user.id === parent.user_id || isAdmin) && (
                    <button onClick={() => handleDeleteComment(parent.id)} className={buttonStyle}>삭제</button>
                  )}
                </div>
              </div>
              <p className="text-sm text-neutral-800 whitespace-pre-wrap">{parent.content}</p>

              {replyToId === parent.id && (
                <form onSubmit={(e) => handleAddReply(e, parent.id)} className="mt-2 space-y-2">
                  <textarea
                    className={textareaStyle}
                    placeholder="댓글을 입력하세요"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                  />
                  <div className="flex justify-end">
                    <button type="submit" className={buttonStyle}>대댓글 작성</button>
                  </div>
                </form>
              )}

              {comments.filter((c) => c.parent_id === parent.id).map((child) => (
                <div key={child.id} className="ml-6 pl-4 border-l-2 border-neutral-200 space-y-1">
                  <div className="flex justify-between text-xs text-neutral-500">
                    <span>{child.email ?? child.user_id.slice(0, 6)} • {new Date(child.created_at).toLocaleString()}</span>
                    {(session?.user.id === child.user_id || isAdmin) && (
                      <button onClick={() => handleDeleteComment(child.id)} className={buttonStyle}>삭제</button>
                    )}
                  </div>
                  <p className="text-sm text-neutral-700 whitespace-pre-wrap">{child.content}</p>
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
