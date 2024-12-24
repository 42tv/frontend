'use client';

import LoginComponent from "../../modals/login-form";
import useModalStore from "../../utils/modalStore";

export default function Login() {
    const { openModal } = useModalStore();

    return (
        <div>
            <button 
                className="h-[30px] hover:bg-[#434445] px-2 text-black dark:text-white rounded border-[#69696B] border"
                onClick={() => openModal(<LoginComponent />)}
            >
                로그인
            </button>
        </div>
    );
}
