import React from 'react';

interface TitleFieldProps {
    title: string;
    onTitleChange: (value: string) => void;
}

const TitleField: React.FC<TitleFieldProps> = ({
    title,
    onTitleChange
}) => {
    return (
        <div className="grid grid-cols-6 my-2">
            <div className="flex col-span-1 text-center items-center">
                <label className="w-[100px] text-text-primary">방송제목</label>
            </div>
            <div className="flex col-span-5 items-center space-x-2">
                <div className="flex w-full h-[40px] items-center px-2 py-1 rounded-md space-x-3 border border-border-primary bg-bg-tertiary">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => onTitleChange(e.target.value)}
                        className="flex w-full focus:outline-none bg-transparent text-text-primary placeholder-text-muted"
                        placeholder="방송 제목을 입력해주세요"
                    />
                </div>
            </div>
        </div>
    );
};

export default TitleField;