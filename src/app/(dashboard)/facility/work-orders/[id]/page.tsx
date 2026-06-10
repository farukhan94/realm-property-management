import { WorkOrderDetailView } from "@/components/facility/WorkOrderDetailView";

export default async function WorkOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <WorkOrderDetailView workOrderId={id} />;
}
