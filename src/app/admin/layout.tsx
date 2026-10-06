import AdminTopBar from "@/components/AdminTopBar";
import SeoCheckPrompt from "@/components/SeoCheckPrompt";
import AdminInactivityLogout from "@/components/AdminInactivityLogout";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminTopBar />
      <SeoCheckPrompt />
      <AdminInactivityLogout />
      {children}
    </>
  );
}
