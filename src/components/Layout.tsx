import Link from "next/link";
import { ReactNode } from "react";
import { useSession } from "@/hooks/useSession";

export default function Layout({ children }: { children: ReactNode }) {
  useSession();

  return (
    <div className="min-h-screen flex flex-col bg-white text-black font-sans">
      <header className="border-b border-neutral-200 bg-white sticky top-0 z-50">
        <div className="mx-auto max-w-3xl px-6 py-4 flex justify-between items-center">
          {/* 왼쪽: 로고 */}
          <h1 className="text-lg font-light tracking-tight font-normal">Blog</h1>

          {/* 오른쪽: 네비게이션 */}
          <nav className="flex gap-5 text-sm font-normal text-neutral-700">
            <HeaderLink href="/">Home</HeaderLink>
            <HeaderLink href="/write">Write</HeaderLink>
            <HeaderLink href="/login">Login</HeaderLink>
            <HeaderLink href="/signup">Signup</HeaderLink>
          </nav>
        </div>
      </header>

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
