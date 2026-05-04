import GalleryClient from "../../components/gallery-client";
import { getLifestyleGallery } from "@/lib/data";

export default async function GalleryPage() {
  const items = await getLifestyleGallery();

  return <GalleryClient initialData={items} />;
}
