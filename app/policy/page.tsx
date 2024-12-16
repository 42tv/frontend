'use client';
import { useState } from "react";

export default function Policy() {
    const [index, setIndex] = useState(0);
    const [html, setHtml] = useState('');

    function fetchPolicy(index: string) {
        switch (index) {
            case 'privacy':
                setHtml('개인정보처리방침');
                break;
            case 'terms':
                setHtml('이용약관');
                break;
            case 'youth':
                setHtml('청소년보호정책');
                break;
            case 'watch':
                setHtml('시청기준안내');
                break;
            case 'broadcast':
                setHtml('방송기준안내');
                break;
            default:
                setHtml('aa');
        }
    }
    
    return (
        <div className="p-4">
            <div className="flex space-x-6">
                <div onClick={() => fetchPolicy('privacy')}>
                    <a href="#" className="">개인정보처리방침</a>
                </div>
                <div onClick={() => fetchPolicy('terms')}>
                    <a href="#" className="">이용약관</a>
                </div>
                <div onClick={() => fetchPolicy('youth')}>
                    <a href="#" className="">청소년보호정책</a>
                </div>
                <div onClick={() => fetchPolicy('watch')}>
                    <a href="#" className="">시청기준안내</a>
                </div>
                <div onClick={() => fetchPolicy('broadcast')}>
                    <a href="#" className="">방송기준안내</a>
                </div>
            </div>
            {
                <div dangerouslySetInnerHTML={{ __html: html }}></div>
            }
        </div>
    );
  }
  