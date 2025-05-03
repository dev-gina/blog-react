// 아이디 중복 방지 해주기
// 쿼리에서 email 꺼내기
// 검증하기
// user list에서 필터링 하기
// 응답하기

import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!req.query.email || typeof req.query.email !== "string") {
    return res.status(400).json({ error: "이메일이 필요합니다." });
  }

  const email = req.query.email;

  const { data, error } = await supabase.auth.admin.listUsers();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  const user = data?.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());

  if (user) {
    const provider = user.app_metadata?.provider || "email";
    return res.status(200).json({ exists: true, provider });
  }

  return res.status(200).json({ exists: false });
}