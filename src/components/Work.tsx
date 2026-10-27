import "./styles/Work.css";
import { categoriesData, CategoryId } from "../data/categoriesData";
import { useNavigation } from "../context/NavigationContext";
import { FaGlobe, FaVideo, FaPalette, FaArrowRight } from "react-icons/fa6";

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

const Work = () => {
  const { goToCategory } = useNavigation();

  return (
    <section className="work-section" id="work">
      <div className="work-container">
        <header className="work-header-row">
          <div>
            <h2>
              My <span>Work</span>
            </h2>
            <p className="work-header-subtitle">
              Select a creative category below to explore dedicated work and case studies
            </p>
          </div>
        </header>

        {/* 3 Categories Grid */}
        <div className="work-categories-grid">
          {categoriesData.map((category, index) => {
            const displayIndex = String(index + 1).padStart(2, "0");

            return (
              <article
                key={category.id}
                className="category-portal-card"
                onClick={() => goToCategory(category.id as CategoryId)}
                data-cursor="disable"
              >
                <div className="portal-top">
                  <span className="portal-badge">
                    {getCategoryIcon(category.iconType)} {category.badge}
                  </span>
                  <span className="portal-index">{displayIndex}</span>
                </div>

                <h3 className="portal-title">{category.title}</h3>
                <p className="portal-tagline">{category.subtitle}</p>
                <p className="portal-desc">{category.description}</p>

                <div className="portal-skills">
                  {category.skills.slice(0, 4).map((skill) => (
                    <span key={skill} className="portal-skill-chip">
                      {skill}
                    </span>
                  ))}
                  {category.skills.length > 4 && (
                    <span className="portal-skill-chip">
                      +{category.skills.length - 4} more
                    </span>
                  )}
                </div>

                <div className="portal-action-btn">
                  Open {category.title} Category <FaArrowRight />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Work;
