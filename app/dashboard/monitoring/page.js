import MonitoringClient from "@/components/dashboard/monitoring/MonitoringClient";
import { ambilDataMonitoring } from "@/services/monitoringService";

export default async function MonitoringPage() {
  const data = await ambilDataMonitoring();

  return <MonitoringClient {...data} />;
}