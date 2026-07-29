import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function LegalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Header variant="legal" />
      <main className="main">
        <div className="container">{children}</div>
      </main>
      <Footer variant="legal" />
    </>
  );
}
