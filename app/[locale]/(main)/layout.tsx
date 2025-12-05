import { Header } from "@/components/header/header";
import { Footer } from "@/components/footer/footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="mt-[140px]">
        {children}
      </div>
      <Footer />
    </>
  );
}
