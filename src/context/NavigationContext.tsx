import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { CategoryId } from "../data/categoriesData";

export type ViewType = "home" | "category";

interface NavigationContextType {
  currentView: ViewType;
  currentCategoryId: CategoryId;
  goToHome: (targetSection?: string) => void;
  goToCategory: (id: CategoryId) => void;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

function parseHash(hash: string): {
  view: ViewType;
  categoryId: CategoryId;
  section?: string;
} {
  const cleanHash = hash.replace(/^#\/?/, "").trim().toLowerCase();

  if (!cleanHash || cleanHash === "/") {
    return { view: "home", categoryId: "websites" };
  }

  // Section scrolls on home
  if (["about", "contact", "what-i-do", "career", "work"].includes(cleanHash)) {
    return { view: "home", categoryId: "websites", section: cleanHash };
  }

  // Category routes e.g. #/websites, #/video-editing, #/graphic-design, #/category/websites
  const categoryMatch = cleanHash.match(/^(?:category\/)?(websites|video-editing|graphic-design)$/);
  if (categoryMatch) {
    return { view: "category", categoryId: categoryMatch[1] as CategoryId };
  }

  return { view: "home", categoryId: "websites" };
}

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ViewType>("home");
  const [currentCategoryId, setCurrentCategoryId] = useState<CategoryId>("websites");

  const syncFromUrl = useCallback(() => {
    const { view, categoryId } = parseHash(window.location.hash);
    setCurrentView(view);
    setCurrentCategoryId(categoryId);
  }, []);

  useEffect(() => {
    syncFromUrl();
    window.addEventListener("hashchange", syncFromUrl);
    return () => window.removeEventListener("hashchange", syncFromUrl);
  }, [syncFromUrl]);

  const goToHome = useCallback((targetSection?: string) => {
    setCurrentView("home");
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
    window.location.hash = `#/category/${id}`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <NavigationContext.Provider
      value={{
        currentView,
        currentCategoryId,
        goToHome,
        goToCategory,
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
