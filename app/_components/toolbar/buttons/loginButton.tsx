'use client';

import React from "react";
import Modal from "../../utils/modal";
// import LoginForm from "../../login-form/login-form";
import LoginComponent from "../../login-form/login-form";

export default function Login() {
    const [loginModalOpen, setLoginModalOpen] = React.useState(false);
    // const handleLogin = (data: any) => {
    //   console.log("로그인 데이터:", data);
    //   setLoginModalOpen(false); // 로그인 완료 후 모달 닫기
    // };
    
    return (
        <div>
            <button 
                className="h-[30px] hover:bg-[#434445] px-2 text-black dark:text-white rounded border-[#69696B] border"
                onClick={() => setLoginModalOpen(!loginModalOpen)}
            >
                로그인
            </button>
            {
                loginModalOpen && (
                    <Modal isOpen={loginModalOpen}>
                        <LoginComponent isOpen={loginModalOpen}  onClose={() => setLoginModalOpen(false)}/>
                    </Modal>
                )
            }

            
        </div>
    )
}