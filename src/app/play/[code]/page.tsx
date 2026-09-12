import PlayView from "@/components/live-quiz/PlayView";

export default async function PlayPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return <PlayView roomCode={code.toUpperCase()} />;
}
