import AdminTopBar from "@/components/AdminTopBar";
import SeoCheckPrompt from "@/components/SeoCheckPrompt";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminTopBar />
      <SeoCheckPrompt />
      {children}
    </>
  );
}
