import { LeaseDetailView } from "@/components/property/LeaseDetailView";

export default async function LeaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <LeaseDetailView leaseId={id} />;
}
