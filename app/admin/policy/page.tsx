'use client';
import { useState, useEffect } from 'react';
import {
  Policy,
  PolicyFormData,
  PolicyPageType,
  CreatePolicyDto,
  VersionIncrementType
} from '@/app/_types/admin';
import {
  createPolicy,
  getAllPolicies
} from '@/app/_apis/admin/policy';
import HtmlEditor from '@/app/_components/admin/HtmlEditor';
import { 
  showSuccessNotification, 
  showErrorNotification 
} from '@/app/_components/utils/overlay/notificationHelpers';

type ActiveTab = 'terms' | 'privacy';

export default function PolicyManagement() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('terms');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 각 정책별 실제 데이터 (백엔드에서 가져온 데이터)
  const [termsPolicy, setTermsPolicy] = useState<Policy | null>(null);
  const [privacyPolicy, setPrivacyPolicy] = useState<Policy | null>(null);

  // 각 정책별 편집 중인 데이터
  const [termsEditData, setTermsEditData] = useState<PolicyFormData>({
    page: PolicyPageType.TERMS,
    title: '서비스 이용약관',
    content: '',
    versionIncrementType: VersionIncrementType.MINOR
  });

  const [privacyEditData, setPrivacyEditData] = useState<PolicyFormData>({
    page: PolicyPageType.PRIVACY,
    title: '개인정보처리방침',
    content: '',
    versionIncrementType: VersionIncrementType.MINOR
  });

  const tabs = [
    { id: 'terms' as const, label: '이용약관' },
    { id: 'privacy' as const, label: '개인정보처리방침' }
  ];

  // 현재 활성 탭의 편집 데이터 가져오기
  const getCurrentData = (): PolicyFormData => {
    return activeTab === 'terms' ? termsEditData : privacyEditData;
  };

  // 현재 활성 탭의 편집 데이터 업데이트
  const updateCurrentData = (updates: Partial<PolicyFormData>) => {
    if (activeTab === 'terms') {
      setTermsEditData(prev => ({ ...prev, ...updates }));
    } else {
      setPrivacyEditData(prev => ({ ...prev, ...updates }));
    }
  };

  // 현재 활성 탭의 정책 데이터 가져오기
  const getCurrentPolicy = (): Policy | null => {
    return activeTab === 'terms' ? termsPolicy : privacyPolicy;
  };

  // 백엔드에서 정책 데이터 로드
  const loadPolicies = async () => {
    try {
      setLoading(true);
      
      // 모든 정책 데이터를 한번에 가져옴
      const response = await getAllPolicies();
      
      if (response.success && response.data) {
        // 정책 배열을 페이지별로 분류
        const policiesArray = response.data;
        const foundTermsPolicy = policiesArray.find(p => p.page === PolicyPageType.TERMS) || null;
        const foundPrivacyPolicy = policiesArray.find(p => p.page === PolicyPageType.PRIVACY) || null;

        setTermsPolicy(foundTermsPolicy);
        setPrivacyPolicy(foundPrivacyPolicy);

        // 편집 데이터 초기화 (백엔드 데이터로)
        if (foundTermsPolicy) {
          setTermsEditData({
            page: foundTermsPolicy.page,
            title: foundTermsPolicy.title,
            content: foundTermsPolicy.content,
            versionIncrementType: VersionIncrementType.MINOR
          });
        } else {
          setTermsEditData({
            page: PolicyPageType.TERMS,
            title: '서비스 이용약관',
            content: '<h1>서비스 이용약관</h1><p>새로운 이용약관을 작성해주세요.</p>',
            versionIncrementType: VersionIncrementType.MINOR
          });
        }

        if (foundPrivacyPolicy) {
          setPrivacyEditData({
            page: foundPrivacyPolicy.page,
            title: foundPrivacyPolicy.title,
            content: foundPrivacyPolicy.content,
            versionIncrementType: VersionIncrementType.MINOR
          });
        } else {
          setPrivacyEditData({
            page: PolicyPageType.PRIVACY,
            title: '개인정보처리방침',
            content: '<h1>개인정보처리방침</h1><p>새로운 개인정보처리방침을 작성해주세요.</p>',
            versionIncrementType: VersionIncrementType.MINOR
          });
        }
      } else {
        throw new Error(response.message || '정책 데이터를 가져올 수 없습니다.');
      }
    } catch (error) {
      console.error('Failed to load policies:', error);
      showErrorNotification('정책을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPolicies();
  }, []);

  // 탭 변경 핸들러
  const handleTabClick = (tabId: ActiveTab) => {
    setActiveTab(tabId);
  };

  // 저장 핸들러
  const handleSave = async () => {
    try {
      setSaving(true);
      
      const currentData = getCurrentData();
      
      // 항상 새 정책 생성 (버전별 기록)
      const createDto: CreatePolicyDto = {
        page: currentData.page,
        title: currentData.title,
        content: currentData.content,
        versionIncrementType: currentData.versionIncrementType
      };
      
      const response = await createPolicy(createDto);

      if (response.success) {
        // 전체 정책 목록을 다시 로드하여 최신 데이터 동기화
        await loadPolicies();

        showSuccessNotification(`${currentData.title}이(가) 저장되었습니다.`);
      } else {
        showErrorNotification('저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to save policy:', error);
      showErrorNotification('저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">정책 데이터 로딩 중...</p>
        </div>
      </div>
    );
  }

  const currentData = getCurrentData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">정책 관리</h1>
        <p className="text-muted-foreground">이용약관과 개인정보처리방침을 관리합니다</p>
      </div>

      {/* 탭 네비게이션 */}
      <div className="border-b border-border">
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

      {/* 정책 편집 영역 */}
      <div className="bg-card border border-border rounded-lg">
        
        <div className="p-6 space-y-6">
          {/* 기본 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                정책 제목
              </label>
              <input
                type="text"
                value={currentData.title}
                onChange={(e) => updateCurrentData({ title: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                placeholder="정책 제목을 입력하세요"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                버전 증가 타입
              </label>
              <select
                value={currentData.versionIncrementType}
                onChange={(e) => updateCurrentData({ versionIncrementType: e.target.value as VersionIncrementType })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              >
                <option value={VersionIncrementType.MAJOR}>Major (1.0 증가)</option>
                <option value={VersionIncrementType.MINOR}>Minor (0.1 증가)</option>
              </select>
            </div>
          </div>

          {/* HTML 에디터 */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              정책 내용 (HTML)
            </label>
            <HtmlEditor
              value={currentData.content}
              onChange={(content) => updateCurrentData({ content })}
              placeholder="<h1>정책 제목</h1><p>정책 내용을 HTML로 작성하세요...</p>"
              className="min-h-96"
            />
          </div>


          {/* 저장 버튼 */}
          <div className="flex items-center gap-4 pt-4 border-t border-border">
            <button
              onClick={handleSave}
              disabled={saving || !currentData.title.trim() || !currentData.content.trim()}
              className="px-6 py-2 bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground rounded-lg transition-colors"
            >
              {saving ? '저장 중...' : '저장'}
            </button>
            
            <div className="text-sm text-muted-foreground">
              {getCurrentPolicy() ? (
                <>
                  현재 버전: {getCurrentPolicy()!.version}
                  <br />
                  마지막 저장: {new Date(getCurrentPolicy()!.updated_at).toLocaleString('ko-KR')}
                </>
              ) : (
                '새 정책 (저장되지 않음)'
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}