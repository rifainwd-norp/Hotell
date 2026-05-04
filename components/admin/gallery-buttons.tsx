'use client';

import { HiOutlineTrash } from "react-icons/hi";
import { deleteGalleryItem } from "@/lib/actions/gallery";
import { useState } from "react";

export function DeleteGalleryButton({ id }: { id: number | string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this gallery item?")) {
      setIsDeleting(true);
      await deleteGalleryItem(id);
      setIsDeleting(false);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="absolute top-4 right-4 p-2 rounded-lg bg-red-500/80 backdrop-blur-sm text-white hover:bg-red-600 transition-all shadow-lg active:scale-95 disabled:opacity-50"
    >
      <HiOutlineTrash className={isDeleting ? "animate-pulse" : ""} />
    </button>
  );
}
