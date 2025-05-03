import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const router = useRouter();
  const hasHandledRef = useRef(false); // 중복 실행 방지시키기

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (hasHandledRef.current || !session) return;
      hasHandledRef.current = true;

      const user = session.user;
      const createdAt = new Date(user.created_at).getTime();
      const now = Date.now();
      const isNewUser = now - createdAt < 60_000;

      if (isNewUser) {
        alert("회원가입이 완료되었습니다! 🎉");
      } else {
        alert("로그인 성공!");
      }

      router.push("/");
    });

    return () => subscription.unsubscribe();
  }, []);

  return <p className="text-center mt-20 text-neutral-500">로그인 처리 중입니다</p>;
}
