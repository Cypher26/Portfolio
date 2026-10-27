import { lazy, PropsWithChildren, Suspense, useEffect, useState } from "react";
import About from "./About";
import Career from "./Career";
import Contact from "./Contact";
import Cursor from "./Cursor";
import Landing from "./Landing";
import Navbar, { smoother } from "./Navbar";
import SocialIcons from "./SocialIcons";
import WhatIDo from "./WhatIDo";
import Work from "./Work";
import CategoryPage from "./CategoryPage";
import setSplitText from "./utils/splitText";
import { useNavigation } from "../context/NavigationContext";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const TechStack = lazy(() => import("./TechStack"));

const MainContainer = ({ children }: PropsWithChildren) => {
  const { currentView, currentCategoryId } = useNavigation();
  const [isDesktopView, setIsDesktopView] = useState<boolean>(
    window.innerWidth > 1024
  );

  useEffect(() => {
    let timeoutId: number;
    const resizeHandler = () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        setSplitText();
        setIsDesktopView(window.innerWidth > 1024);
      }, 150);
    };
    setSplitText();
    window.addEventListener("resize", resizeHandler);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflowY = "auto";
    document.body.style.overflowX = "hidden";
    document.documentElement.style.overflowY = "auto";
    document.documentElement.style.overflowX = "hidden";

    if (currentView === "home") {
      if (smoother && typeof smoother.paused === "function") {
        smoother.paused(false);
      }
      const t = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 50);
      return () => clearTimeout(t);
    } else {
      if (smoother && typeof smoother.paused === "function") {
        smoother.paused(true);
      }
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [currentView]);

  return (
    <div className="container-main">
      <Cursor />
      {currentView === "home" && <Navbar />}
      <SocialIcons />

      {/* 3D Character Model only on desktop when on home view */}
      {isDesktopView && currentView === "home" && children}

      {/* Dedicated Separated Category Page (Websites / Video Editing / Graphic Designing) */}
      {currentView === "category" && (
        <CategoryPage categoryId={currentCategoryId} />
      )}

      {/* Home Page Content */}
      <div
        id="smooth-wrapper"
        style={{
          display: currentView === "home" ? "block" : "none",
        }}
      >
        <div id="smooth-content">
          <div className="container-main">
            <Landing>{!isDesktopView && currentView === "home" && children}</Landing>
            <About />
            <WhatIDo />
            <Career />
            <Work />
            {isDesktopView && (
              <Suspense fallback={<div>Loading....</div>}>
                <TechStack />
              </Suspense>
            )}
            <Contact />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContainer;
