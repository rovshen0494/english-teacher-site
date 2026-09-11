import Image from "next/image";
import clsx from "clsx";

export default function TeacherPhoto({
  className,
  priority = false,
  src = "/images/balgyz-mammetyarova.png",
}: {
  className?: string;
  priority?: boolean;
  src?: string;
}) {
  return (
    <div className={clsx("relative aspect-[4/5] overflow-hidden rounded-3xl bg-brand-50", className)}>
      <Image
        src={src}
        alt="Balgyz Mammetyarova, English teacher and IELTS/TOEFL instructor"
        fill
        priority={priority}
        sizes="(min-width: 1024px) 40vw, 90vw"
        className="object-cover"
      />
    </div>
  );
}
