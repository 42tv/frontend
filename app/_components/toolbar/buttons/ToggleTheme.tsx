// GoogleLogo.js
import { useTheme } from "next-themes";
import React, { useEffect } from "react";
import { MdDarkMode, MdOutlineLightMode } from "react-icons/md";

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
            theme !== 'dark' ? 
            (
              <div className="w-[36px] h-[36px] flex items-center justify-center cursor-pointer rounded-full hover:bg-gray-200 transition-colors" onClick={toggleTheme}>
                <MdDarkMode className="w-full h-full p-1" />
              </div>
              
            ) : 
            (
              <div className="w-[36px] h-[36px] flex items-center justify-center cursor-pointer rounded-full hover:bg-gray-700 transition-colors" onClick={toggleTheme}> 
                <MdOutlineLightMode className="w-full h-full p-1"/>   
              </div>
            )
          }
        </div>
  )
}
