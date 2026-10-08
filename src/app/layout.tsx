import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/cssGlobal.css";

export const metadata: Metadata = {
  title: "SaaS Starter",
  description: "Template frontend reutilizavel para produtos SaaS."
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
