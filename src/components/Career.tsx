import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Web & UI/UX Designer</h4>
                <h5>Freelance & Design Projects</h5>
              </div>
              <h3>2023</h3>
            </div>
            <p>
              Worked on user interfaces, wireframes, and responsive websites,
              with a focus on how things look and how easy they are to use.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Video Editor & Visual Designer</h4>
                <h5>Creative Media & Branding</h5>
              </div>
              <h3>2024</h3>
            </div>
            <p>
              Edited videos, made motion graphics, logos, mockups, and brand
              visuals for online work.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Creative Developer & Designer</h4>
                <h5>CYPHERR</h5>
              </div>
              <h3>NOW</h3>
            </div>
            <p>
              Building websites and apps, and trying out AI tools in my
              workflow.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
