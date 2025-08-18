import React from 'react';

interface LoginFormProps {
    userId: string;
    password: string;
    rememberId: boolean;
    onUserIdChange: (value: string) => void;
    onPasswordChange: (value: string) => void;
    onRememberIdChange: (value: boolean) => void;
    onLogin: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
    userId,
    password,
    rememberId,
    onUserIdChange,
    onPasswordChange,
    onRememberIdChange,
    onLogin
}) => {
    return (
        <div>
            <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-left text-text-secondary">
                    아이디
                </label>
                <input
                    type="text"
                    value={userId}
                    onChange={(e) => onUserIdChange(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring border-border bg-input text-text-primary focus:ring-primary"
                    placeholder="아이디를 입력하세요"
                />
            </div>

            <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-left text-text-secondary">
                    비밀번호
                </label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => onPasswordChange(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            onLogin();
                        }
                    }}
                    className="w-full p-2 border rounded focus:outline-none focus:ring border-border bg-input text-text-primary focus:ring-primary"
                    placeholder="비밀번호를 입력하세요"
                />
            </div>

            <div className="mb-4 flex items-center">
                <input
                    type="checkbox"
                    checked={rememberId}
                    onChange={(e) => onRememberIdChange(e.target.checked)}
                    className="mr-2"
                />
                <label htmlFor="rememberId" className="text-text-secondary">
                    아이디 저장
                </label>
            </div>

            <button
                type="submit"
                className="w-full py-2 font-semibold rounded focus:outline-none focus:ring bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary"
                onClick={onLogin}
            >
                로그인
            </button>

            <div className="mt-4 text-center">
                <a href="#" className="mr-4 hover:underline text-primary">
                    아이디 찾기
                </a>
                <a href="#" className="hover:underline text-primary">
                    비밀번호 찾기
                </a>
            </div>
        </div>
    );
};

export default LoginForm;