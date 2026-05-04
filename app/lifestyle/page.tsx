import LifestyleClient from "../../components/lifestyle-client";
import { getLifestyleGallery } from "@/lib/data";

export default async function LifestylePage() {
  const galleryItems = await getLifestyleGallery();

  return <LifestyleClient initialData={galleryItems} />;
}
