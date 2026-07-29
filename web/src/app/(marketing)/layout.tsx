import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Header variant="marketing" />
      {children}
      <Footer variant="marketing" />
    </>
  );
}
