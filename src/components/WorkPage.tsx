import { useMemo } from "react";
import "./styles/WorkPage.css";
import {
  projectsData,
  categories,
  CategoryId,
  Project,
} from "../data/projectsData";
import { useNavigation } from "../context/NavigationContext";
import {
  FaArrowLeft,
  FaArrowRight,
  FaMagnifyingGlass,
  FaGlobe,
  FaVideo,
  FaPalette,
} from "react-icons/fa6";
import { MdOutlineWorkOutline } from "react-icons/md";
import { useState } from "react";

const getCategoryIcon = (id: CategoryId) => {
  switch (id) {
    case "websites":
      return <FaGlobe />;
    case "video-editing":
      return <FaVideo />;
    case "graphic-design":
      return <FaPalette />;
    default:
      return null;
  }
};

const WorkPage = () => {
  const {
    goToHome,
    goToProject,
    currentCategoryFilter,
    setCategoryFilter,
  } = useNavigation() as any;

  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = useMemo(() => {
    return projectsData.filter((project: Project) => {
      const matchesCategory =
        currentCategoryFilter === "all" ||
        project.categorySlug === currentCategoryFilter;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        project.name.toLowerCase().includes(q) ||
        project.tagline.toLowerCase().includes(q) ||
        project.description.toLowerCase().includes(q) ||
        project.tools.toLowerCase().includes(q) ||
        project.category.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [currentCategoryFilter, searchQuery]);

  const activeCategoryInfo = useMemo(() => {
    if (currentCategoryFilter === "all") return null;
    return categories.find((c) => c.id === currentCategoryFilter) || null;
  }, [currentCategoryFilter]);

  return (
    <div className="work-page-wrapper">
      {/* Sticky Topbar */}
      <nav className="work-page-topbar">
        <button
          className="topbar-brand"
          onClick={() => goToHome()}
          data-cursor="disable"
        >
          CYPHERR<span>.</span>
        </button>

        <div className="topbar-actions">
          <button
            className="back-home-nav-btn"
            onClick={() => goToHome()}
            data-cursor="disable"
          >
            <FaArrowLeft /> Home
          </button>
          <button
            className="contact-nav-btn"
            onClick={() => goToHome("contact")}
            data-cursor="disable"
          >
            Get In Touch
          </button>
        </div>
      </nav>

      <div className="work-page">
        {/* Hero Section */}
        <header className="work-page-hero">
          <div className="work-page-tag">
            <MdOutlineWorkOutline /> Selected Work & Creative Disciplines
          </div>
          <h1>
            Work Showcased By <span>Category</span>
          </h1>
          <p>
            Explore my creative portfolio organized into three specialized pillars:
            responsive Websites, high-retention Video Editing & Motion, and striking
            Graphic Designing & Brand Identity.
          </p>
        </header>

        {/* 3 Main Category Hub Cards */}
        <section className="category-hub-section" aria-label="Work Categories">
          <div className="category-hub-heading">
            <h2>Select a Creative Category</h2>
          </div>
          <div className="category-hub-grid">
            {categories.map((cat) => {
              const count = projectsData.filter(
                (p) => p.categorySlug === cat.id
              ).length;
              const isActive = currentCategoryFilter === cat.id;

              return (
                <div
                  key={cat.id}
                  className={`category-hub-card ${isActive ? "active" : ""}`}
                  onClick={() => setCategoryFilter(isActive ? "all" : cat.id)}
                  data-cursor="disable"
                >
                  <div className="category-card-top">
                    <span className="category-badge-chip">
                      {getCategoryIcon(cat.id)} {cat.badge}
                    </span>
                    <span className="category-count-chip">{count} Projects</span>
                  </div>

                  <h3 className="category-card-title">{cat.name}</h3>
                  <p className="category-card-tagline">{cat.tagline}</p>
                  <p className="category-card-desc">{cat.description}</p>

                  <div className="category-card-cta">
                    {isActive ? "Showing Active Category ✓" : `Explore ${cat.name} →`}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Search & Filter Controls */}
        <div className="work-page-controls">
          <div className="work-search-box">
            <FaMagnifyingGlass className="work-search-icon" />
            <input
              type="text"
              className="work-search-input"
              placeholder="Search by project name, tool, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-cursor="disable"
            />
          </div>

          <div className="work-page-filters">
            <button
              className={`filter-btn ${
                currentCategoryFilter === "all" ? "active" : ""
              }`}
              onClick={() => setCategoryFilter("all")}
              data-cursor="disable"
            >
              All Works ({projectsData.length})
            </button>
            {categories.map((cat) => {
              const count = projectsData.filter(
                (p) => p.categorySlug === cat.id
              ).length;
              return (
                <button
                  key={cat.id}
                  className={`filter-btn ${
                    currentCategoryFilter === cat.id ? "active" : ""
                  }`}
                  onClick={() => setCategoryFilter(cat.id)}
                  data-cursor="disable"
                >
                  {getCategoryIcon(cat.id)} {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Category Banner if filtered */}
        {activeCategoryInfo && (
          <div className="category-active-banner">
            <div className="category-banner-info">
              <span className="category-banner-pill">
                {getCategoryIcon(activeCategoryInfo.id)} {activeCategoryInfo.name}
              </span>
              <p className="category-banner-text">{activeCategoryInfo.tagline}</p>
            </div>
            <button
              className="show-all-categories-btn"
              onClick={() => setCategoryFilter("all")}
              data-cursor="disable"
            >
              View All Categories ✕
            </button>
          </div>
        )}

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="work-no-results">
            <h3>No projects found in this selection</h3>
            <p>Try searching with another keyword or resetting the category filter.</p>
            <button
              className="filter-btn active"
              style={{ marginTop: "16px" }}
              onClick={() => {
                setCategoryFilter("all");
                setSearchQuery("");
              }}
              data-cursor="disable"
            >
              Show All Projects
            </button>
          </div>
        ) : (
          <div className="work-grid">
            {filteredProjects.map((project, index) => {
              const displayIndex = String(index + 1).padStart(2, "0");
              return (
                <article
                  key={project.id}
                  className="work-card"
                  onClick={() => goToProject(project.id)}
                  data-cursor="disable"
                >
                  <div className="work-card-image-wrap">
                    <img src={project.image} alt={project.alt} loading="lazy" />
                    <div className="work-card-overlay" />
                    <span className="work-card-badge">
                      {getCategoryIcon(project.categorySlug)} {project.category}
                    </span>
                    <span className="work-card-year">{project.year}</span>
                  </div>

                  <div className="work-card-content">
                    <div className="work-card-header">
                      <h3 className="work-card-title">{project.name}</h3>
                      <span className="work-card-index">{displayIndex}</span>
                    </div>

                    <p className="work-card-tagline">{project.tagline}</p>
                    <p className="work-card-desc">{project.description}</p>

                    <div className="work-card-tools">
                      {project.techStack.slice(0, 4).map((tech) => (
                        <span key={tech} className="tool-chip">
                          {tech}
                        </span>
                      ))}
                      {project.techStack.length > 4 && (
                        <span className="tool-chip">
                          +{project.techStack.length - 4} more
                        </span>
                      )}
                    </div>

                    <div className="work-card-footer">
                      <button
                        className="view-case-study-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          goToProject(project.id);
                        }}
                        data-cursor="disable"
                      >
                        Explore Project Details <FaArrowRight />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Bottom CTA Banner */}
        <section className="work-page-cta-banner">
          <h2>
            Have a Project in <span>Websites</span>, <span>Video</span>, or <span>Design</span>?
          </h2>
          <p>
            Whether you need a sleek responsive website, cinematic video editing,
            or an unforgettable brand identity, let's team up to create high-impact
            visual work.
          </p>
          <div className="cta-actions">
            <button
              className="cta-btn-primary"
              onClick={() => goToHome("contact")}
              data-cursor="disable"
            >
              Start a Project <FaArrowRight />
            </button>
            <button
              className="cta-btn-secondary"
              onClick={() => goToHome()}
              data-cursor="disable"
            >
              Back to Home
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default WorkPage;
