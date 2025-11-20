import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "TaskerPro",
  description:
    "TaskerPro — Collaborate, organize and manage your tasks efficiently across shared workspaces.",
  icons: {
    icon: "./favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favico.ico" type="image/x-icon" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#f5f7fa] text-gray-900">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
