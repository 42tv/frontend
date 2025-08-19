import React, { useState } from 'react';
import { openModal } from '../utils/overlay/overlayHelpers';
import ErrorMessage from './error_component';
import { useLoginForm } from './login_component/useLoginForm';
import TabNavigation from './login_component/TabNavigation';
import LoginForm from './login_component/LoginForm';
import SignupForm from './login_component/SignupForm';

export default function LoginComponent() {
    const [activeTab, setActiveTab] = useState('login');
    
    const {
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
        setSignupUserId,
        setSignupPassword,
        setConfirmPassword,
        setNickname,
        
        // Actions
        handleLogin,
        handleSignUp
    } = useLoginForm();

    const handleLoginWithErrorHandling = async () => {
        const result = await handleLogin();
        if (result.error) {
            openModal(<ErrorMessage message={result.error} />, { closeButtonSize: "w-[16px] h-[16px]" });
        }
    };

    const handleSignUpWithErrorHandling = async () => {
        const result = await handleSignUp();
        if ('error' in result && result.error) {
            openModal(<ErrorMessage message={result.error} />, { closeButtonSize: "w-[16px] h-[16px]" });
        } else if ('success' in result && result.success) {
            setActiveTab('login');
            if ('message' in result && result.message) {
                openModal(<ErrorMessage message={result.message} />, { closeButtonSize: "w-[16px] h-[16px]" });
            }
        }
    };

    return (
        <div className="max-w-md mx-auto p-5 border rounded-lg border-contentBg bg-contentBg relative text-left">
            <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

            {activeTab === 'login' ? (
                <LoginForm
                    userId={userId}
                    password={password}
                    rememberId={rememberId}
                    onUserIdChange={setUserId}
                    onPasswordChange={setPassword}
                    onRememberIdChange={setRememberId}
                    onLogin={handleLoginWithErrorHandling}
                />
            ) : (
                <SignupForm
                    signupUserId={signupUserId}
                    signupPassword={signupPassword}
                    confirmPassword={confirmPassword}
                    nickname={nickname}
                    onSignupUserIdChange={setSignupUserId}
                    onSignupPasswordChange={setSignupPassword}
                    onConfirmPasswordChange={setConfirmPassword}
                    onNicknameChange={setNickname}
                    onSignup={handleSignUpWithErrorHandling}
                />
            )}
        </div>
    );
}