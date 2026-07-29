import AdminTopBar from "@/components/AdminTopBar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminTopBar />
      {children}
    </>
  );
}
