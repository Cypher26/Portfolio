import { categoriesData, CategoryId } from "./categoriesData";
export type { CategoryId };

export interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  categorySlug: CategoryId;
  image: string;
  alt: string;
  year: string;
  role: string;
  client: string;
  overview: string;
  challenge: string;
  solution: string;
  techStack: string[];
  tools: string;
  liveUrl?: string;
  githubUrl?: string;
  metrics?: { value: string; label: string }[];
  features?: { title: string; desc: string; tag?: string }[];
}

export interface CategoryMeta {
  id: CategoryId;
  name: string;
  badge: string;
  tagline: string;
  description: string;
}

// Derive a flat list of projects from categoriesData
export const projectsData: Project[] = categoriesData.flatMap((cat) =>
  cat.projects.map((item) => ({
    id: item.id,
    name: item.title,
    tagline: item.tagline,
    description: item.description,
    category: cat.title,
    categorySlug: cat.id,
    image: item.image || "",
    alt: item.title,
    year: item.year || "",
    role: "Creator & Developer",
    client: item.client || "",
    overview: item.description,
    challenge: "",
    solution: "",
    techStack: item.tools,
    tools: item.tools.join(", "),
    liveUrl: item.liveUrl,
    githubUrl: item.githubUrl,
    metrics: [],
    features: (item.keyFeatures || []).map((f) => ({
      title: f,
      desc: "",
    })),
  }))
);

export const categories: CategoryMeta[] = categoriesData.map((cat) => ({
  id: cat.id,
  name: cat.title,
  badge: cat.badge,
  tagline: cat.subtitle,
  description: cat.description,
}));

export function getProjectById(id: string): Project | undefined {
  return projectsData.find((p) => p.id === id);
}

export function getNextProject(
  currentId: string,
  _categorySlug?: CategoryId
): Project | undefined {
  const idx = projectsData.findIndex((p) => p.id === currentId);
  if (idx === -1) return projectsData[0];
  return projectsData[(idx + 1) % projectsData.length];
}

export function getPrevProject(
  currentId: string,
  _categorySlug?: CategoryId
): Project | undefined {
  const idx = projectsData.findIndex((p) => p.id === currentId);
  if (idx === -1) return projectsData[projectsData.length - 1];
  return projectsData[(idx - 1 + projectsData.length) % projectsData.length];
}
