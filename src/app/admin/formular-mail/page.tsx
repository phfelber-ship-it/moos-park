import FormularMailSettings from "@/components/FormularMailSettings";
import { getFormNotificationRouting, getRecentSmtpFailures } from "@/lib/form-notification-routing";

export const dynamic = "force-dynamic";

export default async function FormularMailPage() {
  const [destinations, failures] = await Promise.all([
    getFormNotificationRouting(),
    getRecentSmtpFailures(),
  ]);

  return (
    <FormularMailSettings initialDestinations={destinations} initialFailures={failures} />
  );
}
