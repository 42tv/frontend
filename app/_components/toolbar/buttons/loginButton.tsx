'use client';

// import LoginForm from "../../login-form/login-form";
import LoginComponent from "../../login-form/login-form";
import useModalStore from "../../utils/modalStore";

export default function Login() {
    const { openModal } = useModalStore();
    // const handleLogin = (data: any) => {
    //   console.log("로그인 데이터:", data);
    //   setLoginModalOpen(false); // 로그인 완료 후 모달 닫기
    // };
    
    return (
        <div>
            <button 
                className="h-[30px] hover:bg-[#434445] px-2 text-black dark:text-white rounded border-[#69696B] border"
                onClick={() => openModal(<LoginComponent />)}
            >
                로그인
            </button>

            
        </div>
    )
}