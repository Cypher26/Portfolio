import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { CategoryId } from "../data/categoriesData";

export type ViewType = "home" | "category" | "work" | "project";

export interface NavigationContextType {
  currentView: ViewType;
  currentCategoryId: CategoryId;
  currentProjectId: string | null;
  currentCategoryFilter: CategoryId | "all";
  goToHome: (targetSection?: string) => void;
  goToCategory: (id: CategoryId) => void;
  goToAllWork: (filter?: CategoryId | "all") => void;
  goToProject: (projectId: string) => void;
  setCategoryFilter: (filter: CategoryId | "all") => void;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

function parseHash(hash: string): {
  view: ViewType;
  categoryId: CategoryId;
  projectId: string | null;
  section?: string;
} {
  const cleanHash = hash.replace(/^#\/?/, "").trim().toLowerCase();

  if (!cleanHash || cleanHash === "/") {
    return { view: "home", categoryId: "websites", projectId: null };
  }

  // Section scrolls on home
  if (["about", "contact", "what-i-do", "career", "work"].includes(cleanHash)) {
    return { view: "home", categoryId: "websites", projectId: null, section: cleanHash };
  }

  // Work page route
  if (cleanHash === "works" || cleanHash === "all-works") {
    return { view: "work", categoryId: "websites", projectId: null };
  }

  // Project detail route e.g. #/project/placement-hub
  const projectMatch = cleanHash.match(/^project\/(.+)$/);
  if (projectMatch) {
    return { view: "project", categoryId: "websites", projectId: projectMatch[1] };
  }

  // Category routes e.g. #/websites, #/video-editing, #/graphic-design, #/category/websites
  const categoryMatch = cleanHash.match(/^(?:category\/)?(websites|video-editing|graphic-design)$/);
  if (categoryMatch) {
    return { view: "category", categoryId: categoryMatch[1] as CategoryId, projectId: null };
  }

  return { view: "home", categoryId: "websites", projectId: null };
}

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ViewType>("home");
  const [currentCategoryId, setCurrentCategoryId] = useState<CategoryId>("websites");
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [currentCategoryFilter, setCurrentCategoryFilter] = useState<CategoryId | "all">("all");

  const syncFromUrl = useCallback(() => {
    const { view, categoryId, projectId } = parseHash(window.location.hash);
    setCurrentView(view);
    setCurrentCategoryId(categoryId);
    setCurrentProjectId(projectId);
  }, []);

  useEffect(() => {
    syncFromUrl();
    window.addEventListener("hashchange", syncFromUrl);
    return () => window.removeEventListener("hashchange", syncFromUrl);
  }, [syncFromUrl]);

  const goToHome = useCallback((targetSection?: string) => {
    setCurrentView("home");
    setCurrentProjectId(null);
    if (targetSection) {
      window.location.hash = `#${targetSection}`;
      setTimeout(() => {
        const target = document.getElementById(targetSection);
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      window.location.hash = "#/";
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  const goToCategory = useCallback((id: CategoryId) => {
    setCurrentView("category");
    setCurrentCategoryId(id);
    setCurrentProjectId(null);
    window.location.hash = `#/category/${id}`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const goToAllWork = useCallback((filter?: CategoryId | "all") => {
    setCurrentView("work");
    setCurrentProjectId(null);
    if (filter && filter !== "all") {
      setCurrentCategoryFilter(filter);
    }
    window.location.hash = "#/works";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const goToProject = useCallback((projectId: string) => {
    setCurrentView("project");
    setCurrentProjectId(projectId);
    window.location.hash = `#/project/${projectId}`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const setCategoryFilter = useCallback((filter: CategoryId | "all") => {
    setCurrentCategoryFilter(filter);
  }, []);

  return (
    <NavigationContext.Provider
      value={{
        currentView,
        currentCategoryId,
        currentProjectId,
        currentCategoryFilter,
        goToHome,
        goToCategory,
        goToAllWork,
        goToProject,
        setCategoryFilter,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
};
