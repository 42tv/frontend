import React, { useState } from 'react';

interface LoginComponentProps {
  isOpen: boolean;
  onClose: () => void; // Close callback function
}

export default function LoginComponent({ isOpen, onClose }: LoginComponentProps) {
  const [activeTab, setActiveTab] = useState('login'); // Track the active tab
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberId, setRememberId] = useState(false);

  // Signup form states
  const [signupUserId, setSignupUserId] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login:', { userId, password, rememberId });
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Signup:', { signupUserId, signupPassword, confirmPassword });
  };

  if (!isOpen) {
    return null; // Do not render the modal if it is not open
  }

  return (
    <div
      className="max-w-md mx-auto p-5 border rounded-lg border-gray-700 bg-gray-800 relative"
    >
      {/* Close Button */}
      <button
        onClick={onClose} // Close the modal when clicked
        className="absolute top-0 right-0 text-gray-400 hover:text-white w-[32px] h-[32px] text-center text-2xl"
        aria-label="Close"
      >
        &times; {/* X button */}
      </button>

      {/* Tabs for Login and Signup */}
      <div className="flex border-b mb-4">
        <button
          className={`flex-1 py-2 text-center font-medium ${
            activeTab === 'login'
              ? 'border-b-2 border-white text-white'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('login')}
        >
          로그인
        </button>
        <button
          className={`flex-1 py-2 text-center font-medium ${
            activeTab === 'signup'
              ? 'border-b-2 border-white text-white'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('signup')}
        >
          회원가입
        </button>
      </div>

      {activeTab === 'login' ? (
        // Login Form
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="userId"
              className="block mb-2 text-sm font-medium text-left text-gray-300"
            >
              아이디
            </label>
            <input
              type="text"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring border-gray-600 bg-gray-700 text-white focus:ring-blue-500"
              placeholder="아이디를 입력하세요"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-left text-gray-300"
            >
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring border-gray-600 bg-gray-700 text-white focus:ring-blue-500"
              placeholder="비밀번호를 입력하세요"
            />
          </div>

          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="rememberId"
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
        </form>
      ) : (
        // Signup Form
        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <label
              htmlFor="signupUserId"
              className="block mb-2 text-sm font-medium text-left text-gray-300"
            >
              아이디
            </label>
            <input
              type="text"
              id="signupUserId"
              value={signupUserId}
              onChange={(e) => setSignupUserId(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring border-gray-600 bg-gray-700 text-white focus:ring-blue-500"
              placeholder="아이디를 입력하세요"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="signupPassword"
              className="block mb-2 text-sm font-medium text-left text-gray-300"
            >
              비밀번호
            </label>
            <input
              type="password"
              id="signupPassword"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring border-gray-600 bg-gray-700 text-white focus:ring-blue-500"
              placeholder="비밀번호를 입력하세요"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block mb-2 text-sm font-medium text-left text-gray-300"
            >
              비밀번호 확인
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring border-gray-600 bg-gray-700 text-white focus:ring-blue-500"
              placeholder="비밀번호를 다시 입력하세요"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 font-semibold rounded focus:outline-none focus:ring bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
          >
            회원가입
          </button>
        </form>
      )}
    </div>
  );
}
