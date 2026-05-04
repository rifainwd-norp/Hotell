import { getRoomBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import RoomDetailClient from "../../../components/room-detail-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RoomDetailPage({ params }: PageProps) {
  const { id } = await params;
  const room = await getRoomBySlug(id);

  if (!room) {
    notFound();
  }

  return <RoomDetailClient room={room} />;
}
