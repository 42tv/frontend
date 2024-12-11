export default function FooterContainer() {
    return (
        <footer>
            <div className="flex flex-col w-full justify-center items-center text-sm leading-6 p-5">
                <div className="flex flex-row text-center">
                    <p className="mb-2">
                        <a href="/privacy-policy" className="text-gray-600 hover:text-gray-800 transition-colors mr-2">개인정보처리방침</a> | 
                        <a href="/terms-of-service" className="text-gray-600 hover:text-gray-800 transition-colors ml-2">이용약관</a>
                    </p>
                </div>
              
              <p>회사명: 주식회사 더블미디어 | 대표: 박호찬</p>
              <p>사업자등록번호: 842-86-01445 | 통신판매업 신고번호: 제 2020-서울강남-03890 호</p>
              <p>주소: 서울특별시 강남구 학동로 506(삼성동)</p>
              <p>대표번호: 1668-1682 | 팩스: 02-2051-6269 | 이메일: help@pandalive.co.kr</p>
              <p>개인정보관리 책임자: 이병근</p>
              <p className="mt-2">Copyright © 2019 doublemedia Corp. All rights reserved.</p>
            </div>
        </footer>


    )
}