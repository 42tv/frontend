'use client';
import LoginComponent from "../../modals/login_component";
import { openModal } from "../../utils/overlay/overlayHelpers";

export default function Login() {
    return (
        <div className="mx-[10px] ">
            <button 
                className="h-[40px] hover:bg-[#434445] px-2 rounded-lg border-[#69696B] border"
                onClick={() => openModal(<LoginComponent />)}
            >
                로그인 / 회원가입
            </button>
        </div>
    );
}
