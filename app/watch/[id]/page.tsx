export default function WatchPage({ params }: { params: { id: string } }) {
  return <div className="pt-16 px-6">{params.id}</div>;
}
