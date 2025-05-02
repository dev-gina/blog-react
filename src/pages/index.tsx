import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/hooks/useSession";
import { useAdmin } from "@/hooks/useAdmin";
import Layout from "@/components/Layout";
import styles from "@/styles/Home.module.css";

type Post = {
  id: number;
  title: string;
  content?: string;
  created_at: string;
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { session, loading: sessionLoading } = useSession();
  const isAdmin = useAdmin(session);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      let query = supabase
        .from("posts")
        .select("id, title, content, created_at")
        .order("created_at", { ascending: false });

      if (searchTerm.trim()) {
        query = query.or(
          `title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`
        );
      }

      const { data, error } = await query;

      if (error) {
        console.error("게시물 조회 실패:", error);
      } else {
        setPosts(data || []);
      }

      setLoading(false);
    };

    fetchPosts();
  }, [searchTerm]);

  const handleDelete = async (postId: number) => {
    if (!session) {
      alert("로그인이 필요합니다.");
      return;
    }

    const confirmDelete = window.confirm("정말 이 글을 삭제하시겠습니까?");
    if (!confirmDelete) return;

    const { error } = await supabase.from("posts").delete().eq("id", postId);

    if (error) {
      alert("삭제 실패: " + error.message);
    } else {
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    }
  };

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.headerRow}>
          <h1 className={styles.heading}>공지사항</h1>
          {!sessionLoading && isAdmin && (
            <Link href="/write" className={styles.writeButton}>
              글 작성
            </Link>
          )}
        </div>

        <div className={styles.searchBox}>
          <input
            className={styles.searchInput}
            placeholder="검색어를 입력하세요"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className={styles.searchButton}>검색</button>
        </div>

        {loading ? (
          <div className={styles.loadingText}>불러오는 중</div>
        ) : (
          <ul className={styles.postList}>
            {posts.map((post) => (
              <li key={post.id} className={styles.postItem}>
                <div className={styles.postContent}>
                  <Link href={`/post/${post.id}`} className={styles.postTitle}>
                    {post.title}
                  </Link>
                  <span className={styles.postMeta}>
                    {new Date(post.created_at).toLocaleString()}
                  </span>
                </div>
                {!sessionLoading && isAdmin && (
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDelete(post.id)}
                  >
                    삭제
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}
