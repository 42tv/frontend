import type { Metadata } from "next";
import "./globals.css";
import Toolbar from "./_components/toolbar/toolbar";
import { ThemeProvider } from "./_components/theme-provider";
import LeftContainer from "./_components/left-container/left-container";
import Modal from "./_components/utils/modal/modal";
import ErrorModal from "./_components/utils/modal/errorModal";
import PopupModal from "./_components/utils/modal/popupModal";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`antialiased flex flex-col h-screen overflow-x-auto overflow-y-auto`}
      >
        <ThemeProvider>
          <Toolbar />
          <div className="flex flex-1 pt-[65px] overflow-auto">
            <LeftContainer />
            <Modal />
            <ErrorModal />
            <PopupModal />
            <div className="flex-1 overflow-x-auto overflow-y-auto">
              {children}
              {/* <FooterContainer /> */}
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
