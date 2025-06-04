import React, { useState } from 'react';
import errorModalStore from '../utils/store/errorModalStore';
import ErrorMessage from './error_component';
import { login, singUp } from '@/app/_apis/user';
import { useRouter } from 'next/navigation';
import useModalStore from '../utils/store/modalStore';
import useUserStore from '../utils/store/userStore';

export default function LoginComponent() {
  const router = useRouter()
  const { closeModal } = useModalStore();
  const { fetchUser } = useUserStore();
  const { openError } = errorModalStore();
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
      closeModal();

      if (!window.location.pathname.startsWith('/live')) {
        router.push('/live');
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch(err: any) {
      openError(<ErrorMessage message={err?.response?.data?.message} />);
    }
    
  };

  function checkInputValidate(signupUserId: string, signupPassword: string, confirmPassword: string) {
    if (!/^[a-zA-Z0-9]{4,20}$/.test(signupUserId)) {
      console.log("아이디는 4~20자의 영문 대소문자와 숫자로만 입력해주세요.")
      openError(<ErrorMessage message="아이디는 4~20자의 영문 대소문자와 숫자로만 입력해주세요." />);
      return false;
    }
    console.log(signupPassword)
    if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d!@#$%^&*()_+={}\[\]:;"'<>,.?\/\\|-]{8,}$/.test(signupPassword)) {
      console.log("비밀번호가 조건을 만족하지 않음 (영문, 숫자, 특수문자 포함 최소 8자)")
      openError(<ErrorMessage message="비밀번호가 조건을 만족하지 않음 (영문, 숫자, 특수문자 포함 최소 8자)" />);
      return false;
    }
    if (signupPassword !== confirmPassword) {
      console.log("비밀번호와 비밀번호 확인이 일치하지 않음")
      openError(<ErrorMessage message="비밀번호와 비밀번호 확인이 일치하지 않음" />);
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
      openError(<ErrorMessage message="회원가입이 완료되었습니다." />);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (err: any) {
      openError(<ErrorMessage message={err?.response?.data?.message} />);
    }
  }


  return (
    <div
      className="max-w-md mx-auto p-5 border rounded-lg border-contentBg bg-contentBg relative text-left" // Added text-left class for left alignment
    >
      {/* Tabs for Login and Signup */}
      <div className="flex border-b mb-4">
        <button
          className={`flex-1 py-2 text-center font-medium ${
            activeTab === 'login'
              ? 'border-b-2 border-white text-white'
              : 'text-gray-500 hover:text-white'
          }`}
          onClick={() => setActiveTab('login')}
        >
          로그인
        </button>
        <button
          className={`flex-1 py-2 text-center font-medium ${
            activeTab === 'signup'
              ? 'border-b-2 border-white text-white'
              : 'text-gray-500 hover:text-white'
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
              className="block mb-2 text-sm font-medium text-left text-gray-300"
            >
              아이디
            </label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring border-gray-600 bg-gray-700 text-white focus:ring-blue-500"
              placeholder="아이디를 입력하세요"
            />
          </div>

          <div className="mb-4">
            <label
              className="block mb-2 text-sm font-medium text-left text-gray-300"
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
              className="w-full p-2 border rounded focus:outline-none focus:ring border-gray-600 bg-gray-700 text-white focus:ring-blue-500"
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
            <label htmlFor="rememberId" className="text-gray-300">
              아이디 저장
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-2 font-semibold rounded focus:outline-none focus:ring bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
            onClick={handleLogin}
          >
            로그인
          </button>

          <div className="mt-4 text-center">
            <a href="#" className="mr-4 hover:underline text-blue-400">
              아이디 찾기
            </a>
            <a href="#" className="hover:underline text-blue-400">
              비밀번호 찾기
            </a>
          </div>
        </div>
      ) : (
        // Signup Form
        <div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-300">
              아이디
            </label>
            <input
              type="text"
              value={signupUserId}
              onChange={(e) => setSignupUserId(e.target.value)}
              className="w-full p-2 border rounded bg-gray-700 text-white border-gray-600 focus:ring-blue-500"
              placeholder="아이디를 입력하세요"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-300">
              비밀번호
            </label>
            <input
              type="password"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              className="w-full p-2 border rounded bg-gray-700 text-white border-gray-600 focus:ring-blue-500"
              placeholder="비밀번호를 입력하세요"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-300">
              비밀번호 확인
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border rounded bg-gray-700 text-white border-gray-600 focus:ring-blue-500"
              placeholder="비밀번호를 입력하세요"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-300">
              닉네임
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full p-2 border rounded bg-gray-700 text-white border-gray-600 focus:ring-blue-500"
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
              <label htmlFor="agreeAll" className="text-gray-300 font-semibold">
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
                <label htmlFor="agreeTerms" className="text-gray-300">
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
                <label htmlFor="agreePrivacy" className="text-gray-300">
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
                <label htmlFor="agreeDelegate" className="text-gray-300">
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
                <label htmlFor="agreeAge" className="text-gray-300">
                  [필수] 만 14세 이상 동의
                </label>
              </div>
            </div>
          </div>
              
          <button
            type="submit"
            className="w-full py-2 font-semibold rounded focus:outline-none focus:ring bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
            onClick={handleSignUp}
          >
            회원가입
          </button>
        </div>
      )}
    </div>
  );
}
