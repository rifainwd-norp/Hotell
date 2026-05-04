import Hero from "@/components/hero";
import FeaturedRooms from "@/components/featured-rooms";
import GalleryMosaic from "@/components/gallery-mosaic";
import Testimonials from "@/components/testimonials";
import Offers from "@/components/offers";
import Experience from "@/components/experience";
import { getRooms, getLifestyleGallery, getTestimonials, getExperiences, getOffers } from "@/lib/data";

export default async function Home() {
  // Fetch all data on the server
  const [rooms, galleryItems, testimonials, experiences, offers] = await Promise.all([
    getRooms(),
    getLifestyleGallery(),
    getTestimonials(),
    getExperiences(),
    getOffers()
  ]);

  return (
    <div className="flex flex-col">
      <Hero />
      <Experience initialData={experiences} />
      <FeaturedRooms initialData={rooms} />
      <Offers initialData={offers} />
      <GalleryMosaic initialData={galleryItems} />
      <Testimonials initialData={testimonials} />
    </div>
  );
}
