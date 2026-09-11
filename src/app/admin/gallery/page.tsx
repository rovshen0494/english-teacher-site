import Image from "next/image";
import { getGalleryItems } from "@/lib/gallery";
import GalleryUploadForm from "@/components/admin/GalleryUploadForm";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function AdminGalleryPage() {
  const items = await getGalleryItems();
  const nextSortOrder = items.length > 0 ? Math.max(...items.map((i) => i.sortOrder)) + 1 : 0;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900">Gallery</h1>
      <p className="mt-1 text-sm text-ink-500">Photos and videos shown in the About page&apos;s classroom gallery.</p>

      <div className="mt-6 rounded-2xl border border-ink-100 bg-white p-6">
        <p className="text-sm font-semibold text-ink-900">Upload new item</p>
        <div className="mt-3">
          <GalleryUploadForm nextSortOrder={nextSortOrder} />
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.id} className="overflow-hidden rounded-2xl border border-ink-100 bg-white">
            <div className="relative aspect-[4/3] bg-ink-900">
              <Image
                src={item.type === "photo" ? item.src : (item.poster ?? item.src)}
                alt={item.alt}
                fill
                sizes="33vw"
                className="object-cover"
              />
              <span className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-xs font-semibold text-white">
                {item.type}
              </span>
            </div>
            <div className="p-4">
              <p className="line-clamp-2 text-sm text-ink-700">{item.alt}</p>
              <div className="mt-3 flex justify-end">
                <DeleteButton table="gallery_items" matchColumn="id" matchValue={item.id} confirmLabel={item.alt} />
              </div>
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && <p className="mt-6 text-sm text-ink-500">No gallery items yet.</p>}
    </div>
  );
}
