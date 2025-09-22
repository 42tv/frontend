import React from 'react';

const TermsAgreement: React.FC = () => {
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        document.querySelectorAll<HTMLInputElement>('input[name="terms"]').forEach((checkbox) => {
            checkbox.checked = checked;
        });
    };

    return (
        <div className="mb-4">
            <div className="mb-2">
                <input
                    type="checkbox"
                    id="agreeAll"
                    onChange={handleSelectAll}
                    className="mr-2" style={{accentColor: 'var(--accent)'}}
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
                        className="mr-2" style={{accentColor: 'var(--accent)'}}
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
                        className="mr-2" style={{accentColor: 'var(--accent)'}}
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
                        className="mr-2" style={{accentColor: 'var(--accent)'}}
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
                        className="mr-2" style={{accentColor: 'var(--accent)'}}
                    />
                    <label htmlFor="agreeAge" className="text-text-secondary">
                        [필수] 만 14세 이상 동의
                    </label>
                </div>
            </div>
        </div>
    );
};

export default TermsAgreement;