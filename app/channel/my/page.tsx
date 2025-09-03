"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ChannelMyDefaultPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace("/channel/my/article");
  }, [router]);
  
  return <div>Redirecting...</div>;
}
