'use client'
// pages/info/index.js
import { useEffect } from 'react';
import { useRouter } from 'next/navigation'

export default function Info() {
    const router = useRouter()
    
  useEffect(() => {
    router.push('/my/gift')
  }, []);

  return (
    <div>
      
    </div>
  ); // 리다이렉트 중이므로 아무것도 렌더링하지 않음
}
