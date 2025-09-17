'use client';
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getAllPolicies } from "@/app/_apis/admin/policy";
import { PolicyPageType } from "@/app/_types/admin";
import type { Policy } from "@/app/_types/admin";

export default function Policy() {
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState<string>('terms');
    const [policies, setPolicies] = useState<{[key: string]: Policy}>({});
    const [loading, setLoading] = useState<boolean>(true);

    const tabs = [
        { id: 'terms', label: '이용약관' },
        { id: 'privacy', label: '개인정보처리방침' }
    ];

    const fetchAllPolicies = async () => {
        setLoading(true);
        try {
            const response = await getAllPolicies();
            if (response.success && response.data) {
                const policyMap: {[key: string]: Policy} = {};
                response.data.forEach(policy => {
                    if (policy.page === PolicyPageType.TERMS) {
                        policyMap['terms'] = policy;
                    } else if (policy.page === PolicyPageType.PRIVACY) {
                        policyMap['privacy'] = policy;
                    }
                });
                setPolicies(policyMap);
            }
        } catch (error) {
            console.error('Failed to fetch policies:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const type = searchParams.get('type') || 'terms';
        setActiveTab(type);
        fetchAllPolicies();
    }, [searchParams]);

    const handleTabClick = (tabId: string) => {
        setActiveTab(tabId);

        const url = new URL(window.location.href);
        url.searchParams.set('type', tabId);
        window.history.pushState({}, '', url.toString());
    };

    const getCurrentPolicy = () => {
        return policies[activeTab] || null;
    };

    const getContent = () => {
        const policy = getCurrentPolicy();
        if (policy) {
            return policy.content;
        }

        // 기본 내용
        switch (activeTab) {
            case 'privacy':
                return '<h2>개인정보처리방침</h2><p>개인정보처리방침 내용이 여기에 표시됩니다.</p>';
            case 'terms':
                return '<h2>이용약관</h2><p>이용약관 내용이 여기에 표시됩니다.</p>';
            default:
                return '<p>콘텐츠를 찾을 수 없습니다.</p>';
        }
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
                    <div>
                        {getCurrentPolicy()?.version && (
                            <div className="mb-4 text-right">
                                <span className="text-sm text-muted-foreground">
                                    현재 버전: <span className="font-medium">{getCurrentPolicy()?.version}</span>
                                </span>
                            </div>
                        )}
                        <div
                            className="text-left"
                            dangerouslySetInnerHTML={{ __html: getContent() }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
  