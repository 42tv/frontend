import { useState } from 'react';
import { login, singUp, SignUpAgreements } from '@/app/_apis/user';
import { useRouter } from 'next/navigation';
import { useUserStore } from "@/app/_lib/stores";
import { overlay } from 'overlay-kit';

export const useLoginForm = () => {
    const router = useRouter();
    const { fetchUser } = useUserStore();
    
    // Login form states
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [rememberId, setRememberId] = useState(false);

    // Signup form states
    const [signupUserId, setSignupUserId] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [agreements, setAgreements] = useState<SignUpAgreements>({
        termsAgreed: false,
        privacyAgreed: false,
        isOver14: false,
    });

    const handleLogin = async () => {
        try {
            await login(userId, password);
            await fetchUser();
            overlay.closeAll();

            if (!window.location.pathname.startsWith('/live')) {
                router.push('/live');
            }
            return { success: true };
        } catch (err: unknown) {
            return { error: (err as { response?: { data?: { message?: string } } })?.response?.data?.message || '로그인에 실패했습니다.' };
        }
    };

    const checkInputValidate = (signupUserId: string, signupPassword: string, confirmPassword: string) => {
        if (!/^[a-zA-Z0-9]{4,20}$/.test(signupUserId)) {
            return { error: "아이디는 4~20자의 영문 대소문자와 숫자로만 입력해주세요." };
        }
        
        if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d!@#$%^&*()_+={}\[\]:;"'<>,.?\/\\|-]{8,}$/.test(signupPassword)) {
            return { error: "비밀번호가 조건을 만족하지 않음 (영문, 숫자, 특수문자 포함 최소 8자)" };
        }
        
        if (signupPassword !== confirmPassword) {
            return { error: "비밀번호와 비밀번호 확인이 일치하지 않음" };
        }
        
        return { success: true };
    };

    const handleSignUp = async () => {
        const validation = checkInputValidate(signupUserId, signupPassword, confirmPassword);
        if (!validation.success) {
            return validation;
        }

        if (!agreements.termsAgreed || !agreements.privacyAgreed || !agreements.isOver14) {
            return { error: '필수 약관에 모두 동의해야 가입할 수 있습니다.' };
        }

        try {
            await singUp(signupUserId, signupPassword, nickname, agreements);
            return { success: true, message: "회원가입이 완료되었습니다." };
        } catch (err: unknown) {
            // 검증 실패 시 message가 class-validator 문자열 배열로 내려올 수 있음
            const message = (err as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message;
            const errorMessage: string | undefined = Array.isArray(message) ? message.join('\n') : message;
            return { error: errorMessage || '회원가입에 실패했습니다.' };
        }
    };

    return {
        // Login states
        userId,
        password,
        rememberId,
        setUserId,
        setPassword,
        setRememberId,
        
        // Signup states
        signupUserId,
        signupPassword,
        confirmPassword,
        nickname,
        agreements,
        setSignupUserId,
        setSignupPassword,
        setConfirmPassword,
        setNickname,
        setAgreements,

        // Actions
        handleLogin,
        handleSignUp
    };
};