import React, { useState } from 'react';
import { openModal } from '../utils/overlay/overlayHelpers';
import ErrorMessage from './error_component';
import { login, singUp } from '@/app/_apis/user';
import { useRouter } from 'next/navigation';
import useUserStore from '../utils/store/userStore';
import { overlay } from 'overlay-kit';

export default function LoginComponent() {
  const router = useRouter()
  const { fetchUser } = useUserStore();
  const [activeTab, setActiveTab] = useState('login'); // Track the active tab
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberId, setRememberId] = useState(false);

  // Signup form states
  const [signupUserId, setSignupUserId] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');

  async function handleLogin() {
    try {
      await login(userId, password);
      await fetchUser();
      overlay.closeAll();

      if (!window.location.pathname.startsWith('/live')) {
        router.push('/live');
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch(err: any) {
      openModal(<ErrorMessage message={err?.response?.data?.message} />, { closeButtonSize: "w-[16px] h-[16px]" });
    }
    
  };

  function checkInputValidate(signupUserId: string, signupPassword: string, confirmPassword: string) {
    if (!/^[a-zA-Z0-9]{4,20}$/.test(signupUserId)) {
      console.log("아이디는 4~20자의 영문 대소문자와 숫자로만 입력해주세요.")
      openModal(<ErrorMessage message="아이디는 4~20자의 영문 대소문자와 숫자로만 입력해주세요." />, { closeButtonSize: "w-[16px] h-[16px]" });
      return false;
    }
    console.log(signupPassword)
    if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d!@#$%^&*()_+={}\[\]:;"'<>,.?\/\\|-]{8,}$/.test(signupPassword)) {
      console.log("비밀번호가 조건을 만족하지 않음 (영문, 숫자, 특수문자 포함 최소 8자)")
      openModal(<ErrorMessage message="비밀번호가 조건을 만족하지 않음 (영문, 숫자, 특수문자 포함 최소 8자)" />, { closeButtonSize: "w-[16px] h-[16px]" });
      return false;
    }
    if (signupPassword !== confirmPassword) {
      console.log("비밀번호와 비밀번호 확인이 일치하지 않음")
      openModal(<ErrorMessage message="비밀번호와 비밀번호 확인이 일치하지 않음" />, { closeButtonSize: "w-[16px] h-[16px]" });
      return false;
    }
    return true;
  }

  async function handleSignUp() {
    if (!checkInputValidate(signupUserId, signupPassword, confirmPassword)) {
      return;
    }
    try {
      await singUp(signupUserId, signupPassword, nickname)
      setActiveTab('login');
      openModal(<ErrorMessage message="회원가입이 완료되었습니다." />, { closeButtonSize: "w-[16px] h-[16px]" });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (err: any) {
      openModal(<ErrorMessage message={err?.response?.data?.message} />, { closeButtonSize: "w-[16px] h-[16px]" });
    }
  }


  return (
    <div
      className="max-w-md mx-auto p-5 border rounded-lg border-contentBg bg-contentBg relative text-left" // Added text-left class for left alignment
    >
      {/* Tabs for Login and Signup */}
      <div className="flex border-b border-border mb-4">
        <button
          className={`flex-1 py-2 text-center font-medium ${
            activeTab === 'login'
              ? 'border-b-2 border-primary text-text-primary'
              : 'text-text-secondary hover:text-text-primary'
          }`}
          onClick={() => setActiveTab('login')}
        >
          로그인
        </button>
        <button
          className={`flex-1 py-2 text-center font-medium ${
            activeTab === 'signup'
              ? 'border-b-2 border-primary text-text-primary'
              : 'text-text-secondary hover:text-text-primary'
          }`}
          onClick={() => setActiveTab('signup')}
        >
          회원가입
        </button>
      </div>

      {activeTab === 'login' ? (
        // Login Form
        <div>
          <div className="mb-4">
            <label
              className="block mb-2 text-sm font-medium text-left text-text-secondary"
            >
              아이디
            </label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring border-border bg-input text-text-primary focus:ring-primary"
              placeholder="아이디를 입력하세요"
            />
          </div>

          <div className="mb-4">
            <label
              className="block mb-2 text-sm font-medium text-left text-text-secondary"
            >
              비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleLogin();
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
              onChange={(e) => setRememberId(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="rememberId" className="text-text-secondary">
              아이디 저장
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-2 font-semibold rounded focus:outline-none focus:ring bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary"
            onClick={handleLogin}
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
      ) : (
        // Signup Form
        <div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-text-secondary">
              아이디
            </label>
            <input
              type="text"
              value={signupUserId}
              onChange={(e) => setSignupUserId(e.target.value)}
              className="w-full p-2 border rounded bg-input text-text-primary border-border focus:ring-primary"
              placeholder="아이디를 입력하세요"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-text-secondary">
              비밀번호
            </label>
            <input
              type="password"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              className="w-full p-2 border rounded bg-input text-text-primary border-border focus:ring-primary"
              placeholder="비밀번호를 입력하세요"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-text-secondary">
              비밀번호 확인
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border rounded bg-input text-text-primary border-border focus:ring-primary"
              placeholder="비밀번호를 입력하세요"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-text-secondary">
              닉네임
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full p-2 border rounded bg-input text-text-primary border-border focus:ring-primary"
              placeholder="닉네임을 입력하세요"
            />
          </div>

          {/* Terms and Conditions */}
          <div className="mb-4">
            <div className="mb-2">
              <input
                type="checkbox"
                id="agreeAll"
                onChange={(e) => {
                  const checked = e.target.checked;
                  document.querySelectorAll<HTMLInputElement>('input[name="terms"]').forEach((checkbox) => {
                    checkbox.checked = checked;
                  });
                }}
                className="mr-2"
              />
              <label htmlFor="agreeAll" className="text-text-primary font-semibold">
                전체 동의
              </label>
            </div>
            <div className="pl-4">
              <div className="mb-2">
                <input
                  type="checkbox"
                  name="terms"
                  id="agreeTerms"
                  className="mr-2"
                />
                <label htmlFor="agreeTerms" className="text-text-secondary">
                  [필수] 이용약관 동의
                </label>
              </div>
              <div className="mb-2">
                <input
                  type="checkbox"
                  name="terms"
                  id="agreePrivacy"
                  className="mr-2"
                />
                <label htmlFor="agreePrivacy" className="text-text-secondary">
                  [필수] 개인정보 수집 및 이용 동의
                </label>
              </div>
              <div className="mb-2">
                <input
                  type="checkbox"
                  name="terms"
                  id="agreeDelegate"
                  className="mr-2"
                />
                <label htmlFor="agreeDelegate" className="text-text-secondary">
                  [필수] 개인정보 처리 위탁 동의
                </label>
              </div>
              <div className="mb-2">
                <input
                  type="checkbox"
                  name="terms"
                  id="agreeAge"
                  className="mr-2"
                />
                <label htmlFor="agreeAge" className="text-text-secondary">
                  [필수] 만 14세 이상 동의
                </label>
              </div>
            </div>
          </div>
              
          <button
            type="submit"
            className="w-full py-2 font-semibold rounded focus:outline-none focus:ring bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary"
            onClick={handleSignUp}
          >
            회원가입
          </button>
        </div>
      )}
    </div>
  );
}
