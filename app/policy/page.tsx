'use client';
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function Policy() {
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState<string>('terms');
    const [htmlContent, setHtmlContent] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const tabs = [
        { id: 'terms', label: '이용약관' },
        { id: 'privacy', label: '개인정보처리방침' }
    ];

    const fetchPolicyContent = async (type: string) => {
        setLoading(true);
        
        // 더미 데이터로 UI 구현
        setTimeout(() => {
            switch (type) {
                case 'privacy':
                    setHtmlContent('<h2>개인정보처리방침</h2><p>개인정보처리방침 내용이 여기에 표시됩니다.</p>');
                    break;
                case 'terms':
                    setHtmlContent('<h2>이용약관</h2><p>이용약관 내용이 여기에 표시됩니다.</p>');
                    break;
                default:
                    setHtmlContent('<p>콘텐츠를 찾을 수 없습니다.</p>');
            }
            setLoading(false);
        }, 500);
    };

    useEffect(() => {
        const type = searchParams.get('type') || 'terms';
        setActiveTab(type);
        fetchPolicyContent(type);
    }, [searchParams]);

    const handleTabClick = (tabId: string) => {
        setActiveTab(tabId);
        fetchPolicyContent(tabId);
        
        const url = new URL(window.location.href);
        url.searchParams.set('type', tabId);
        window.history.pushState({}, '', url.toString());
    };

    return (
        <div className="max-w-4xl p-6">
            <div className="border-b border-border mb-6">
                <nav className="flex space-x-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabClick(tab.id)}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === tab.id
                                    ? 'border-accent-100 text-accent-100'
                                    : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="min-h-96">
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <div 
                        className="text-left"
                        dangerouslySetInnerHTML={{ __html: htmlContent }}
                    />
                )}
            </div>
        </div>
    );
}
  