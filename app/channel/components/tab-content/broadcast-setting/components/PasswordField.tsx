import React from 'react';

interface PasswordFieldProps {
    isPrivate: boolean;
    password: string;
    onPrivateChange: (value: boolean) => void;
    onPasswordChange: (value: string) => void;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
    isPrivate,
    password,
    onPrivateChange,
    onPasswordChange
}) => {
    return (
        <div className="grid grid-cols-6">
            <div className="flex col-span-1 text-center items-center">
                <label className="w-[100px] text-text-primary">비밀번호</label>
            </div>
            <div className="flex col-span-5 items-center h-[40px]">
                <div className="flex col-span-1 items-center space-x-2">
                    <input
                        type="checkbox"
                        id="hasPassword"
                        checked={isPrivate}
                        onChange={(e) => onPrivateChange(e.target.checked)}
                        className="h-4 w-4 focus:outline-none"
                        style={{ accentColor: 'var(--accent)' }}
                    />
                </div>
                <div className="flex col-span-4 items-center ml-4 space-x-2 h-full">
                    {isPrivate ? (
                        <div className="flex h-[40px] items-center px-2 py-1 rounded-md border border-border-primary bg-bg-tertiary">
                            <input
                                type="text"
                                value={password}
                                onChange={(e) => onPasswordChange(e.target.value)}
                                className="w-40 focus:outline-none bg-transparent text-text-primary placeholder-text-muted"
                                placeholder="비밀번호 입력"
                            />
                        </div>
                    ) : (
                        <div className="h-[40px] w-[164px]"></div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PasswordField;