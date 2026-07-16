import React from 'react';
import { SignUpAgreements } from '@/app/_apis/user';

interface TermsAgreementProps {
    agreements: SignUpAgreements;
    onChange: (next: SignUpAgreements) => void;
}

interface TermItem {
    key: keyof SignUpAgreements;
    label: string;
    policyLink?: string;
}

const TERM_ITEMS: TermItem[] = [
    { key: 'termsAgreed', label: '[필수] 이용약관 동의', policyLink: '/policy?type=terms' },
    { key: 'privacyAgreed', label: '[필수] 개인정보 수집 및 이용 동의', policyLink: '/policy?type=privacy' },
    { key: 'isOver14', label: '[필수] 만 14세 이상입니다' },
];

const TermsAgreement: React.FC<TermsAgreementProps> = ({ agreements, onChange }) => {
    const allChecked: boolean = TERM_ITEMS.every((item) => agreements[item.key]);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        onChange({ termsAgreed: checked, privacyAgreed: checked, isOver14: checked });
    };

    const handleItemChange = (key: keyof SignUpAgreements, checked: boolean) => {
        onChange({ ...agreements, [key]: checked });
    };

    return (
        <div className="mb-4">
            <div className="mb-2">
                <input
                    type="checkbox"
                    id="agreeAll"
                    checked={allChecked}
                    onChange={handleSelectAll}
                    className="mr-2" style={{accentColor: 'var(--accent)'}}
                />
                <label htmlFor="agreeAll" className="text-text-primary font-semibold">
                    전체 동의
                </label>
            </div>
            <div className="pl-4">
                {TERM_ITEMS.map((item) => (
                    <div key={item.key} className="mb-2 flex items-center">
                        <input
                            type="checkbox"
                            id={`agree-${item.key}`}
                            checked={agreements[item.key]}
                            onChange={(e) => handleItemChange(item.key, e.target.checked)}
                            className="mr-2" style={{accentColor: 'var(--accent)'}}
                        />
                        <label htmlFor={`agree-${item.key}`} className="text-text-secondary">
                            {item.label}
                        </label>
                        {item.policyLink && (
                            <a
                                href={item.policyLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-2 text-xs text-text-secondary underline hover:text-accent transition-colors"
                            >
                                보기
                            </a>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TermsAgreement;
