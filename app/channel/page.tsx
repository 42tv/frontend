"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const ChannelPage = () => {
  const router = useRouter();
  
  useEffect(() => {
    router.replace("/channel/my/bjNotice");
  }, [router]);
  
  return <div>Redirecting...</div>;
};

export default ChannelPage;
