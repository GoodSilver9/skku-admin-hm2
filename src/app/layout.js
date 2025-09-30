import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "텐소프트웍스 래글릿(Raglet) 관리자 페이지",
  description: "텐소프트웍스의 RAG 챗봇 '래글릿(Raglet)' 관리자 페이지입니다.",
  openGraph: {
    title: "텐소프트웍스 래글릿(Raglet) 관리자 페이지",
    description: "텐소프트웍스의 RAG 챗봇 '래글릿(Raglet)' 관리자 페이지입니다.",
    url: "https://admin.tensoftworks.com", // 실제 도메인으로 변경 필요
    siteName: "Tensoftworks Raglet Admin",
    images: [
      {
        url: "/og-image.png", // public 폴더에 og-image.png 파일이 있어야 함
        width: 1200,
        height: 630,
        alt: "텐소프트웍스 래글릿(Raglet) 관리자 페이지",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "텐소프트웍스 래글릿(Raglet) 관리자 페이지",
    description: "텐소프트웍스의 RAG 챗봇 '래글릿(Raglet)' 관리자 페이지입니다.",
    images: ["/og-image.png"], // public 폴더에 og-image.png 파일이 있어야 함
  },
};

const AuthProvider = ({ children }) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
    }
  }
  return children;
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster />
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
          >
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
