export interface GalleryItem {
  type: "photo" | "video";
  src: string;
  poster?: string;
  width: number;
  height: number;
  alt: string;
}

export const CLASSROOM_MEDIA: GalleryItem[] = [
  {
    type: "photo",
    src: "/images/classroom/phonics-lesson-1.jpg",
    width: 1280,
    height: 960,
    alt: "Leading a phonics lesson, teaching the letter sound \"f\" with a projected slide",
  },
  {
    type: "photo",
    src: "/images/classroom/phonics-lesson-2.jpg",
    width: 1280,
    height: 695,
    alt: "Demonstrating the letter sound \"b\" during a phonics lesson",
  },
  {
    type: "video",
    src: "/videos/classroom/classroom-clip-1.mp4",
    poster: "/images/classroom/classroom-clip-1-poster.jpg",
    width: 480,
    height: 854,
    alt: "Teaching word families (\"op\", \"ip\") using a phonics matching activity",
  },
  {
    type: "video",
    src: "/videos/classroom/classroom-clip-3.mp4",
    poster: "/images/classroom/classroom-clip-3-poster.jpg",
    width: 854,
    height: 480,
    alt: "Leading a phonics chant for the letter sound \"c\", with students joining in",
  },
  {
    type: "video",
    src: "/videos/classroom/classroom-clip-2.mp4",
    poster: "/images/classroom/classroom-clip-2-poster.jpg",
    width: 480,
    height: 854,
    alt: "Explaining an interactive whiteboard activity to the class",
  },
  {
    type: "video",
    src: "/videos/classroom/classroom-clip-4.mp4",
    poster: "/images/classroom/classroom-clip-4-poster.jpg",
    width: 480,
    height: 854,
    alt: "Observing students working through an activity at the board",
  },
  {
    type: "video",
    src: "/videos/classroom/classroom-clip-5.mp4",
    poster: "/images/classroom/classroom-clip-5-poster.jpg",
    width: 480,
    height: 854,
    alt: "Guiding students through a classroom activity in small groups",
  },
];
