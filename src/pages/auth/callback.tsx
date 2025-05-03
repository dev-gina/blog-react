import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function AuthCallback() {
  const router = useRouter();
  const hasHandledRef = useRef(false);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_, session) => {
      if (hasHandledRef.current || !session) return;
      hasHandledRef.current = true;
  
      const user = session.user;
  
      if (!user.email_confirmed_at) {
        toast.error("이메일 인증이 필요합니다. 메일함을 확인해주세요.");
        await supabase.auth.signOut();
        router.replace("/login");
        return;
      }
  
      toast.success("로그인 성공!");
      router.replace("/");
    });
  
    return () => {
      subscription.unsubscribe();
    };
  }, [router]);  

  return (
    <p className="text-center mt-20 text-neutral-500">
      로그인 처리 중입니다.
    </p>
  );
}
