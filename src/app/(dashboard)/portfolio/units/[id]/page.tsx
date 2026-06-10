import { UnitTimelineView } from "@/components/units/UnitTimelineView";

export default async function UnitDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <UnitTimelineView unitId={id} />;
}
