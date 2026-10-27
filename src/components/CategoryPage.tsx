import React, { useEffect, useState, useRef } from "react";
import "./styles/CategoryPage.css";
import {
  CategoryId,
  getCategoryById,
  categoriesData,
  WorkItem,
} from "../data/categoriesData";
import { useNavigation } from "../context/NavigationContext";
import {
  FaArrowLeft,
  FaArrowRight,
  FaGlobe,
  FaVideo,
  FaPalette,
  FaPlus,
  FaImages,
  FaXmark,
  FaChevronLeft,
  FaChevronRight,
  FaArrowUpRightFromSquare,
  FaGithub,
  FaCheck,
  FaPlay,
  FaPause,
  FaVolumeHigh,
  FaVolumeXmark,
} from "react-icons/fa6";

interface CategoryPageProps {
  categoryId: CategoryId;
}

const getCategoryIcon = (type: "globe" | "video" | "palette") => {
  switch (type) {
    case "globe":
      return <FaGlobe />;
    case "video":
      return <FaVideo />;
    case "palette":
      return <FaPalette />;
    default:
      return null;
  }
};

const CategoryPage: React.FC<CategoryPageProps> = ({ categoryId }) => {
  const { goToHome, goToCategory } = useNavigation();
  const category = getCategoryById(categoryId) || categoriesData[0];

  // Video loop states
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);

  // Reset video state on category change
  useEffect(() => {
    setVideoError(false);
    setIsVideoPlaying(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback
      });
    }
  }, [categoryId]);

  const toggleVideoPlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsVideoPlaying(true);
    } else {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  // Screenshot modal state
  const [modalProject, setModalProject] = useState<{
    title: string;
    screenshots: string[];
    index: number;
  } | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [categoryId]);

  // Handle keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!modalProject) return;
      if (e.key === "Escape") setModalProject(null);
      if (e.key === "ArrowLeft") {
        setModalProject((prev) =>
          prev
            ? {
                ...prev,
                index:
                  (prev.index - 1 + prev.screenshots.length) %
                  prev.screenshots.length,
              }
            : null
        );
      }
      if (e.key === "ArrowRight") {
        setModalProject((prev) =>
          prev
            ? {
                ...prev,
                index: (prev.index + 1) % prev.screenshots.length,
              }
            : null
        );
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modalProject]);

  const openScreenshotModal = (project: WorkItem, startIndex = 0) => {
    const list =
      project.screenshots && project.screenshots.length > 0
        ? project.screenshots
        : project.image
        ? [project.image]
        : [];

    setModalProject({
      title: project.title,
      screenshots: list,
      index: startIndex,
    });
  };

  const otherCategories = categoriesData.filter((c) => c.id !== category.id);

  // Remaining slots to display
  const totalSlots = Math.max(3, category.projects.length + 1);
  const remainingSlots = Math.max(0, totalSlots - category.projects.length);

  return (
    <div className="category-page-wrapper">
      {/* Sticky Topbar */}
      <nav className="category-topbar">
        <div className="topbar-left">
          <button
            className="topbar-back-btn"
            onClick={() => goToHome("work")}
            data-cursor="disable"
          >
            <FaArrowLeft /> Back to Home
          </button>

          <div className="category-nav-tabs">
            {categoriesData.map((cat) => (
              <button
                key={cat.id}
                className={`cat-tab-btn ${
                  cat.id === category.id ? "active" : ""
                }`}
                onClick={() => goToCategory(cat.id)}
                data-cursor="disable"
              >
                {getCategoryIcon(cat.iconType)} {cat.title}
              </button>
            ))}
          </div>
        </div>

        <div className="topbar-actions">
          <button
            className="contact-nav-btn"
            onClick={() => goToHome("contact")}
            data-cursor="disable"
          >
            Get In Touch
          </button>
        </div>
      </nav>

      <main className="category-container">
        {/* Category Hero */}
        <header className="category-hero">
          <div className="category-hero-badge">
            {getCategoryIcon(category.iconType)} {category.badge}
          </div>

          <h1>
            {category.title} <span>Showcase</span>
          </h1>
          <p className="category-hero-subtitle">{category.subtitle}</p>
          <p className="category-hero-desc">{category.description}</p>

          <div className="category-skills-strip">
            {category.skills.map((skill) => (
              <span key={skill} className="cat-skill-pill">
                {skill}
              </span>
            ))}
          </div>
        </header>

        {/* Category Hero Video Showcase */}
        {category.heroVideo && (
          <section className="category-hero-video-box">
            <div className="hero-video-frame">
              {!videoError ? (
                <>
                  <video
                    ref={videoRef}
                    src={category.heroVideo}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    className="hero-video-player"
                    onError={() => setVideoError(true)}
                  />
                  <div className="video-ambient-glow" />

                  {/* Floating Video Overlay Bar */}
                  <div className="video-control-overlay">
                    <div className="video-badge-pill">
                      <span className="live-pulse-dot" />
                      {category.heroVideoTitle || `${category.title} Showcase Reel`}
                    </div>

                    <div className="video-control-buttons">
                      <button
                        className="v-control-btn"
                        onClick={toggleVideoPlay}
                        data-cursor="disable"
                        title={isVideoPlaying ? "Pause Video" : "Play Video"}
                      >
                        {isVideoPlaying ? <FaPause /> : <FaPlay />}
                      </button>
                      <button
                        className="v-control-btn"
                        onClick={toggleMute}
                        data-cursor="disable"
                        title={isMuted ? "Unmute Audio" : "Mute Audio"}
                      >
                        {isMuted ? <FaVolumeXmark /> : <FaVolumeHigh />}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="video-placeholder-state">
                  <div className="placeholder-ring">
                    <FaVideo className="placeholder-icon" />
                  </div>
                  <h3>Main {category.title} Video Loop</h3>
                  <p>
                    Ready to stream your showcase video on loop. Place your video at{" "}
                    <code>{category.heroVideo}</code> to play automatically.
                  </p>
                  <span className="video-tag-pill">Loop Player Ready</span>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Work Showcase Container */}
        <section className="category-showcase-box">
          <div className="showcase-status-banner">
            <div className="status-left">
              <span className="status-dot"></span>
              <div>
                <h2 className="status-title">
                  {category.title} Projects ({category.projects.length})
                </h2>
                <p className="status-desc">
                  Curated projects, interface screenshots, and development case studies.
                </p>
              </div>
            </div>
            <button
              className="cat-tab-btn active"
              onClick={() => goToHome("contact")}
              data-cursor="disable"
            >
              Inquire for {category.title} Projects
            </button>
          </div>

          {/* Active Projects List */}
          {category.projects.length > 0 && (
            <div className="projects-showcase-list">
              {category.projects.map((proj, idx) => {
                const displayIndex = String(idx + 1).padStart(2, "0");
                const hasScreenshots =
                  proj.screenshots && proj.screenshots.length > 0;
                const screenshotCount = hasScreenshots
                  ? proj.screenshots!.length
                  : proj.image
                  ? 1
                  : 0;

                return (
                  <article key={proj.id} className="featured-project-card">
                    <div className="project-card-layout">
                      {/* Left: Project Visual / Screenshots Preview */}
                      <div className="project-visual-column">
                        {proj.videoUrl ? (
                          <div className="project-cover-wrap video-wrap">
                            <video
                              src={proj.videoUrl}
                              autoPlay
                              loop
                              muted
                              playsInline
                              className="project-cover-video"
                            />
                            <div
                              className="cover-hover-overlay"
                              onClick={() => openScreenshotModal(proj, 0)}
                            >
                              <span className="view-gallery-pill">
                                <FaImages /> View Gallery ({screenshotCount})
                              </span>
                            </div>
                            <span className="project-number-badge">
                              #{displayIndex}
                            </span>
                          </div>
                        ) : (
                          <div
                            className="project-cover-wrap"
                            onClick={() => openScreenshotModal(proj, 0)}
                            data-cursor="disable"
                            title="Click to view full-resolution screenshots"
                          >
                            <img
                              src={proj.image || "/images/placeholder.webp"}
                              alt={proj.title}
                              className="project-cover-img"
                            />
                            <div className="cover-hover-overlay">
                              <span className="view-gallery-pill">
                                <FaImages /> View Gallery ({screenshotCount})
                              </span>
                            </div>
                            <span className="project-number-badge">
                              #{displayIndex}
                            </span>
                          </div>
                        )}

                        {/* Thumbnail Strip if screenshots available */}
                        {hasScreenshots && proj.screenshots!.length > 1 && (
                          <div className="project-thumbnails-row">
                            {proj.screenshots!.slice(0, 4).map((shot, sIdx) => (
                              <button
                                key={sIdx}
                                className="thumbnail-btn"
                                onClick={() => openScreenshotModal(proj, sIdx)}
                                data-cursor="disable"
                              >
                                <img src={shot} alt={`Thumbnail ${sIdx + 1}`} />
                                {sIdx === 3 && proj.screenshots!.length > 4 && (
                                  <span className="more-count">
                                    +{proj.screenshots!.length - 4}
                                  </span>
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Right: Project Details & Meta */}
                      <div className="project-info-column">
                        <div className="project-card-header">
                          <div className="header-meta">
                            <span className="category-pill-badge">
                              {getCategoryIcon(category.iconType)} {category.badge}
                            </span>
                            {proj.year && (
                              <span className="year-pill-badge">{proj.year}</span>
                            )}
                            {proj.client && (
                              <span className="client-pill-badge">{proj.client}</span>
                            )}
                          </div>
                          <h3 className="project-card-heading">{proj.title}</h3>
                          <p className="project-tagline-text">{proj.tagline}</p>
                        </div>

                        <p className="project-description-text">{proj.description}</p>

                        {/* Key Features */}
                        {proj.keyFeatures && proj.keyFeatures.length > 0 && (
                          <div className="project-key-features">
                            <h4 className="features-title">Highlights & Features</h4>
                            <ul className="features-list">
                              {proj.keyFeatures.map((feat, fIdx) => (
                                <li key={fIdx}>
                                  <FaCheck className="check-icon" /> {feat}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Tech Stack Chips */}
                        <div className="project-tools-wrap">
                          {proj.tools.map((tool) => (
                            <span key={tool} className="proj-tool-chip">
                              {tool}
                            </span>
                          ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="project-card-actions">
                          <button
                            className="gallery-action-btn"
                            onClick={() => openScreenshotModal(proj, 0)}
                            data-cursor="disable"
                          >
                            <FaImages /> View Screenshots ({screenshotCount})
                          </button>

                          {proj.liveUrl && (
                            <a
                              href={proj.liveUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="link-action-btn primary"
                              data-cursor="disable"
                            >
                              Live Site <FaArrowUpRightFromSquare />
                            </a>
                          )}

                          {proj.githubUrl && (
                            <a
                              href={proj.githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="link-action-btn secondary"
                              data-cursor="disable"
                            >
                              <FaGithub /> GitHub
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Clean Placeholder Project Slots for Future Work */}
          {remainingSlots > 0 && (
            <div
              className="project-slots-grid"
              style={{
                marginTop: category.projects.length > 0 ? "35px" : "0",
              }}
            >
              {Array.from({ length: remainingSlots }).map((_, slotIdx) => {
                const slotNumber = category.projects.length + slotIdx + 1;
                const formattedNumber = String(slotNumber).padStart(2, "0");
                return (
                  <div key={slotIdx} className="project-slot-card">
                    <div className="slot-icon">
                      <FaPlus />
                    </div>
                    <h3 className="slot-title">Featured Project {formattedNumber}</h3>
                    <p className="slot-desc">
                      Ready for your next {category.title.toLowerCase()} project,
                      visual previews, and deliverables breakdown.
                    </p>
                    <span className="slot-tag">Slot Available</span>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Bottom Category Switcher */}
        <footer className="category-bottom-nav">
          <button
            className="topbar-back-btn"
            onClick={() => goToHome()}
            data-cursor="disable"
          >
            ← Return to Homepage
          </button>

          <div className="nav-other-categories">
            <span style={{ fontSize: "13px", color: "#8c869a" }}>
              Explore other categories:
            </span>
            {otherCategories.map((other) => (
              <button
                key={other.id}
                className="other-cat-btn"
                onClick={() => goToCategory(other.id)}
                data-cursor="disable"
              >
                {getCategoryIcon(other.iconType)} {other.title} <FaArrowRight />
              </button>
            ))}
          </div>
        </footer>
      </main>

      {/* Screenshot Lightbox / Modal */}
      {modalProject && modalProject.screenshots.length > 0 && (
        <div
          className="screenshot-modal-backdrop"
          onClick={() => setModalProject(null)}
        >
          <div
            className="screenshot-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="modal-header">
              <div className="modal-title-info">
                <h3>{modalProject.title}</h3>
                <span className="modal-counter">
                  Screenshot {modalProject.index + 1} of{" "}
                  {modalProject.screenshots.length}
                </span>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setModalProject(null)}
                data-cursor="disable"
                aria-label="Close"
              >
                <FaXmark />
              </button>
            </div>

            {/* Modal Body / Image Viewer */}
            <div className="modal-viewer">
              {modalProject.screenshots.length > 1 && (
                <button
                  className="modal-nav-btn prev"
                  onClick={() =>
                    setModalProject((prev) =>
                      prev
                        ? {
                            ...prev,
                            index:
                              (prev.index - 1 + prev.screenshots.length) %
                              prev.screenshots.length,
                          }
                        : null
                    )
                  }
                  data-cursor="disable"
                  aria-label="Previous screenshot"
                >
                  <FaChevronLeft />
                </button>
              )}

              <div className="modal-image-stage">
                <img
                  src={modalProject.screenshots[modalProject.index]}
                  alt={`${modalProject.title} screenshot ${
                    modalProject.index + 1
                  }`}
                  className="modal-displayed-image"
                />
              </div>

              {modalProject.screenshots.length > 1 && (
                <button
                  className="modal-nav-btn next"
                  onClick={() =>
                    setModalProject((prev) =>
                      prev
                        ? {
                            ...prev,
                            index:
                              (prev.index + 1) % prev.screenshots.length,
                          }
                        : null
                    )
                  }
                  data-cursor="disable"
                  aria-label="Next screenshot"
                >
                  <FaChevronRight />
                </button>
              )}
            </div>

            {/* Modal Thumbnails Strip */}
            {modalProject.screenshots.length > 1 && (
              <div className="modal-thumbnails-strip">
                {modalProject.screenshots.map((thumb, tIdx) => (
                  <button
                    key={tIdx}
                    className={`modal-thumb-btn ${
                      tIdx === modalProject.index ? "active" : ""
                    }`}
                    onClick={() =>
                      setModalProject((prev) =>
                        prev ? { ...prev, index: tIdx } : null
                      )
                    }
                    data-cursor="disable"
                  >
                    <img src={thumb} alt={`Thumbnail ${tIdx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;

