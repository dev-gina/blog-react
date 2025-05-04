import Link from "next/link";
import { ReactNode } from "react";
import { useSession } from "@/hooks/useSession";
import { useAdmin } from "@/hooks/useAdmin";
import { supabase } from "@/lib/supabase"; 
import { useRouter } from "next/router"; 

export default function Layout({ children }: { children: ReactNode }) {
  const { session, loading } = useSession(); 
  const isAdmin = useAdmin(session);  
  const router = useRouter();  

  if (loading) return null; 

  const handleLogout = async () => {
    await supabase.auth.signOut(); 
    router.push("/");  
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-black font-sans">
      <header className="border-b border-neutral-200 bg-white sticky top-0 z-50">
        <div className="mx-auto max-w-3xl px-6 py-4 flex justify-between items-center">
          {/* 왼쪽: 제목 */}
          <h1 className="text-lg font-light tracking-tight font-normal">
            <Link href="/" className="hover:text-neutral-900 transition-colors">
              Blog
            </Link>
          </h1>

          {/* 오른쪽: 메뉴 */}
          <nav className="flex items-center gap-5 text-sm font-normal text-neutral-700">
            <HeaderLink href="/">Home</HeaderLink>

            {session ? (
              <>
                <HeaderLink href="/write">Write</HeaderLink>
                {/* 로그아웃 버튼 */}
                <button
                  onClick={handleLogout}
                  className="hover:text-neutral-900 transition-colors"
                >
                  Logout
                </button>
                {/* 관리자 뱃지 */}
                {isAdmin && (
                  <span className="text-xs text-white bg-black px-3 py-1.5 rounded ml-2">
                    관리자
                  </span>
                )}
              </>
            ) : (
              <>
                <HeaderLink href="/login">Login</HeaderLink>
                <HeaderLink href="/signup">Signup</HeaderLink>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* 본문 */}
      <main className="flex-grow w-full max-w-3xl mx-auto px-6 py-16">
        {children}
      </main>
    </div>
  );
}

type NavLinkProps = {
  href: string;
  children: ReactNode;
};

function HeaderLink({ href, children }: NavLinkProps) {
  return (
    <Link
      href={href}
      className="hover:text-neutral-900 transition-colors"
    >
      {children}
    </Link>
  );
}
