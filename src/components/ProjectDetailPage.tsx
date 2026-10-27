import React, { useEffect } from "react";
import "./styles/ProjectDetailPage.css";
import {
  getProjectById,
  getNextProject,
  getPrevProject,
  CategoryId,
} from "../data/projectsData";
import { useNavigation } from "../context/NavigationContext";
import {
  FaArrowLeft,
  FaArrowRight,
  FaArrowUpRightFromSquare,
  FaGithub,
  FaRegLightbulb,
  FaGlobe,
  FaVideo,
  FaPalette,
} from "react-icons/fa6";
import { IoGridOutline } from "react-icons/io5";
import { MdOutlineCheckCircle } from "react-icons/md";

interface ProjectDetailPageProps {
  projectId: string;
}

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

const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ projectId }) => {
  const { goToHome, goToAllWork, goToProject } = useNavigation() as any;
  const project = getProjectById(projectId) as any;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [projectId]);

  if (!project) {
    return (
      <div className="project-detail-wrapper">
        <nav className="project-detail-topbar">
          <button
            className="topbar-back-btn"
            onClick={() => goToAllWork("all")}
            data-cursor="disable"
          >
            <FaArrowLeft /> Back to All Works
          </button>
        </nav>
        <div
          className="project-detail-container"
          style={{ textAlign: "center", padding: "120px 20px" }}
        >
          <h2>Project Not Found</h2>
          <p style={{ color: "#a8a3b5", margin: "16px 0 32px" }}>
            The requested project case study could not be located.
          </p>
          <button
            className="topbar-back-btn"
            onClick={() => goToAllWork("all")}
            style={{ margin: "0 auto" }}
            data-cursor="disable"
          >
            Browse All Works
          </button>
        </div>
      </div>
    );
  }

  const nextProject = getNextProject(project.id, project.categorySlug as any);
  const prevProject = getPrevProject(project.id, project.categorySlug as any);

  return (
    <div className="project-detail-wrapper">
      {/* Sticky Topbar */}
      <nav className="project-detail-topbar">
        <div className="topbar-left">
          <button
            className="topbar-back-btn"
            onClick={() => goToAllWork(project.categorySlug)}
            data-cursor="disable"
          >
            <FaArrowLeft /> {project.category}
          </button>

          <div className="breadcrumb-trail">
            <button onClick={() => goToHome()} data-cursor="disable">
              Home
            </button>
            <span>/</span>
            <button onClick={() => goToAllWork("all")} data-cursor="disable">
              Works
            </button>
            <span>/</span>
            <button
              onClick={() => goToAllWork(project.categorySlug)}
              data-cursor="disable"
            >
              {project.category}
            </button>
            <span>/</span>
            <span className="current-title">{project.name}</span>
          </div>
        </div>

        <div className="topbar-right">
          {nextProject && (
            <button
              className="topbar-nav-pill"
              onClick={() => goToProject(nextProject.id)}
              data-cursor="disable"
              title={`Next in ${(project as any).category}: ${nextProject.name}`}
            >
              Next Project <FaArrowRight />
            </button>
          )}
        </div>
      </nav>

      <main className="project-detail-container">
        {/* Hero Section */}
        <header className="project-hero">
          <div className="project-hero-tags">
            <span
              className="project-category-badge"
              style={{ cursor: "pointer" }}
              onClick={() => goToAllWork(project.categorySlug)}
              title={`View all ${project.category}`}
            >
              {getCategoryIcon(project.categorySlug)} {project.category}
            </span>
            <span className="project-year-badge">{project.year}</span>
          </div>

          <h1 className="project-title">{project.name}</h1>
          <p className="project-tagline">{project.tagline}</p>

          {/* Metadata Strip */}
          <div className="project-meta-strip">
            <div className="meta-item">
              <span className="meta-label">Role</span>
              <span className="meta-value">{project.role}</span>
            </div>

            <div className="meta-item">
              <span className="meta-label">Category</span>
              <span className="meta-value">{project.category}</span>
            </div>

            <div className="meta-item">
              <span className="meta-label">Client / Context</span>
              <span className="meta-value">{project.client}</span>
            </div>

            <div className="meta-item">
              <span className="meta-label">Timeline</span>
              <span className="meta-value">{project.year}</span>
            </div>

            <div className="meta-actions">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="project-action-btn primary"
                  data-cursor="disable"
                >
                  Live Preview <FaArrowUpRightFromSquare />
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="project-action-btn secondary"
                  data-cursor="disable"
                >
                  <FaGithub /> Repository
                </a>
              )}
            </div>
          </div>
        </header>

        {/* Featured Showcase Media */}
        <div className="project-showcase-frame">
          <img src={project.image} alt={project.alt} />
        </div>

        {/* Key Metrics / Impact Bar */}
        {project.metrics && project.metrics.length > 0 && (
          <section
            className="project-metrics-grid"
            aria-label="Key Project Metrics"
          >
            {project.metrics.map((metric: any, idx: number) => (
              <div key={idx} className="metric-card">
                <div className="metric-val">{metric.value}</div>
                <div className="metric-lbl">{metric.label}</div>
              </div>
            ))}
          </section>
        )}

        {/* Section 01: Overview & Vision */}
        <section className="project-section">
          <span className="section-tag">01. Overview & Vision</span>
          <h2 className="section-heading">About The Project</h2>
          <p className="section-body-text">{project.overview}</p>
        </section>

        {/* Section 02: Challenge & Solution */}
        <section className="project-section">
          <span className="section-tag">02. Creative Process</span>
          <h2 className="section-heading">The Challenge & The Solution</h2>

          <div className="challenge-solution-grid">
            <div className="cs-card challenge">
              <div className="cs-header">
                <span className="cs-badge">The Problem</span>
              </div>
              <h3>Obstacles & Bottlenecks</h3>
              <p>{project.challenge}</p>
            </div>

            <div className="cs-card solution">
              <div className="cs-header">
                <span className="cs-badge">The Strategy</span>
              </div>
              <h3>Executed Solution</h3>
              <p>{project.solution}</p>
            </div>
          </div>
        </section>

        {/* Section 03: Key Features & Deliverables */}
        {project.features && project.features.length > 0 && (
          <section className="project-section">
            <span className="section-tag">03. Highlights & Deliverables</span>
            <h2 className="section-heading">Key Features & Elements</h2>

            <div className="features-grid">
              {project.features.map((feat: any, index: number) => (
                <div key={index} className="feature-box">
                  <div className="feature-header">
                    <h3 className="feature-title">{feat.title}</h3>
                    {feat.tag && <span className="feature-tag">{feat.tag}</span>}
                  </div>
                  <p className="feature-desc">{feat.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 04: Tools & Creative Software */}
        <section className="project-section">
          <span className="section-tag">04. Tools & Skills</span>
          <h2 className="section-heading">Tools & Software Used</h2>

          <div className="tech-pills-wrap">
            {project.techStack.map((tech: string) => (
              <span key={tech} className="tech-pill">
                <MdOutlineCheckCircle
                  style={{
                    color: "#c481ff",
                    verticalAlign: "middle",
                    marginRight: "6px",
                  }}
                />
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* Next / Previous Project Navigation */}
        <nav className="project-nav-footer" aria-label="Project Navigation">
          {prevProject && (
            <button
              className="prev-project-btn"
              onClick={() => goToProject(prevProject.id)}
              data-cursor="disable"
            >
              <img
                src={prevProject.image}
                alt={prevProject.name}
                className="nav-thumb"
              />
              <div>
                <div className="nav-direction-label">← Previous Project</div>
                <div className="nav-project-name">{prevProject.name}</div>
              </div>
            </button>
          )}

          <button
            className="all-projects-center-btn"
            onClick={() => goToAllWork((project as any).categorySlug)}
            data-cursor="disable"
          >
            <IoGridOutline /> All {(project as any).category}
          </button>

          {nextProject && (
            <button
              className="next-project-btn"
              onClick={() => goToProject(nextProject.id)}
              data-cursor="disable"
            >
              <img
                src={nextProject.image}
                alt={nextProject.name}
                className="nav-thumb"
              />
              <div>
                <div className="nav-direction-label">Next Project →</div>
                <div className="nav-project-name">{nextProject.name}</div>
              </div>
            </button>
          )}
        </nav>

        {/* Bottom CTA Banner */}
        <section className="project-cta-card">
          <h2>
            Interested in Similar <span>{project.category}</span> Work?
          </h2>
          <p>
            Whether you have a specific requirement or want to discuss ideas,
            feel free to get in touch. Let's create impactful work together.
          </p>
          <button
            className="project-action-btn primary"
            onClick={() => goToHome("contact")}
            style={{ padding: "12px 30px", fontSize: "14px" }}
            data-cursor="disable"
          >
            <FaRegLightbulb /> Let's Discuss Your Project
          </button>
        </section>
      </main>
    </div>
  );
};

export default ProjectDetailPage;
