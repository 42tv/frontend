'use client';
import { useState, useEffect } from 'react';
import { Policy, PolicyFormData } from '@/app/_types/admin';
import HtmlEditor from '@/app/_components/admin/HtmlEditor';
import PolicyList from '@/app/_components/admin/PolicyList';

type FormMode = 'create' | 'edit' | 'view';

export default function PolicyManagement() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [formMode, setFormMode] = useState<FormMode>('view');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewContent, setPreviewContent] = useState<string>('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // 폼 데이터
  const [formData, setFormData] = useState<PolicyFormData>({
    type: 'terms',
    title: '',
    content: '',
    version: '1.0',
    is_active: false
  });

  // 정책 목록 로드 (더미 데이터)
  const loadPolicies = async () => {
    try {
      setLoading(true);
      
      // 더미 데이터로 UI 개발
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setPolicies([
        {
          id: 1,
          type: 'terms',
          title: '이용약관',
          content: '<h1>서비스 이용약관</h1><h2>제1조 (목적)</h2><p>이 약관은 회사가 제공하는 서비스의 이용조건과 절차, 회사와 회원 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.</p><h2>제2조 (정의)</h2><p>1. "서비스"라 함은 회사가 제공하는 모든 서비스를 의미합니다.</p><p>2. "회원"이라 함은 회사의 서비스에 접속하여 이 약관에 따라 회사와 이용계약을 체결하고 회사가 제공하는 서비스를 이용하는 고객을 말합니다.</p><h2>제3조 (약관의 효력 및 변경)</h2><p>1. 이 약관은 회원이 동의함으로써 효력이 발생합니다.</p><p>2. 회사는 필요하다고 인정되는 경우 이 약관을 변경할 수 있습니다.</p>',
          version: '1.2',
          is_active: true,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-15T00:00:00Z'
        },
        {
          id: 2,
          type: 'privacy',
          title: '개인정보처리방침',
          content: '<h1>개인정보처리방침</h1><h2>1. 개인정보의 처리 목적</h2><p>회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p><ul><li>회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증</li><li>서비스 제공 및 운영</li><li>고객 문의사항 처리</li></ul><h2>2. 개인정보의 처리 및 보유기간</h2><p>회사는 정보주체로부터 개인정보를 수집할 때 동의받은 개인정보 보유·이용기간 또는 법령에 따른 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.</p>',
          version: '1.1',
          is_active: true,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-10T00:00:00Z'
        },
        {
          id: 3,
          type: 'terms',
          title: '이용약관 (구버전)',
          content: '<h1>서비스 이용약관 (구버전)</h1><p>이전 버전의 이용약관입니다.</p>',
          version: '1.1',
          is_active: false,
          created_at: '2023-12-01T00:00:00Z',
          updated_at: '2023-12-01T00:00:00Z'
        }
      ]);
    } catch (error) {
      console.error('Failed to load policies:', error);
    } finally {
      setLoading(false);
    }
  };

  // 미리보기 로드 (더미 데이터)
  const loadPreview = async (type: 'terms' | 'privacy') => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // 활성화된 정책 찾기
      const activePolicy = policies.find(p => p.type === type && p.is_active);
      if (activePolicy) {
        setPreviewContent(activePolicy.content);
      } else {
        setPreviewContent('<p>활성화된 정책이 없습니다.</p>');
      }
    } catch (error) {
      console.error('Failed to load preview:', error);
      setPreviewContent('<p>미리보기를 로드하는 중 오류가 발생했습니다.</p>');
    }
  };

  // 정책 선택
  const handleSelectPolicy = (policy: Policy) => {
    setSelectedPolicy(policy);
    setFormData({
      type: policy.type,
      title: policy.title,
      content: policy.content,
      version: policy.version,
      is_active: policy.is_active
    });
    setFormMode('edit');
  };

  // 새 정책 생성 모드
  const handleCreateNew = () => {
    setSelectedPolicy(null);
    setFormData({
      type: 'terms',
      title: '',
      content: '',
      version: '1.0',
      is_active: false
    });
    setFormMode('create');
  };

  // 정책 저장 (더미 구현)
  const handleSave = async () => {
    try {
      setSaving(true);
      
      // UI 저장 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (formMode === 'create') {
        // 새 정책 추가
        const newPolicy: Policy = {
          id: Math.max(...policies.map(p => p.id), 0) + 1,
          type: formData.type,
          title: formData.title,
          content: formData.content,
          version: formData.version,
          is_active: formData.is_active,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        setPolicies([...policies, newPolicy]);
        setFormMode('view');
        alert('정책이 생성되었습니다.');
      } else if (formMode === 'edit' && selectedPolicy) {
        // 기존 정책 수정
        const updatedPolicies = policies.map(p => 
          p.id === selectedPolicy.id 
            ? {
                ...p,
                title: formData.title,
                content: formData.content,
                version: formData.version,
                is_active: formData.is_active,
                updated_at: new Date().toISOString()
              }
            : p
        );
        
        setPolicies(updatedPolicies);
        setFormMode('view');
        alert('정책이 수정되었습니다.');
      }
    } catch (error) {
      console.error('Failed to save policy:', error);
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  // 정책 삭제 (더미 구현)
  const handleDelete = async (id: number) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedPolicies = policies.filter(p => p.id !== id);
      setPolicies(updatedPolicies);
      
      if (selectedPolicy?.id === id) {
        setSelectedPolicy(null);
        setFormMode('view');
      }
      alert('정책이 삭제되었습니다.');
    } catch (error) {
      console.error('Failed to delete policy:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  // 정책 상태 토글 (더미 구현)
  const handleToggleStatus = async (id: number, isActive: boolean) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const updatedPolicies = policies.map(p => 
        p.id === id 
          ? { ...p, is_active: isActive, updated_at: new Date().toISOString() }
          : p
      );
      setPolicies(updatedPolicies);
      
      if (selectedPolicy?.id === id) {
        setSelectedPolicy({ ...selectedPolicy, is_active: isActive });
        setFormData({ ...formData, is_active: isActive });
      }
      alert(`정책이 ${isActive ? '활성화' : '비활성화'}되었습니다.`);
    } catch (error) {
      console.error('Failed to toggle policy status:', error);
      alert('상태 변경 중 오류가 발생했습니다.');
    }
  };

  // 미리보기 토글
  const handlePreviewToggle = (type: 'terms' | 'privacy') => {
    if (isPreviewMode) {
      setIsPreviewMode(false);
    } else {
      setIsPreviewMode(true);
      loadPreview(type);
    }
  };

  useEffect(() => {
    loadPolicies();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">정책 관리</h1>
          <p className="text-muted-foreground">이용약관과 개인정보처리방침을 관리합니다</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => handlePreviewToggle('terms')}
            className="px-4 py-2 bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 rounded-lg transition-colors"
          >
            이용약관 미리보기
          </button>
          <button
            onClick={() => handlePreviewToggle('privacy')}
            className="px-4 py-2 bg-purple-500/10 text-purple-600 hover:bg-purple-500/20 rounded-lg transition-colors"
          >
            개인정보처리방침 미리보기
          </button>
          <button
            onClick={handleCreateNew}
            className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors"
          >
            새 정책 추가
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 정책 목록 */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-lg p-4">
            <h2 className="text-lg font-semibold text-foreground mb-4">정책 목록</h2>
            <PolicyList
              policies={policies}
              selectedPolicy={selectedPolicy}
              onSelect={handleSelectPolicy}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
              loading={loading}
            />
          </div>
        </div>

        {/* 편집/미리보기 영역 */}
        <div className="lg:col-span-2">
          {isPreviewMode ? (
            /* 미리보기 모드 */
            <div className="bg-card border border-border rounded-lg">
              <div className="border-b border-border px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground">실제 사용자 화면 미리보기</h2>
                  <button
                    onClick={() => setIsPreviewMode(false)}
                    className="px-3 py-1 text-sm bg-accent text-accent-foreground hover:bg-accent/80 rounded transition-colors"
                  >
                    편집으로 돌아가기
                  </button>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Footer 링크를 통해 사용자가 보게 될 실제 화면입니다
                </p>
              </div>
              
              <div className="p-6">
                <div className="max-w-4xl">
                  <div 
                    className="prose prose-sm max-w-none text-left"
                    dangerouslySetInnerHTML={{ __html: previewContent }}
                  />
                </div>
              </div>
            </div>
          ) : (
            /* 편집 모드 */
            <div className="bg-card border border-border rounded-lg">
              <div className="border-b border-border px-6 py-4">
                <h2 className="text-lg font-semibold text-foreground">
                  {formMode === 'create' ? '새 정책 생성' : '정책 편집'}
                </h2>
                {formMode !== 'view' && (
                  <p className="text-sm text-muted-foreground mt-1">
                    정책 내용을 HTML로 작성하고 미리보기에서 확인하세요
                  </p>
                )}
              </div>
              
              <div className="p-6 space-y-6">
                {formMode === 'view' ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>정책을 선택하여 편집하거나 새 정책을 추가하세요.</p>
                  </div>
                ) : (
                  <>
                    {/* 기본 정보 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          정책 타입
                        </label>
                        <select
                          value={formData.type}
                          onChange={(e) => setFormData({ ...formData, type: e.target.value as 'terms' | 'privacy' })}
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                        >
                          <option value="terms">이용약관</option>
                          <option value="privacy">개인정보처리방침</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          버전
                        </label>
                        <input
                          type="text"
                          value={formData.version}
                          onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        제목
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                        placeholder="정책 제목을 입력하세요"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        내용
                      </label>
                      <HtmlEditor
                        value={formData.content}
                        onChange={(content) => setFormData({ ...formData, content })}
                        placeholder="<h2>정책 제목</h2><p>정책 내용을 HTML로 작성하세요...</p>"
                        className="min-h-96"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="is_active"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        className="rounded"
                      />
                      <label htmlFor="is_active" className="text-sm font-medium text-foreground">
                        활성화 (사용자에게 표시)
                      </label>
                    </div>

                    {/* 액션 버튼 */}
                    <div className="flex items-center gap-4 pt-4 border-t border-border">
                      <button
                        onClick={handleSave}
                        disabled={saving || !formData.title.trim() || !formData.content.trim()}
                        className="px-6 py-2 bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground rounded-lg transition-colors"
                      >
                        {saving ? '저장 중...' : (formMode === 'create' ? '생성' : '저장')}
                      </button>
                      
                      <button
                        onClick={() => {
                          setFormMode('view');
                          setSelectedPolicy(null);
                        }}
                        className="px-6 py-2 bg-accent text-accent-foreground hover:bg-accent/80 rounded-lg transition-colors"
                      >
                        취소
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}