import HostView from "@/components/admin/live-quiz/HostView";

export default async function HostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <HostView sessionId={id} />;
}
