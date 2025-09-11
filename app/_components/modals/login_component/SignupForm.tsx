import React from 'react';
import TermsAgreement from './TermsAgreement';

interface SignupFormProps {
    signupUserId: string;
    signupPassword: string;
    confirmPassword: string;
    nickname: string;
    onSignupUserIdChange: (value: string) => void;
    onSignupPasswordChange: (value: string) => void;
    onConfirmPasswordChange: (value: string) => void;
    onNicknameChange: (value: string) => void;
    onSignup: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({
    signupUserId,
    signupPassword,
    confirmPassword,
    nickname,
    onSignupUserIdChange,
    onSignupPasswordChange,
    onConfirmPasswordChange,
    onNicknameChange,
    onSignup
}) => {
    return (
        <div>
            <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-text-200">
                    아이디
                </label>
                <input
                    type="text"
                    value={signupUserId}
                    onChange={(e) => onSignupUserIdChange(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 border-bg-300 bg-bg-300 text-text-100 focus:ring-primary-100"
                    placeholder="아이디를 입력하세요"
                />
            </div>

            <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-text-200">
                    비밀번호
                </label>
                <input
                    type="password"
                    value={signupPassword}
                    onChange={(e) => onSignupPasswordChange(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 border-bg-300 bg-bg-300 text-text-100 focus:ring-primary-100"
                    placeholder="비밀번호를 입력하세요"
                />
            </div>

            <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-text-200">
                    비밀번호 확인
                </label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => onConfirmPasswordChange(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 border-bg-300 bg-bg-300 text-text-100 focus:ring-primary-100"
                    placeholder="비밀번호를 입력하세요"
                />
            </div>

            <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-text-200">
                    닉네임
                </label>
                <input
                    type="text"
                    value={nickname}
                    onChange={(e) => onNicknameChange(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 border-bg-300 bg-bg-300 text-text-100 focus:ring-primary-100"
                    placeholder="닉네임을 입력하세요"
                />
            </div>

            <TermsAgreement />
                
            <button
                type="submit"
                className="w-full py-2 font-semibold rounded focus:outline-none focus:ring bg-primary-100 text-text-100 hover:bg-primary-200 focus:ring-primary-100 transition-colors"
                onClick={onSignup}
            >
                회원가입
            </button>
        </div>
    );
};

export default SignupForm;