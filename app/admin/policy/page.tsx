'use client';
import { useState, useEffect } from 'react';
import { Policy, PolicyFormData } from '@/app/_types/admin';
import HtmlEditor from '@/app/_components/admin/HtmlEditor';

type ActiveTab = 'terms' | 'privacy';
type FormMode = 'edit' | 'preview';

export default function PolicyManagement() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('terms');
  const [formMode, setFormMode] = useState<FormMode>('edit');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 각 탭별 데이터
  const [policies, setPolicies] = useState<Record<string, PolicyFormData>>({
    terms: {
      page: 'terms',
      title: '서비스 이용약관',
      content: '<h1>서비스 이용약관</h1><h2>제1조 (목적)</h2><p>이 약관은 회사가 제공하는 서비스의 이용조건과 절차, 회사와 회원 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.</p><h2>제2조 (정의)</h2><p>1. "서비스"라 함은 회사가 제공하는 모든 서비스를 의미합니다.</p><p>2. "회원"이라 함은 회사의 서비스에 접속하여 이 약관에 따라 회사와 이용계약을 체결하고 회사가 제공하는 서비스를 이용하는 고객을 말합니다.</p><h2>제3조 (약관의 효력 및 변경)</h2><p>1. 이 약관은 회원이 동의함으로써 효력이 발생합니다.</p><p>2. 회사는 필요하다고 인정되는 경우 이 약관을 변경할 수 있습니다.</p>',
      version: '1.2',
      is_active: true
    },
    privacy: {
      page: 'privacy',
      title: '개인정보처리방침',
      content: '<h1>개인정보처리방침</h1><h2>1. 개인정보의 처리 목적</h2><p>회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p><ul><li>회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증</li><li>서비스 제공 및 운영</li><li>고객 문의사항 처리</li></ul><h2>2. 개인정보의 처리 및 보유기간</h2><p>회사는 정보주체로부터 개인정보를 수집할 때 동의받은 개인정보 보유·이용기간 또는 법령에 따른 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.</p>',
      version: '1.1',
      is_active: true
    }
  });

  const tabs = [
    { id: 'terms' as const, label: '이용약관' },
    { id: 'privacy' as const, label: '개인정보처리방침' }
  ];

  // 현재 활성 탭의 데이터 가져오기
  const getCurrentData = (): PolicyFormData => {
    return policies[activeTab];
  };

  // 현재 활성 탭의 데이터 업데이트
  const updateCurrentData = (updates: Partial<PolicyFormData>) => {
    setPolicies(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        ...updates
      }
    }));
  };

  // 데이터 로드 시뮬레이션
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // 탭 변경 핸들러
  const handleTabClick = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    // 탭 변경 시 편집 모드로 전환
    setFormMode('edit');
  };

  // 저장 핸들러
  const handleSave = async () => {
    try {
      setSaving(true);
      
      // UI 저장 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert(`${getCurrentData().title}이(가) 저장되었습니다.`);
    } catch (error) {
      console.error('Failed to save policy:', error);
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  // 미리보기 토글
  const togglePreview = () => {
    setFormMode(formMode === 'edit' ? 'preview' : 'edit');
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
        {/* 헤더 */}
        <div className="border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {formMode === 'edit' ? `${currentData.title} 편집` : `${currentData.title} 미리보기`}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {formMode === 'edit' 
                  ? 'HTML로 정책 내용을 작성하고 편집할 수 있습니다' 
                  : 'Footer 링크를 통해 사용자가 보게 될 실제 화면입니다'
                }
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={togglePreview}
                className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                  formMode === 'preview'
                    ? 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20'
                    : 'bg-accent text-accent-foreground hover:bg-accent/80'
                }`}
              >
                {formMode === 'edit' ? '미리보기' : '편집 모드'}
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {formMode === 'preview' ? (
            /* 미리보기 모드 */
            <div className="max-w-4xl">
              <div 
                className="prose prose-sm max-w-none text-left"
                dangerouslySetInnerHTML={{ __html: currentData.content }}
              />
            </div>
          ) : (
            /* 편집 모드 */
            <>
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
                    버전
                  </label>
                  <input
                    type="text"
                    value={currentData.version}
                    onChange={(e) => updateCurrentData({ version: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                    placeholder="1.0"
                  />
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

              {/* 활성화 설정 */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={currentData.is_active}
                  onChange={(e) => updateCurrentData({ is_active: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-foreground">
                  활성화 (사용자에게 표시)
                </label>
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
                  마지막 수정: {new Date().toLocaleString('ko-KR')}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}