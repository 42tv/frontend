export default function FooterContainer() {
    return (
        <footer className="bg-background border-t border-border">
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* 정책 링크 */}
                <div className="flex justify-center space-x-6 mb-4">
                    <a href="/policy?type=terms" className="text-foreground hover:text-primary transition-colors text-sm">
                        이용약관
                    </a>
                    <a href="/policy?type=privacy" className="text-foreground hover:text-primary transition-colors text-sm">
                        개인정보처리방침
                    </a>
                </div>

                {/* 회사 정보 */}
                <div className="text-center space-y-1 text-xs text-muted-foreground">
                    <p>서비스명: Fairly | 회사명: 42미디어 / 성명: 박상흠</p>
                    <p>사업자등록번호: 429-48-00770</p>
                    <p>개인정보관리책임자: 박상흠 | Email: k1990121@gmail.com</p>
                </div>

                {/* 저작권 */}
                <div className="text-center mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                        © 2024 42미디어. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}