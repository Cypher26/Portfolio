export type CategoryId = "websites" | "video-editing" | "graphic-design";

export interface WorkItem {
  id: string;
  title: string;
  tagline: string;
  client?: string;
  year?: string;
  tools: string[];
  description: string;
  image?: string;
  screenshots?: string[];
  videoUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  keyFeatures?: string[];
}

export interface Category {
  id: CategoryId;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  iconType: "globe" | "video" | "palette";
  accentColor: string;
  skills: string[];
  heroVideo?: string;
  heroVideoTitle?: string;
  projects: WorkItem[];
}

export const categoriesData: Category[] = [
  {
    id: "websites",
    title: "Websites",
    subtitle: "Web Design, UI/UX & Responsive Layouts",
    badge: "Web Design",
    description:
      "Modern, fast-loading, responsive websites built with clean HTML5, CSS3, and JavaScript with a strong focus on typography, layout clarity, and mobile usability.",
    iconType: "globe",
    accentColor: "#c481ff",
    heroVideo: "/videos/websites_showcase.mp4",
    heroVideoTitle: "Featured Websites Reel & Interactive Showcase",
    skills: [
      "Web Design",
      "HTML5 & CSS3",
      "JavaScript",
      "UI/UX Design",
      "Responsive Layouts",
      "CSS Animations",
      "Figma to Web",
      "Mobile Optimization",
    ],
    projects: [
      {
        id: "placement-hub",
        title: "Placement Hub",
        tagline: "Comprehensive Campus Placement & Recruitment Management Platform",
        client: "Academic & Campus Drives",
        year: "2024",
        tools: ["React", "TypeScript", "Tailwind CSS", "Node.js", "Express", "REST APIs"],
        description:
          "A modern, high-performance web platform designed to streamline campus recruitment drives, company registrations, student eligibility filtering, and interview round tracking with real-time analytics.",
        image: "/images/project_placement_portal.webp",
        screenshots: [],
        keyFeatures: [
          "Dynamic student eligibility checker & resume repository",
          "Recruiter portal for job posting and candidate shortlisting",
          "Real-time interview scheduling and drive announcement feed",
          "Responsive, accessible UI with smooth data visualization",
        ],
      },
    ],
  },
  {
    id: "video-editing",
    title: "Video Editing",
    subtitle: "Commercial Ads, Motion Graphics & Short-Form",
    badge: "Video & Motion",
    description:
      "High-retention video post-production spanning commercial reels, promotional ads, kinetic typography, dynamic sound design, and viral short-form social edits.",
    iconType: "video",
    accentColor: "#9a66ff",
    skills: [
      "Adobe Premiere Pro",
      "Adobe After Effects",
      "DaVinci Resolve",
      "Motion Graphics",
      "Cinematic Color Grading",
      "Sound Design",
      "Kinetic Typography",
      "Shorts & Reels Pacing",
    ],
    projects: [], // Clean and ready to fill with actual work
  },
  {
    id: "graphic-design",
    title: "Graphic Designing",
    subtitle: "Logos, Brand Identity & Poster Art",
    badge: "Graphic Design",
    description:
      "Memorable visual identities, custom vector logos, branding guidelines, high-DPI event posters, social creatives, and packaging mockups.",
    iconType: "palette",
    accentColor: "#f472b6",
    skills: [
      "Logo Design",
      "Brand Identity Systems",
      "Adobe Illustrator",
      "Adobe Photoshop",
      "Poster Art",
      "Typography & Layout",
      "Vector Graphics",
      "Print & Digital Assets",
    ],
    projects: [], // Clean and ready to fill with actual work
  },
];

export function getCategoryById(id: string): Category | undefined {
  return categoriesData.find((c) => c.id === id);
}

export function getAllCategories(): Category[] {
  return categoriesData;
}
