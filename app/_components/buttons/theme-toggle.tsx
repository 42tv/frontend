// GoogleLogo.js
import { useTheme } from "next-themes";
import React, { useEffect } from "react";

export default function ToggleTheme() {
  const {theme, setTheme} = useTheme();
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  // 테마 변경 함수
  function toggleTheme() {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  }

  return (
        <div>
            {
                theme === 'dark' ? (
                    <svg
          className="svgIcon-use"
          width="36"
          height="36"
          viewBox="0 0 128 128"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
          onClick={toggleTheme}
        >
          <g
            transform="translate(0.000000,128.000000) scale(0.100000,-0.100000)"
            fill="#FFFFFF" // 어두운 테마에서 흰색
            stroke="none"
          >
            <path
              d="M427 1067 c-171 -95 -269 -293 -238 -481 34 -205 189 -362 392 -396
                148 -25 298 28 406 144 62 66 103 136 103 176 0 22 -2 22 -47 14 -27 -5 -88
                -9 -138 -9 -80 1 -98 4 -157 32 -88 41 -160 113 -201 201 -29 60 -32 76 -32
                157 1 50 5 114 9 143 9 51 8 52 -15 52 -13 0 -50 -15 -82 -33z m23 -144 c1
                -276 195 -473 466 -473 46 0 84 -4 84 -9 0 -5 -22 -34 -49 -64 -93 -101 -237
                -152 -364 -129 -275 51 -419 336 -297 588 28 58 125 164 149 164 7 0 11 -30
                11 -77z"
            />
          </g>
        </svg>
                    ) : (
                        <svg
                        width={36}
                        height={36}
                        viewBox="0 0 36 36"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        onClick={toggleTheme}
                      >
                        <g 
                          clipPath="url(#clip-path)" 
                          stroke="#000" 
                          strokeWidth="1.5" 
                          strokeMiterlimit="10"
                          transform="translate(6,6)">
                          <path
                            d="M5 12H1M23 12h-4M7.05 7.05 4.222 4.222M19.778 19.778 16.95 16.95M7.05 16.95l-2.828 2.828M19.778 4.222 16.95 7.05"
                            strokeLinecap="round"
                          />
                          <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" fill="#fff" fillOpacity="0.16" />
                          <path d="M12 19v4M12 1v4" strokeLinecap="round" />
                        </g>
                        <defs>
                          <clipPath id="clip-path">
                            <path fill="#ffffff" d="M0 0h24v24H0z" />
                          </clipPath>
                        </defs>
                      </svg>
                )
            }
        </div>
  )
}
