const ResumePreview = ({ data, scale = 1 }) => {
  if (!data) return null;
  const { personalInfo: p = {}, education = [], skills = [], experience = [], projects = [], certifications = [], languages = [], interests = [], personalDetails: pd = {} } = data;
  const accent = data.accentColor || "#2563eb";
  const hasPersonalDetails = pd.fatherName || pd.motherName || pd.dateOfBirth || pd.gender || pd.hobbies;

  const formatDate = (date) => {
    if (!date) return "";
    try {
      return new Date(date).toLocaleDateString("en-US", { month: "short", year: "numeric" });
    } catch {
      return date;
    }
  };

  const renderTemplate = () => {
    switch (data.template) {
      case "modern":
        return <ModernTemplate p={p} education={education} skills={skills} experience={experience} projects={projects} certifications={certifications} languages={languages} interests={interests} accent={accent} formatDate={formatDate} />;
      case "professional":
        return <ProfessionalTemplate p={p} education={education} skills={skills} experience={experience} projects={projects} certifications={certifications} languages={languages} interests={interests} accent={accent} formatDate={formatDate} />;
      case "creative":
        return <CreativeTemplate p={p} education={education} skills={skills} experience={experience} projects={projects} certifications={certifications} languages={languages} interests={interests} accent={accent} formatDate={formatDate} />;
      case "minimal":
        return <MinimalTemplate p={p} education={education} skills={skills} experience={experience} projects={projects} certifications={certifications} languages={languages} interests={interests} accent={accent} formatDate={formatDate} />;
      case "harvard":
        return <HarvardTemplate p={p} education={education} skills={skills} experience={experience} projects={projects} certifications={certifications} languages={languages} interests={interests} accent={accent} formatDate={formatDate} />;
      case "ats":
        return <ATSTemplate p={p} education={education} skills={skills} experience={experience} projects={projects} certifications={certifications} languages={languages} interests={interests} accent={accent} formatDate={formatDate} />;
      case "elegant":
        return <ElegantTemplate p={p} education={education} skills={skills} experience={experience} projects={projects} certifications={certifications} languages={languages} interests={interests} accent={accent} formatDate={formatDate} />;
      case "compact":
        return <CompactTemplate p={p} education={education} skills={skills} experience={experience} projects={projects} certifications={certifications} languages={languages} interests={interests} accent={accent} formatDate={formatDate} />;
      case "bold":
        return <BoldTemplate p={p} education={education} skills={skills} experience={experience} projects={projects} certifications={certifications} languages={languages} interests={interests} accent={accent} formatDate={formatDate} />;
      case "classic":
        return <ClassicTemplate p={p} education={education} skills={skills} experience={experience} projects={projects} certifications={certifications} languages={languages} interests={interests} accent={accent} formatDate={formatDate} />;
      case "tech":
        return <TechTemplate p={p} education={education} skills={skills} experience={experience} projects={projects} certifications={certifications} languages={languages} interests={interests} accent={accent} formatDate={formatDate} />;
      case "executive":
        return <ExecutiveTemplate p={p} education={education} skills={skills} experience={experience} projects={projects} certifications={certifications} languages={languages} interests={interests} accent={accent} formatDate={formatDate} />;
      case "sidebar":
        return <SidebarTemplate p={p} education={education} skills={skills} experience={experience} projects={projects} certifications={certifications} languages={languages} interests={interests} accent={accent} formatDate={formatDate} />;
      case "gradient":
        return <GradientTemplate p={p} education={education} skills={skills} experience={experience} projects={projects} certifications={certifications} languages={languages} interests={interests} accent={accent} formatDate={formatDate} />;
      case "clean":
        return <CleanTemplate p={p} education={education} skills={skills} experience={experience} projects={projects} certifications={certifications} languages={languages} interests={interests} accent={accent} formatDate={formatDate} />;
      case "timeline":
        return <TimelineTemplate p={p} education={education} skills={skills} experience={experience} projects={projects} certifications={certifications} languages={languages} interests={interests} accent={accent} formatDate={formatDate} />;
      case "twocolumn":
        return <TwoColumnTemplate p={p} education={education} skills={skills} experience={experience} projects={projects} certifications={certifications} languages={languages} interests={interests} accent={accent} formatDate={formatDate} />;
      case "metro":
        return <MetroTemplate p={p} education={education} skills={skills} experience={experience} projects={projects} certifications={certifications} languages={languages} interests={interests} accent={accent} formatDate={formatDate} />;
      case "academic":
        return <AcademicTemplate p={p} education={education} skills={skills} experience={experience} projects={projects} certifications={certifications} languages={languages} interests={interests} accent={accent} formatDate={formatDate} />;
      case "infographic":
        return <InfographicTemplate p={p} education={education} skills={skills} experience={experience} projects={projects} certifications={certifications} languages={languages} interests={interests} accent={accent} formatDate={formatDate} />;
      case "nordic":
        return <NordicTemplate p={p} education={education} skills={skills} experience={experience} projects={projects} certifications={certifications} languages={languages} interests={interests} accent={accent} formatDate={formatDate} />;
      case "corporate":
        return <CorporateTemplate p={p} education={education} skills={skills} experience={experience} projects={projects} certifications={certifications} languages={languages} interests={interests} accent={accent} formatDate={formatDate} />;
      case "magazine":
        return <MagazineTemplate p={p} education={education} skills={skills} experience={experience} projects={projects} certifications={certifications} languages={languages} interests={interests} accent={accent} formatDate={formatDate} />;
      case "devsimple":
        return <DevSimpleTemplate p={p} education={education} skills={skills} experience={experience} projects={projects} certifications={certifications} languages={languages} interests={interests} accent={accent} formatDate={formatDate} />;
      case "diamond":
        return <DiamondTemplate p={p} education={education} skills={skills} experience={experience} projects={projects} certifications={certifications} languages={languages} interests={interests} accent={accent} formatDate={formatDate} />;
      default:
        return <ModernTemplate p={p} education={education} skills={skills} experience={experience} projects={projects} certifications={certifications} languages={languages} interests={interests} accent={accent} formatDate={formatDate} />;
    }
  };

  return (
    <div
      id="resume-preview"
      className="resume-preview bg-white text-black shadow-lg mx-auto"
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "20mm 18mm",
        boxSizing: "border-box",
        transform: `scale(${scale})`,
        transformOrigin: "top center",
      }}
    >
      {renderTemplate()}
      {hasPersonalDetails && <PersonalDetailsBlock pd={pd} accent={accent} />}
    </div>
  );
};

// Shared section helpers
const SectionTitle = ({ children, accent }) => (
  <h2 style={{ color: accent, borderBottom: `2px solid ${accent}`, paddingBottom: "4px", marginBottom: "8px", fontSize: "14px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>
    {children}
  </h2>
);

const PersonalDetailsBlock = ({ pd, accent }) => {
  const formatDOB = (d) => {
    if (!d) return "";
    try { return new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" }); } catch { return d; }
  };
  return (
    <div style={{ padding: "0 32px 24px" }}>
      <h2 style={{ color: accent, borderBottom: `2px solid ${accent}`, paddingBottom: "4px", marginBottom: "10px", fontSize: "14px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>Personal Details</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 24px", fontSize: "11px", color: "#333" }}>
        {pd.fatherName && <><span style={{ fontWeight: "600" }}>Father's Name:</span><span>{pd.fatherName}</span></>}
        {pd.motherName && <><span style={{ fontWeight: "600" }}>Mother's Name:</span><span>{pd.motherName}</span></>}
        {pd.dateOfBirth && <><span style={{ fontWeight: "600" }}>Date of Birth:</span><span>{formatDOB(pd.dateOfBirth)}</span></>}
        {pd.gender && <><span style={{ fontWeight: "600" }}>Gender:</span><span>{pd.gender}</span></>}
        {pd.hobbies && <><span style={{ fontWeight: "600" }}>Hobbies:</span><span>{pd.hobbies}</span></>}
      </div>
    </div>
  );
};

const ContactLine = ({ p }) => (
  <div style={{ fontSize: "11px", color: "#555", display: "flex", flexWrap: "wrap", gap: "8px" }}>
    {p.email && <span>{p.email}</span>}
    {p.phone && <span>• {p.phone}</span>}
    {p.location && <span>• {p.location}</span>}
    {p.linkedin && <span>• {p.linkedin}</span>}
    {p.github && <span>• {p.github}</span>}
    {p.website && <span>• {p.website}</span>}
  </div>
);

// ============ MODERN ============
const ModernTemplate = ({ p, education, skills, experience, projects, certifications, languages, interests, accent, formatDate }) => (
  <div style={{ padding: "32px" }}>
    <div style={{ textAlign: "center", marginBottom: "20px" }}>
      <h1 style={{ fontSize: "26px", fontWeight: "800", color: "#1a1a1a" }}>{p.fullName || "Your Name"}</h1>
      {p.jobTitle && <p style={{ fontSize: "14px", color: accent, fontWeight: "600", marginTop: "4px" }}>{p.jobTitle}</p>}
      <div style={{ marginTop: "8px" }}><ContactLine p={p} /></div>
    </div>
    {p.summary && (
      <div style={{ marginBottom: "16px" }}>
        <SectionTitle accent={accent}>Summary</SectionTitle>
        <p style={{ fontSize: "11px", lineHeight: "1.6", color: "#333" }}>{p.summary}</p>
      </div>
    )}
    {experience.length > 0 && (
      <div style={{ marginBottom: "16px" }}>
        <SectionTitle accent={accent}>Experience</SectionTitle>
        {experience.map((e, i) => (
          <div key={i} style={{ marginBottom: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <strong style={{ fontSize: "12px" }}>{e.position || "Position"}</strong>
              <span style={{ fontSize: "10px", color: "#777" }}>{formatDate(e.startDate)} - {e.current ? "Present" : formatDate(e.endDate)}</span>
            </div>
            <p style={{ fontSize: "11px", color: accent, fontWeight: "600" }}>{e.company}{e.location ? `, ${e.location}` : ""}</p>
            <p style={{ fontSize: "11px", lineHeight: "1.5", color: "#444", marginTop: "4px" }}>{e.description}</p>
          </div>
        ))}
      </div>
    )}
    {projects.length > 0 && (
      <div style={{ marginBottom: "16px" }}>
        <SectionTitle accent={accent}>Projects</SectionTitle>
        {projects.map((proj, i) => (
          <div key={i} style={{ marginBottom: "8px" }}>
            <strong style={{ fontSize: "12px" }}>{proj.name}</strong>
            {proj.techStack && <span style={{ fontSize: "10px", color: "#777" }}> — {proj.techStack}</span>}
            <p style={{ fontSize: "11px", lineHeight: "1.5", color: "#444" }}>{proj.description}</p>
          </div>
        ))}
      </div>
    )}
    <div style={{ display: "flex", gap: "24px" }}>
      {education.length > 0 && (
        <div style={{ flex: 1 }}>
          <SectionTitle accent={accent}>Education</SectionTitle>
          {education.map((e, i) => (
            <div key={i} style={{ marginBottom: "8px" }}>
              <strong style={{ fontSize: "12px" }}>{e.degree}{e.field ? ` in ${e.field}` : ""}</strong>
              <p style={{ fontSize: "11px", color: "#555" }}>{e.institution}</p>
              <p style={{ fontSize: "10px", color: "#777" }}>{formatDate(e.startDate)} - {formatDate(e.endDate)}{e.grade ? ` • ${e.grade}` : ""}</p>
            </div>
          ))}
        </div>
      )}
      {skills.length > 0 && (
        <div style={{ flex: 1 }}>
          <SectionTitle accent={accent}>Skills</SectionTitle>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
            {skills.map((s, i) => <span key={i} style={{ fontSize: "10px", background: "#f0f0f0", padding: "2px 8px", borderRadius: "4px" }}>{s}</span>)}
          </div>
        </div>
      )}
    </div>
    {(certifications.length > 0 || languages.length > 0 || interests.length > 0) && (
      <div style={{ display: "flex", gap: "24px", marginTop: "16px" }}>
        {certifications.length > 0 && (
          <div style={{ flex: 1 }}>
            <SectionTitle accent={accent}>Certifications</SectionTitle>
            {certifications.map((c, i) => <p key={i} style={{ fontSize: "11px" }}>{c.name} — {c.issuer} ({c.date})</p>)}
          </div>
        )}
        {languages.length > 0 && (
          <div style={{ flex: 1 }}>
            <SectionTitle accent={accent}>Languages</SectionTitle>
            <p style={{ fontSize: "11px" }}>{languages.join(", ")}</p>
          </div>
        )}
        {interests.length > 0 && (
          <div style={{ flex: 1 }}>
            <SectionTitle accent={accent}>Interests</SectionTitle>
            <p style={{ fontSize: "11px" }}>{interests.join(", ")}</p>
          </div>
        )}
      </div>
    )}
  </div>
);

// ============ PROFESSIONAL ============
const ProfessionalTemplate = ({ p, education, skills, experience, projects, certifications, languages, interests, accent, formatDate }) => (
  <div style={{ padding: "32px", fontFamily: "Georgia, serif" }}>
    <div style={{ borderBottom: `3px solid ${accent}`, paddingBottom: "12px", marginBottom: "16px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#1a1a1a" }}>{p.fullName || "Your Name"}</h1>
      {p.jobTitle && <p style={{ fontSize: "13px", color: "#555", fontStyle: "italic" }}>{p.jobTitle}</p>}
      <div style={{ marginTop: "6px" }}><ContactLine p={p} /></div>
    </div>
    {p.summary && (
      <div style={{ marginBottom: "16px" }}>
        <SectionTitle accent={accent}>Professional Summary</SectionTitle>
        <p style={{ fontSize: "11px", lineHeight: "1.6", color: "#333" }}>{p.summary}</p>
      </div>
    )}
    {experience.length > 0 && (
      <div style={{ marginBottom: "16px" }}>
        <SectionTitle accent={accent}>Work Experience</SectionTitle>
        {experience.map((e, i) => (
          <div key={i} style={{ marginBottom: "10px", borderLeft: `3px solid ${accent}`, paddingLeft: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <strong style={{ fontSize: "12px" }}>{e.position} at {e.company}</strong>
              <span style={{ fontSize: "10px", color: "#777" }}>{formatDate(e.startDate)} - {e.current ? "Present" : formatDate(e.endDate)}</span>
            </div>
            <p style={{ fontSize: "11px", lineHeight: "1.5", color: "#444", marginTop: "2px" }}>{e.description}</p>
          </div>
        ))}
      </div>
    )}
    {projects.length > 0 && (
      <div style={{ marginBottom: "16px" }}>
        <SectionTitle accent={accent}>Projects</SectionTitle>
        {projects.map((proj, i) => (
          <div key={i} style={{ marginBottom: "6px" }}>
            <strong style={{ fontSize: "12px" }}>{proj.name}</strong>
            <p style={{ fontSize: "11px", lineHeight: "1.5", color: "#444" }}>{proj.description}</p>
          </div>
        ))}
      </div>
    )}
    <div style={{ display: "flex", gap: "24px" }}>
      {education.length > 0 && (
        <div style={{ flex: 1 }}>
          <SectionTitle accent={accent}>Education</SectionTitle>
          {education.map((e, i) => (
            <div key={i} style={{ marginBottom: "6px" }}>
              <strong style={{ fontSize: "11px" }}>{e.degree}{e.field ? ` in ${e.field}` : ""}</strong>
              <p style={{ fontSize: "11px", color: "#555" }}>{e.institution} | {formatDate(e.startDate)} - {formatDate(e.endDate)}</p>
            </div>
          ))}
        </div>
      )}
      {skills.length > 0 && (
        <div style={{ flex: 1 }}>
          <SectionTitle accent={accent}>Skills</SectionTitle>
          <p style={{ fontSize: "11px", lineHeight: "1.8" }}>{skills.join(" • ")}</p>
        </div>
      )}
    </div>
    {(certifications.length > 0 || languages.length > 0) && (
      <div style={{ display: "flex", gap: "24px", marginTop: "12px" }}>
        {certifications.length > 0 && (
          <div style={{ flex: 1 }}>
            <SectionTitle accent={accent}>Certifications</SectionTitle>
            {certifications.map((c, i) => <p key={i} style={{ fontSize: "11px" }}>{c.name} — {c.issuer}</p>)}
          </div>
        )}
        {languages.length > 0 && (
          <div style={{ flex: 1 }}>
            <SectionTitle accent={accent}>Languages</SectionTitle>
            <p style={{ fontSize: "11px" }}>{languages.join(", ")}</p>
          </div>
        )}
      </div>
    )}
  </div>
);

// ============ CREATIVE ============
const CreativeTemplate = ({ p, education, skills, experience, projects, certifications, languages, interests, accent, formatDate }) => (
  <div style={{ display: "flex", minHeight: "297mm" }}>
    <div style={{ width: "35%", background: accent, color: "white", padding: "24px" }}>
      {p.photo && <img src={p.photo} alt="" style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover", marginBottom: "16px", display: "block", margin: "0 auto 16px" }} />}
      <h1 style={{ fontSize: "22px", fontWeight: "800", textAlign: "center" }}>{p.fullName || "Your Name"}</h1>
      {p.jobTitle && <p style={{ fontSize: "12px", textAlign: "center", opacity: "0.9", marginBottom: "20px" }}>{p.jobTitle}</p>}
      <div style={{ fontSize: "10px", lineHeight: "1.8" }}>
        {p.email && <p>✉ {p.email}</p>}
        {p.phone && <p>☎ {p.phone}</p>}
        {p.location && <p>📍 {p.location}</p>}
        {p.linkedin && <p>🔗 {p.linkedin}</p>}
        {p.github && <p>⌨ {p.github}</p>}
      </div>
      {skills.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h2 style={{ fontSize: "13px", fontWeight: "700", borderBottom: "2px solid rgba(255,255,255,0.3)", paddingBottom: "4px", marginBottom: "8px" }}>SKILLS</h2>
          {skills.map((s, i) => <p key={i} style={{ fontSize: "10px", marginBottom: "4px" }}>• {s}</p>)}
        </div>
      )}
      {languages.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h2 style={{ fontSize: "13px", fontWeight: "700", borderBottom: "2px solid rgba(255,255,255,0.3)", paddingBottom: "4px", marginBottom: "8px" }}>LANGUAGES</h2>
          {languages.map((l, i) => <p key={i} style={{ fontSize: "10px" }}>{l}</p>)}
        </div>
      )}
      {interests.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h2 style={{ fontSize: "13px", fontWeight: "700", borderBottom: "2px solid rgba(255,255,255,0.3)", paddingBottom: "4px", marginBottom: "8px" }}>INTERESTS</h2>
          <p style={{ fontSize: "10px" }}>{interests.join(", ")}</p>
        </div>
      )}
    </div>
    <div style={{ flex: 1, padding: "24px" }}>
      {p.summary && (
        <div style={{ marginBottom: "16px" }}>
          <SectionTitle accent={accent}>About Me</SectionTitle>
          <p style={{ fontSize: "11px", lineHeight: "1.6", color: "#333" }}>{p.summary}</p>
        </div>
      )}
      {experience.length > 0 && (
        <div style={{ marginBottom: "16px" }}>
          <SectionTitle accent={accent}>Experience</SectionTitle>
          {experience.map((e, i) => (
            <div key={i} style={{ marginBottom: "10px" }}>
              <strong style={{ fontSize: "12px", color: accent }}>{e.position}</strong>
              <p style={{ fontSize: "11px", color: "#555" }}>{e.company} | {formatDate(e.startDate)} - {e.current ? "Present" : formatDate(e.endDate)}</p>
              <p style={{ fontSize: "11px", lineHeight: "1.5", color: "#444" }}>{e.description}</p>
            </div>
          ))}
        </div>
      )}
      {projects.length > 0 && (
        <div style={{ marginBottom: "16px" }}>
          <SectionTitle accent={accent}>Projects</SectionTitle>
          {projects.map((proj, i) => (
            <div key={i} style={{ marginBottom: "6px" }}>
              <strong style={{ fontSize: "12px" }}>{proj.name}</strong>
              <p style={{ fontSize: "11px", lineHeight: "1.5", color: "#444" }}>{proj.description}</p>
            </div>
          ))}
        </div>
      )}
      {education.length > 0 && (
        <div style={{ marginBottom: "16px" }}>
          <SectionTitle accent={accent}>Education</SectionTitle>
          {education.map((e, i) => (
            <div key={i} style={{ marginBottom: "6px" }}>
              <strong style={{ fontSize: "12px" }}>{e.degree}{e.field ? ` in ${e.field}` : ""}</strong>
              <p style={{ fontSize: "11px", color: "#555" }}>{e.institution} | {formatDate(e.startDate)} - {formatDate(e.endDate)}</p>
            </div>
          ))}
        </div>
      )}
      {certifications.length > 0 && (
        <div>
          <SectionTitle accent={accent}>Certifications</SectionTitle>
          {certifications.map((c, i) => <p key={i} style={{ fontSize: "11px" }}>{c.name} — {c.issuer} ({c.date})</p>)}
        </div>
      )}
    </div>
  </div>
);

// ============ MINIMAL ============
const MinimalTemplate = ({ p, education, skills, experience, projects, certifications, languages, interests, accent, formatDate }) => (
  <div style={{ padding: "40px", fontFamily: "system-ui, sans-serif" }}>
    <div style={{ marginBottom: "24px" }}>
      <h1 style={{ fontSize: "22px", fontWeight: "600", color: "#1a1a1a" }}>{p.fullName || "Your Name"}</h1>
      {p.jobTitle && <p style={{ fontSize: "13px", color: "#888" }}>{p.jobTitle}</p>}
      <div style={{ marginTop: "6px" }}><ContactLine p={p} /></div>
    </div>
    {p.summary && <p style={{ fontSize: "11px", lineHeight: "1.7", color: "#444", marginBottom: "20px" }}>{p.summary}</p>}
    {experience.length > 0 && (
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ fontSize: "12px", fontWeight: "600", color: "#1a1a1a", marginBottom: "8px" }}>Experience</h2>
        {experience.map((e, i) => (
          <div key={i} style={{ marginBottom: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "12px", fontWeight: "500" }}>{e.position}, {e.company}</span>
              <span style={{ fontSize: "10px", color: "#999" }}>{formatDate(e.startDate)} - {e.current ? "Present" : formatDate(e.endDate)}</span>
            </div>
            <p style={{ fontSize: "11px", lineHeight: "1.5", color: "#555", marginTop: "2px" }}>{e.description}</p>
          </div>
        ))}
      </div>
    )}
    {projects.length > 0 && (
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ fontSize: "12px", fontWeight: "600", color: "#1a1a1a", marginBottom: "8px" }}>Projects</h2>
        {projects.map((proj, i) => (
          <div key={i} style={{ marginBottom: "6px" }}>
            <span style={{ fontSize: "12px", fontWeight: "500" }}>{proj.name}</span>
            <p style={{ fontSize: "11px", lineHeight: "1.5", color: "#555" }}>{proj.description}</p>
          </div>
        ))}
      </div>
    )}
    {education.length > 0 && (
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ fontSize: "12px", fontWeight: "600", color: "#1a1a1a", marginBottom: "8px" }}>Education</h2>
        {education.map((e, i) => (
          <div key={i} style={{ marginBottom: "6px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "12px", fontWeight: "500" }}>{e.degree}{e.field ? ` in ${e.field}` : ""}, {e.institution}</span>
              <span style={{ fontSize: "10px", color: "#999" }}>{formatDate(e.startDate)} - {formatDate(e.endDate)}</span>
            </div>
          </div>
        ))}
      </div>
    )}
    {skills.length > 0 && (
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ fontSize: "12px", fontWeight: "600", color: "#1a1a1a", marginBottom: "8px" }}>Skills</h2>
        <p style={{ fontSize: "11px", color: "#555" }}>{skills.join(" · ")}</p>
      </div>
    )}
    {(certifications.length > 0 || languages.length > 0 || interests.length > 0) && (
      <div style={{ display: "flex", gap: "24px" }}>
        {certifications.length > 0 && <div><h2 style={{ fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>Certifications</h2>{certifications.map((c, i) => <p key={i} style={{ fontSize: "11px", color: "#555" }}>{c.name}</p>)}</div>}
        {languages.length > 0 && <div><h2 style={{ fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>Languages</h2><p style={{ fontSize: "11px", color: "#555" }}>{languages.join(", ")}</p></div>}
        {interests.length > 0 && <div><h2 style={{ fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>Interests</h2><p style={{ fontSize: "11px", color: "#555" }}>{interests.join(", ")}</p></div>}
      </div>
    )}
  </div>
);

// ============ HARVARD ============
const HarvardTemplate = ({ p, education, skills, experience, projects, certifications, languages, interests, accent, formatDate }) => (
  <div style={{ padding: "36px", fontFamily: "Georgia, serif" }}>
    <div style={{ textAlign: "center", marginBottom: "20px", borderBottom: `2px solid ${accent}`, paddingBottom: "12px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px", color: accent }}>{p.fullName || "Your Name"}</h1>
      <div style={{ marginTop: "6px" }}><ContactLine p={p} /></div>
    </div>
    {p.summary && (
      <div style={{ marginBottom: "16px" }}>
        <h2 style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", color: accent, marginBottom: "6px" }}>Summary</h2>
        <p style={{ fontSize: "11px", lineHeight: "1.6", color: "#333" }}>{p.summary}</p>
      </div>
    )}
    {experience.length > 0 && (
      <div style={{ marginBottom: "16px" }}>
        <h2 style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", color: accent, marginBottom: "6px" }}>Experience</h2>
        {experience.map((e, i) => (
          <div key={i} style={{ marginBottom: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <strong style={{ fontSize: "12px" }}>{e.position}, {e.company}</strong>
              <span style={{ fontSize: "10px", color: "#777" }}>{formatDate(e.startDate)} - {e.current ? "Present" : formatDate(e.endDate)}</span>
            </div>
            <p style={{ fontSize: "11px", lineHeight: "1.5", color: "#444", marginTop: "2px" }}>{e.description}</p>
          </div>
        ))}
      </div>
    )}
    {education.length > 0 && (
      <div style={{ marginBottom: "16px" }}>
        <h2 style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", color: accent, marginBottom: "6px" }}>Education</h2>
        {education.map((e, i) => (
          <div key={i} style={{ marginBottom: "6px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <strong style={{ fontSize: "12px" }}>{e.degree}{e.field ? ` in ${e.field}` : ""}, {e.institution}</strong>
              <span style={{ fontSize: "10px", color: "#777" }}>{formatDate(e.startDate)} - {formatDate(e.endDate)}</span>
            </div>
            {e.grade && <p style={{ fontSize: "11px", color: "#555" }}>{e.grade}</p>}
          </div>
        ))}
      </div>
    )}
    {projects.length > 0 && (
      <div style={{ marginBottom: "16px" }}>
        <h2 style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", color: accent, marginBottom: "6px" }}>Projects</h2>
        {projects.map((proj, i) => (
          <div key={i} style={{ marginBottom: "6px" }}>
            <strong style={{ fontSize: "12px" }}>{proj.name}</strong>
            <p style={{ fontSize: "11px", lineHeight: "1.5", color: "#444" }}>{proj.description}</p>
          </div>
        ))}
      </div>
    )}
    {skills.length > 0 && (
      <div style={{ marginBottom: "16px" }}>
        <h2 style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", color: accent, marginBottom: "6px" }}>Skills</h2>
        <p style={{ fontSize: "11px", color: "#444" }}>{skills.join(" • ")}</p>
      </div>
    )}
    {(certifications.length > 0 || languages.length > 0) && (
      <div style={{ display: "flex", gap: "24px" }}>
        {certifications.length > 0 && <div><h2 style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", color: accent, marginBottom: "4px" }}>Certifications</h2>{certifications.map((c, i) => <p key={i} style={{ fontSize: "11px" }}>{c.name}, {c.issuer}</p>)}</div>}
        {languages.length > 0 && <div><h2 style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", color: accent, marginBottom: "4px" }}>Languages</h2><p style={{ fontSize: "11px" }}>{languages.join(", ")}</p></div>}
      </div>
    )}
  </div>
);

// ============ ATS FRIENDLY ============
const ATSTemplate = ({ p, education, skills, experience, projects, certifications, languages, interests, accent, formatDate }) => (
  <div style={{ padding: "32px", fontFamily: "Times New Roman, serif", color: "#000" }}>
    <div style={{ textAlign: "center", marginBottom: "16px" }}>
      <h1 style={{ fontSize: "22px", fontWeight: "bold" }}>{p.fullName || "Your Name"}</h1>
      {p.jobTitle && <p style={{ fontSize: "13px" }}>{p.jobTitle}</p>}
      <p style={{ fontSize: "11px", marginTop: "4px" }}>
        {[p.email, p.phone, p.location, p.linkedin, p.github].filter(Boolean).join(" | ")}
      </p>
    </div>
    {p.summary && (
      <div style={{ marginBottom: "14px" }}>
        <h2 style={{ fontSize: "13px", fontWeight: "bold", textTransform: "uppercase", borderBottom: "1px solid #000", marginBottom: "6px" }}>Summary</h2>
        <p style={{ fontSize: "11px", lineHeight: "1.5" }}>{p.summary}</p>
      </div>
    )}
    {experience.length > 0 && (
      <div style={{ marginBottom: "14px" }}>
        <h2 style={{ fontSize: "13px", fontWeight: "bold", textTransform: "uppercase", borderBottom: "1px solid #000", marginBottom: "6px" }}>Experience</h2>
        {experience.map((e, i) => (
          <div key={i} style={{ marginBottom: "8px" }}>
            <p style={{ fontSize: "12px", fontWeight: "bold" }}>{e.position} | {e.company}, {e.location}</p>
            <p style={{ fontSize: "10px", fontStyle: "italic" }}>{formatDate(e.startDate)} - {e.current ? "Present" : formatDate(e.endDate)}</p>
            <p style={{ fontSize: "11px", lineHeight: "1.5", marginTop: "2px" }}>{e.description}</p>
          </div>
        ))}
      </div>
    )}
    {education.length > 0 && (
      <div style={{ marginBottom: "14px" }}>
        <h2 style={{ fontSize: "13px", fontWeight: "bold", textTransform: "uppercase", borderBottom: "1px solid #000", marginBottom: "6px" }}>Education</h2>
        {education.map((e, i) => (
          <div key={i} style={{ marginBottom: "6px" }}>
            <p style={{ fontSize: "12px", fontWeight: "bold" }}>{e.degree}{e.field ? ` in ${e.field}` : ""} | {e.institution}</p>
            <p style={{ fontSize: "10px" }}>{formatDate(e.startDate)} - {formatDate(e.endDate)}{e.grade ? ` | GPA: ${e.grade}` : ""}</p>
          </div>
        ))}
      </div>
    )}
    {skills.length > 0 && (
      <div style={{ marginBottom: "14px" }}>
        <h2 style={{ fontSize: "13px", fontWeight: "bold", textTransform: "uppercase", borderBottom: "1px solid #000", marginBottom: "6px" }}>Skills</h2>
        <p style={{ fontSize: "11px" }}>{skills.join(", ")}</p>
      </div>
    )}
    {projects.length > 0 && (
      <div style={{ marginBottom: "14px" }}>
        <h2 style={{ fontSize: "13px", fontWeight: "bold", textTransform: "uppercase", borderBottom: "1px solid #000", marginBottom: "6px" }}>Projects</h2>
        {projects.map((proj, i) => (
          <div key={i} style={{ marginBottom: "4px" }}>
            <p style={{ fontSize: "12px", fontWeight: "bold" }}>{proj.name}{proj.techStack ? ` (${proj.techStack})` : ""}</p>
            <p style={{ fontSize: "11px", lineHeight: "1.5" }}>{proj.description}</p>
          </div>
        ))}
      </div>
    )}
    {(certifications.length > 0 || languages.length > 0) && (
      <div style={{ display: "flex", gap: "24px" }}>
        {certifications.length > 0 && <div><h2 style={{ fontSize: "13px", fontWeight: "bold", textTransform: "uppercase", borderBottom: "1px solid #000", marginBottom: "4px" }}>Certifications</h2>{certifications.map((c, i) => <p key={i} style={{ fontSize: "11px" }}>{c.name}, {c.issuer}, {c.date}</p>)}</div>}
        {languages.length > 0 && <div><h2 style={{ fontSize: "13px", fontWeight: "bold", textTransform: "uppercase", borderBottom: "1px solid #000", marginBottom: "4px" }}>Languages</h2><p style={{ fontSize: "11px" }}>{languages.join(", ")}</p></div>}
      </div>
    )}
  </div>
);

// Reuse for remaining templates with slight variations
const ElegantTemplate = ({ p, education, skills, experience, projects, certifications, languages, interests, accent, formatDate }) => (
  <div style={{ padding: "36px" }}>
    <div style={{ textAlign: "center", marginBottom: "20px" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "300", letterSpacing: "3px", color: accent }}>{p.fullName || "Your Name"}</h1>
      <div style={{ width: "60px", height: "2px", background: accent, margin: "8px auto" }} />
      {p.jobTitle && <p style={{ fontSize: "13px", color: "#666", letterSpacing: "1px" }}>{p.jobTitle}</p>}
      <div style={{ marginTop: "8px" }}><ContactLine p={p} /></div>
    </div>
    {p.summary && <p style={{ fontSize: "11px", lineHeight: "1.7", color: "#444", textAlign: "center", maxWidth: "80%", margin: "0 auto 20px" }}>{p.summary}</p>}
    {experience.length > 0 && <div style={{ marginBottom: "16px" }}><SectionTitle accent={accent}>Experience</SectionTitle>{experience.map((e, i) => <div key={i} style={{ marginBottom: "10px" }}><div style={{ display: "flex", justifyContent: "space-between" }}><strong style={{ fontSize: "12px" }}>{e.position}</strong><span style={{ fontSize: "10px", color: "#999" }}>{formatDate(e.startDate)} - {e.current ? "Present" : formatDate(e.endDate)}</span></div><p style={{ fontSize: "11px", color: accent }}>{e.company}</p><p style={{ fontSize: "11px", lineHeight: "1.5", color: "#444" }}>{e.description}</p></div>)}</div>}
    {projects.length > 0 && <div style={{ marginBottom: "16px" }}><SectionTitle accent={accent}>Projects</SectionTitle>{projects.map((proj, i) => <div key={i} style={{ marginBottom: "6px" }}><strong style={{ fontSize: "12px" }}>{proj.name}</strong><p style={{ fontSize: "11px", lineHeight: "1.5", color: "#444" }}>{proj.description}</p></div>)}</div>}
    <div style={{ display: "flex", gap: "24px" }}>
      {education.length > 0 && <div style={{ flex: 1 }}><SectionTitle accent={accent}>Education</SectionTitle>{education.map((e, i) => <div key={i} style={{ marginBottom: "6px" }}><strong style={{ fontSize: "12px" }}>{e.degree}{e.field ? ` in ${e.field}` : ""}</strong><p style={{ fontSize: "11px", color: "#555" }}>{e.institution}</p></div>)}</div>}
      {skills.length > 0 && <div style={{ flex: 1 }}><SectionTitle accent={accent}>Skills</SectionTitle><p style={{ fontSize: "11px", lineHeight: "1.8" }}>{skills.join(" • ")}</p></div>}
    </div>
  </div>
);

const CompactTemplate = ({ p, education, skills, experience, projects, certifications, languages, interests, accent, formatDate }) => (
  <div style={{ padding: "24px", fontSize: "10px" }}>
    <div style={{ marginBottom: "12px" }}>
      <h1 style={{ fontSize: "20px", fontWeight: "700", color: accent }}>{p.fullName || "Your Name"}</h1>
      {p.jobTitle && <p style={{ fontSize: "11px", color: "#666" }}>{p.jobTitle}</p>}
      <div style={{ marginTop: "4px" }}><ContactLine p={p} /></div>
    </div>
    {p.summary && <p style={{ fontSize: "10px", lineHeight: "1.5", color: "#444", marginBottom: "10px" }}>{p.summary}</p>}
    {experience.length > 0 && <div style={{ marginBottom: "10px" }}><h2 style={{ fontSize: "11px", fontWeight: "700", color: accent, borderBottom: `1px solid ${accent}`, marginBottom: "4px" }}>EXPERIENCE</h2>{experience.map((e, i) => <div key={i} style={{ marginBottom: "6px" }}><strong style={{ fontSize: "11px" }}>{e.position}, {e.company}</strong><span style={{ fontSize: "9px", color: "#999" }}> ({formatDate(e.startDate)} - {e.current ? "Present" : formatDate(e.endDate)})</span><p style={{ fontSize: "10px", lineHeight: "1.4", color: "#444" }}>{e.description}</p></div>)}</div>}
    {projects.length > 0 && <div style={{ marginBottom: "10px" }}><h2 style={{ fontSize: "11px", fontWeight: "700", color: accent, borderBottom: `1px solid ${accent}`, marginBottom: "4px" }}>PROJECTS</h2>{projects.map((proj, i) => <div key={i} style={{ marginBottom: "4px" }}><strong style={{ fontSize: "11px" }}>{proj.name}</strong><p style={{ fontSize: "10px", lineHeight: "1.4", color: "#444" }}>{proj.description}</p></div>)}</div>}
    <div style={{ display: "flex", gap: "16px" }}>
      {education.length > 0 && <div style={{ flex: 1 }}><h2 style={{ fontSize: "11px", fontWeight: "700", color: accent, borderBottom: `1px solid ${accent}`, marginBottom: "4px" }}>EDUCATION</h2>{education.map((e, i) => <p key={i} style={{ fontSize: "10px" }}><strong>{e.degree}</strong>, {e.institution}</p>)}</div>}
      {skills.length > 0 && <div style={{ flex: 1 }}><h2 style={{ fontSize: "11px", fontWeight: "700", color: accent, borderBottom: `1px solid ${accent}`, marginBottom: "4px" }}>SKILLS</h2><p style={{ fontSize: "10px" }}>{skills.join(", ")}</p></div>}
    </div>
  </div>
);

const BoldTemplate = ({ p, education, skills, experience, projects, certifications, languages, interests, accent, formatDate }) => (
  <div style={{ padding: "32px" }}>
    <div style={{ background: accent, color: "white", padding: "20px", margin: "-32px -32px 20px -32px" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "900" }}>{p.fullName || "Your Name"}</h1>
      {p.jobTitle && <p style={{ fontSize: "14px", opacity: "0.9" }}>{p.jobTitle}</p>}
      <p style={{ fontSize: "11px", marginTop: "6px", opacity: "0.8" }}>{[p.email, p.phone, p.location, p.linkedin].filter(Boolean).join(" | ")}</p>
    </div>
    {p.summary && <p style={{ fontSize: "11px", lineHeight: "1.6", color: "#333", marginBottom: "16px" }}>{p.summary}</p>}
    {experience.length > 0 && <div style={{ marginBottom: "16px" }}><SectionTitle accent={accent}>Experience</SectionTitle>{experience.map((e, i) => <div key={i} style={{ marginBottom: "8px" }}><strong style={{ fontSize: "13px" }}>{e.position}</strong><p style={{ fontSize: "11px", color: accent, fontWeight: "600" }}>{e.company} | {formatDate(e.startDate)} - {e.current ? "Present" : formatDate(e.endDate)}</p><p style={{ fontSize: "11px", lineHeight: "1.5", color: "#444" }}>{e.description}</p></div>)}</div>}
    {projects.length > 0 && <div style={{ marginBottom: "16px" }}><SectionTitle accent={accent}>Projects</SectionTitle>{projects.map((proj, i) => <div key={i} style={{ marginBottom: "6px" }}><strong style={{ fontSize: "12px" }}>{proj.name}</strong><p style={{ fontSize: "11px", lineHeight: "1.5", color: "#444" }}>{proj.description}</p></div>)}</div>}
    <div style={{ display: "flex", gap: "24px" }}>
      {education.length > 0 && <div style={{ flex: 1 }}><SectionTitle accent={accent}>Education</SectionTitle>{education.map((e, i) => <p key={i} style={{ fontSize: "11px" }}><strong>{e.degree}</strong>, {e.institution}</p>)}</div>}
      {skills.length > 0 && <div style={{ flex: 1 }}><SectionTitle accent={accent}>Skills</SectionTitle><div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>{skills.map((s, i) => <span key={i} style={{ fontSize: "10px", background: accent, color: "white", padding: "2px 8px", borderRadius: "4px" }}>{s}</span>)}</div></div>}
    </div>
  </div>
);

const ClassicTemplate = ({ p, education, skills, experience, projects, certifications, languages, interests, accent, formatDate }) => (
  <div style={{ padding: "32px", fontFamily: "Georgia, serif" }}>
    <div style={{ textAlign: "center", marginBottom: "16px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>{p.fullName || "Your Name"}</h1>
      <div style={{ marginTop: "4px" }}><ContactLine p={p} /></div>
    </div>
    {p.summary && <p style={{ fontSize: "11px", lineHeight: "1.6", color: "#333", marginBottom: "14px", fontStyle: "italic" }}>{p.summary}</p>}
    {experience.length > 0 && <div style={{ marginBottom: "14px" }}><h2 style={{ fontSize: "13px", fontWeight: "bold", borderBottom: `1px solid ${accent}`, marginBottom: "6px" }}>Experience</h2>{experience.map((e, i) => <div key={i} style={{ marginBottom: "8px" }}><strong style={{ fontSize: "12px" }}>{e.position}, {e.company}</strong><span style={{ fontSize: "10px", color: "#777" }}> ({formatDate(e.startDate)} - {e.current ? "Present" : formatDate(e.endDate)})</span><p style={{ fontSize: "11px", lineHeight: "1.5", color: "#444" }}>{e.description}</p></div>)}</div>}
    {projects.length > 0 && <div style={{ marginBottom: "14px" }}><h2 style={{ fontSize: "13px", fontWeight: "bold", borderBottom: `1px solid ${accent}`, marginBottom: "6px" }}>Projects</h2>{projects.map((proj, i) => <div key={i} style={{ marginBottom: "4px" }}><strong style={{ fontSize: "12px" }}>{proj.name}</strong><p style={{ fontSize: "11px", lineHeight: "1.5", color: "#444" }}>{proj.description}</p></div>)}</div>}
    <div style={{ display: "flex", gap: "24px" }}>
      {education.length > 0 && <div style={{ flex: 1 }}><h2 style={{ fontSize: "13px", fontWeight: "bold", borderBottom: `1px solid ${accent}`, marginBottom: "6px" }}>Education</h2>{education.map((e, i) => <p key={i} style={{ fontSize: "11px" }}><strong>{e.degree}</strong>, {e.institution}</p>)}</div>}
      {skills.length > 0 && <div style={{ flex: 1 }}><h2 style={{ fontSize: "13px", fontWeight: "bold", borderBottom: `1px solid ${accent}`, marginBottom: "6px" }}>Skills</h2><p style={{ fontSize: "11px" }}>{skills.join(", ")}</p></div>}
    </div>
  </div>
);

const TechTemplate = ({ p, education, skills, experience, projects, certifications, languages, interests, accent, formatDate }) => (
  <div style={{ padding: "32px", fontFamily: "monospace" }}>
    <div style={{ marginBottom: "16px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", color: accent }}>{">"} {p.fullName || "Your Name"}</h1>
      {p.jobTitle && <p style={{ fontSize: "12px", color: "#666" }}>{"//"} {p.jobTitle}</p>}
      <div style={{ marginTop: "4px" }}><ContactLine p={p} /></div>
    </div>
    {p.summary && <p style={{ fontSize: "11px", lineHeight: "1.6", color: "#333", marginBottom: "14px" }}>{"/*"} {p.summary} {"*/"}</p>}
    {experience.length > 0 && <div style={{ marginBottom: "14px" }}><h2 style={{ fontSize: "13px", fontWeight: "bold", color: accent }}>{"<experience>"}</h2>{experience.map((e, i) => <div key={i} style={{ marginBottom: "8px", paddingLeft: "12px", borderLeft: `2px solid ${accent}` }}><strong style={{ fontSize: "12px" }}>{e.position} @ {e.company}</strong><p style={{ fontSize: "10px", color: "#999" }}>{formatDate(e.startDate)} - {e.current ? "Present" : formatDate(e.endDate)}</p><p style={{ fontSize: "11px", lineHeight: "1.5", color: "#444" }}>{e.description}</p></div>)}<p style={{ fontSize: "13px", color: accent }}>{"</experience>"}</p></div>}
    {projects.length > 0 && <div style={{ marginBottom: "14px" }}><h2 style={{ fontSize: "13px", fontWeight: "bold", color: accent }}>{"<projects>"}</h2>{projects.map((proj, i) => <div key={i} style={{ marginBottom: "6px", paddingLeft: "12px" }}><strong style={{ fontSize: "12px" }}>{proj.name}</strong>{proj.techStack && <span style={{ fontSize: "10px", color: accent }}> [{proj.techStack}]</span>}<p style={{ fontSize: "11px", lineHeight: "1.5", color: "#444" }}>{proj.description}</p></div>)}<p style={{ fontSize: "13px", color: accent }}>{"</projects>"}</p></div>}
    <div style={{ display: "flex", gap: "24px" }}>
      {education.length > 0 && <div style={{ flex: 1 }}><h2 style={{ fontSize: "13px", fontWeight: "bold", color: accent }}>education</h2>{education.map((e, i) => <p key={i} style={{ fontSize: "11px" }}><strong>{e.degree}</strong>, {e.institution}</p>)}</div>}
      {skills.length > 0 && <div style={{ flex: 1 }}><h2 style={{ fontSize: "13px", fontWeight: "bold", color: accent }}>skills</h2><div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>{skills.map((s, i) => <span key={i} style={{ fontSize: "10px", background: "#e0e0e0", padding: "2px 6px", borderRadius: "3px", fontFamily: "monospace" }}>{s}</span>)}</div></div>}
    </div>
  </div>
);

const ExecutiveTemplate = ({ p, education, skills, experience, projects, certifications, languages, interests, accent, formatDate }) => (
  <div style={{ padding: "36px", fontFamily: "Georgia, serif" }}>
    <div style={{ textAlign: "center", marginBottom: "20px", borderTop: `3px solid ${accent}`, borderBottom: `3px solid ${accent}`, padding: "12px 0" }}>
      <h1 style={{ fontSize: "26px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "2px" }}>{p.fullName || "Your Name"}</h1>
      {p.jobTitle && <p style={{ fontSize: "13px", color: accent, fontWeight: "600" }}>{p.jobTitle}</p>}
      <div style={{ marginTop: "6px" }}><ContactLine p={p} /></div>
    </div>
    {p.summary && <p style={{ fontSize: "11px", lineHeight: "1.7", color: "#333", marginBottom: "16px", textAlign: "justify" }}>{p.summary}</p>}
    {experience.length > 0 && <div style={{ marginBottom: "16px" }}><h2 style={{ fontSize: "13px", fontWeight: "bold", textTransform: "uppercase", color: accent, marginBottom: "8px" }}>Professional Experience</h2>{experience.map((e, i) => <div key={i} style={{ marginBottom: "10px" }}><div style={{ display: "flex", justifyContent: "space-between" }}><strong style={{ fontSize: "12px" }}>{e.position}, {e.company}</strong><span style={{ fontSize: "10px", color: "#777" }}>{formatDate(e.startDate)} - {e.current ? "Present" : formatDate(e.endDate)}</span></div><p style={{ fontSize: "11px", lineHeight: "1.5", color: "#444", marginTop: "2px" }}>{e.description}</p></div>)}</div>}
    <div style={{ display: "flex", gap: "24px" }}>
      {education.length > 0 && <div style={{ flex: 1 }}><h2 style={{ fontSize: "13px", fontWeight: "bold", textTransform: "uppercase", color: accent, marginBottom: "6px" }}>Education</h2>{education.map((e, i) => <p key={i} style={{ fontSize: "11px" }}><strong>{e.degree}</strong>, {e.institution}</p>)}</div>}
      {skills.length > 0 && <div style={{ flex: 1 }}><h2 style={{ fontSize: "13px", fontWeight: "bold", textTransform: "uppercase", color: accent, marginBottom: "6px" }}>Core Competencies</h2><p style={{ fontSize: "11px", lineHeight: "1.8" }}>{skills.join(" • ")}</p></div>}
    </div>
  </div>
);

const SidebarTemplate = ({ p, education, skills, experience, projects, certifications, languages, interests, accent, formatDate }) => (
  <div style={{ display: "flex", minHeight: "297mm" }}>
    <div style={{ width: "30%", background: "#f5f5f5", padding: "24px", borderRight: `4px solid ${accent}` }}>
      <h1 style={{ fontSize: "20px", fontWeight: "800", color: accent }}>{p.fullName || "Your Name"}</h1>
      {p.jobTitle && <p style={{ fontSize: "12px", color: "#666", marginBottom: "16px" }}>{p.jobTitle}</p>}
      <div style={{ fontSize: "10px", lineHeight: "1.8", color: "#555", marginBottom: "16px" }}>
        {p.email && <p>{p.email}</p>}{p.phone && <p>{p.phone}</p>}{p.location && <p>{p.location}</p>}{p.linkedin && <p>{p.linkedin}</p>}{p.github && <p>{p.github}</p>}
      </div>
      {skills.length > 0 && <div style={{ marginBottom: "16px" }}><h2 style={{ fontSize: "12px", fontWeight: "700", color: accent, marginBottom: "6px" }}>SKILLS</h2>{skills.map((s, i) => <p key={i} style={{ fontSize: "10px", marginBottom: "2px" }}>• {s}</p>)}</div>}
      {languages.length > 0 && <div style={{ marginBottom: "16px" }}><h2 style={{ fontSize: "12px", fontWeight: "700", color: accent, marginBottom: "6px" }}>LANGUAGES</h2>{languages.map((l, i) => <p key={i} style={{ fontSize: "10px" }}>{l}</p>)}</div>}
      {interests.length > 0 && <div><h2 style={{ fontSize: "12px", fontWeight: "700", color: accent, marginBottom: "6px" }}>INTERESTS</h2><p style={{ fontSize: "10px" }}>{interests.join(", ")}</p></div>}
    </div>
    <div style={{ flex: 1, padding: "24px" }}>
      {p.summary && <div style={{ marginBottom: "16px" }}><SectionTitle accent={accent}>Profile</SectionTitle><p style={{ fontSize: "11px", lineHeight: "1.6", color: "#333" }}>{p.summary}</p></div>}
      {experience.length > 0 && <div style={{ marginBottom: "16px" }}><SectionTitle accent={accent}>Experience</SectionTitle>{experience.map((e, i) => <div key={i} style={{ marginBottom: "10px" }}><strong style={{ fontSize: "12px" }}>{e.position}</strong><p style={{ fontSize: "11px", color: accent }}>{e.company} | {formatDate(e.startDate)} - {e.current ? "Present" : formatDate(e.endDate)}</p><p style={{ fontSize: "11px", lineHeight: "1.5", color: "#444" }}>{e.description}</p></div>)}</div>}
      {projects.length > 0 && <div style={{ marginBottom: "16px" }}><SectionTitle accent={accent}>Projects</SectionTitle>{projects.map((proj, i) => <div key={i} style={{ marginBottom: "6px" }}><strong style={{ fontSize: "12px" }}>{proj.name}</strong><p style={{ fontSize: "11px", lineHeight: "1.5", color: "#444" }}>{proj.description}</p></div>)}</div>}
      {education.length > 0 && <div><SectionTitle accent={accent}>Education</SectionTitle>{education.map((e, i) => <div key={i} style={{ marginBottom: "6px" }}><strong style={{ fontSize: "12px" }}>{e.degree}{e.field ? ` in ${e.field}` : ""}</strong><p style={{ fontSize: "11px", color: "#555" }}>{e.institution} | {formatDate(e.startDate)} - {formatDate(e.endDate)}</p></div>)}</div>}
    </div>
  </div>
);

const GradientTemplate = ({ p, education, skills, experience, projects, certifications, languages, interests, accent, formatDate }) => (
  <div style={{ padding: "32px" }}>
    <div style={{ background: `linear-gradient(135deg, ${accent}, ${accent}dd)`, color: "white", padding: "24px", borderRadius: "12px", marginBottom: "20px" }}>
      <h1 style={{ fontSize: "26px", fontWeight: "800" }}>{p.fullName || "Your Name"}</h1>
      {p.jobTitle && <p style={{ fontSize: "14px", opacity: "0.9" }}>{p.jobTitle}</p>}
      <p style={{ fontSize: "11px", marginTop: "8px", opacity: "0.8" }}>{[p.email, p.phone, p.location, p.linkedin].filter(Boolean).join(" | ")}</p>
    </div>
    {p.summary && <p style={{ fontSize: "11px", lineHeight: "1.6", color: "#333", marginBottom: "16px" }}>{p.summary}</p>}
    {experience.length > 0 && <div style={{ marginBottom: "16px" }}><SectionTitle accent={accent}>Experience</SectionTitle>{experience.map((e, i) => <div key={i} style={{ marginBottom: "10px", paddingLeft: "12px", borderLeft: `3px solid ${accent}` }}><strong style={{ fontSize: "12px" }}>{e.position}</strong><p style={{ fontSize: "11px", color: accent }}>{e.company} | {formatDate(e.startDate)} - {e.current ? "Present" : formatDate(e.endDate)}</p><p style={{ fontSize: "11px", lineHeight: "1.5", color: "#444" }}>{e.description}</p></div>)}</div>}
    {projects.length > 0 && <div style={{ marginBottom: "16px" }}><SectionTitle accent={accent}>Projects</SectionTitle>{projects.map((proj, i) => <div key={i} style={{ marginBottom: "6px" }}><strong style={{ fontSize: "12px" }}>{proj.name}</strong><p style={{ fontSize: "11px", lineHeight: "1.5", color: "#444" }}>{proj.description}</p></div>)}</div>}
    <div style={{ display: "flex", gap: "24px" }}>
      {education.length > 0 && <div style={{ flex: 1 }}><SectionTitle accent={accent}>Education</SectionTitle>{education.map((e, i) => <p key={i} style={{ fontSize: "11px" }}><strong>{e.degree}</strong>, {e.institution}</p>)}</div>}
      {skills.length > 0 && <div style={{ flex: 1 }}><SectionTitle accent={accent}>Skills</SectionTitle><div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>{skills.map((s, i) => <span key={i} style={{ fontSize: "10px", background: `linear-gradient(135deg, ${accent}, ${accent}cc)`, color: "white", padding: "2px 8px", borderRadius: "12px" }}>{s}</span>)}</div></div>}
    </div>
  </div>
);

const CleanTemplate = ({ p, education, skills, experience, projects, certifications, languages, interests, accent, formatDate }) => (
  <div style={{ padding: "36px" }}>
    <div style={{ marginBottom: "20px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#1a1a1a" }}>{p.fullName || "Your Name"}</h1>
      {p.jobTitle && <p style={{ fontSize: "13px", color: accent, fontWeight: "500" }}>{p.jobTitle}</p>}
      <div style={{ marginTop: "6px" }}><ContactLine p={p} /></div>
    </div>
    {p.summary && <p style={{ fontSize: "11px", lineHeight: "1.7", color: "#444", marginBottom: "18px" }}>{p.summary}</p>}
    {experience.length > 0 && <div style={{ marginBottom: "16px" }}><h2 style={{ fontSize: "13px", fontWeight: "600", color: accent, marginBottom: "8px" }}>Experience</h2>{experience.map((e, i) => <div key={i} style={{ marginBottom: "10px" }}><div style={{ display: "flex", justifyContent: "space-between" }}><strong style={{ fontSize: "12px" }}>{e.position}, {e.company}</strong><span style={{ fontSize: "10px", color: "#999" }}>{formatDate(e.startDate)} - {e.current ? "Present" : formatDate(e.endDate)}</span></div><p style={{ fontSize: "11px", lineHeight: "1.5", color: "#444", marginTop: "2px" }}>{e.description}</p></div>)}</div>}
    {projects.length > 0 && <div style={{ marginBottom: "16px" }}><h2 style={{ fontSize: "13px", fontWeight: "600", color: accent, marginBottom: "8px" }}>Projects</h2>{projects.map((proj, i) => <div key={i} style={{ marginBottom: "6px" }}><strong style={{ fontSize: "12px" }}>{proj.name}</strong><p style={{ fontSize: "11px", lineHeight: "1.5", color: "#444" }}>{proj.description}</p></div>)}</div>}
    <div style={{ display: "flex", gap: "24px" }}>
      {education.length > 0 && <div style={{ flex: 1 }}><h2 style={{ fontSize: "13px", fontWeight: "600", color: accent, marginBottom: "8px" }}>Education</h2>{education.map((e, i) => <p key={i} style={{ fontSize: "11px" }}><strong>{e.degree}</strong>, {e.institution}</p>)}</div>}
      {skills.length > 0 && <div style={{ flex: 1 }}><h2 style={{ fontSize: "13px", fontWeight: "600", color: accent, marginBottom: "8px" }}>Skills</h2><p style={{ fontSize: "11px", lineHeight: "1.8" }}>{skills.join(" • ")}</p></div>}
    </div>
  </div>
);

// ============ TIMELINE ============
const TimelineTemplate = ({ p, education, skills, experience, projects, certifications, languages, interests, accent, formatDate }) => (
  <div style={{ padding: "32px" }}>
    <div style={{ textAlign: "center", marginBottom: "20px" }}>
      <h1 style={{ fontSize: "26px", fontWeight: "800", color: "#1a1a1a" }}>{p.fullName || "Your Name"}</h1>
      {p.jobTitle && <p style={{ fontSize: "14px", color: accent, fontWeight: "600", marginTop: "4px" }}>{p.jobTitle}</p>}
      <div style={{ marginTop: "8px" }}><ContactLine p={p} /></div>
    </div>
    {p.summary && <div style={{ marginBottom: "16px" }}><SectionTitle accent={accent}>Summary</SectionTitle><p style={{ fontSize: "11px", lineHeight: "1.6", color: "#333" }}>{p.summary}</p></div>}
    {experience.length > 0 && (
      <div style={{ marginBottom: "16px" }}>
        <SectionTitle accent={accent}>Experience</SectionTitle>
        {experience.map((e, i) => (
          <div key={i} style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "16px" }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: accent, flexShrink: 0 }} />
              {i < experience.length - 1 && <div style={{ width: "2px", flex: 1, background: `${accent}40`, marginTop: "4px" }} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong style={{ fontSize: "12px" }}>{e.position}</strong>
                <span style={{ fontSize: "10px", color: "#777" }}>{formatDate(e.startDate)} - {e.current ? "Present" : formatDate(e.endDate)}</span>
              </div>
              <p style={{ fontSize: "11px", color: accent, fontWeight: "600" }}>{e.company}{e.location ? `, ${e.location}` : ""}</p>
              <p style={{ fontSize: "11px", lineHeight: "1.5", color: "#444", marginTop: "4px" }}>{e.description}</p>
            </div>
          </div>
        ))}
      </div>
    )}
    {projects.length > 0 && (
      <div style={{ marginBottom: "16px" }}>
        <SectionTitle accent={accent}>Projects</SectionTitle>
        {projects.map((proj, i) => (
          <div key={i} style={{ display: "flex", gap: "12px", marginBottom: "8px" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: accent, flexShrink: 0, marginTop: "4px" }} />
            <div><strong style={{ fontSize: "12px" }}>{proj.name}</strong>{proj.techStack && <span style={{ fontSize: "10px", color: "#777" }}> — {proj.techStack}</span>}<p style={{ fontSize: "11px", lineHeight: "1.5", color: "#444" }}>{proj.description}</p></div>
          </div>
        ))}
      </div>
    )}
    <div style={{ display: "flex", gap: "24px" }}>
      {education.length > 0 && <div style={{ flex: 1 }}><SectionTitle accent={accent}>Education</SectionTitle>{education.map((e, i) => <div key={i} style={{ marginBottom: "8px" }}><strong style={{ fontSize: "12px" }}>{e.degree}{e.field ? ` in ${e.field}` : ""}</strong><p style={{ fontSize: "11px", color: "#555" }}>{e.institution}</p><p style={{ fontSize: "10px", color: "#777" }}>{formatDate(e.startDate)} - {formatDate(e.endDate)}{e.grade ? ` • ${e.grade}` : ""}</p></div>)}</div>}
      {skills.length > 0 && <div style={{ flex: 1 }}><SectionTitle accent={accent}>Skills</SectionTitle><div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>{skills.map((s, i) => <span key={i} style={{ fontSize: "10px", background: `${accent}15`, color: accent, padding: "2px 8px", borderRadius: "4px", border: `1px solid ${accent}30` }}>{s}</span>)}</div></div>}
    </div>
    {(certifications.length > 0 || languages.length > 0 || interests.length > 0) && (
      <div style={{ display: "flex", gap: "24px", marginTop: "16px" }}>
        {certifications.length > 0 && <div style={{ flex: 1 }}><SectionTitle accent={accent}>Certifications</SectionTitle>{certifications.map((c, i) => <p key={i} style={{ fontSize: "11px" }}>{c.name} — {c.issuer}</p>)}</div>}
        {languages.length > 0 && <div style={{ flex: 1 }}><SectionTitle accent={accent}>Languages</SectionTitle><p style={{ fontSize: "11px" }}>{languages.join(", ")}</p></div>}
        {interests.length > 0 && <div style={{ flex: 1 }}><SectionTitle accent={accent}>Interests</SectionTitle><p style={{ fontSize: "11px" }}>{interests.join(", ")}</p></div>}
      </div>
    )}
  </div>
);

// ============ TWO COLUMN ============
const TwoColumnTemplate = ({ p, education, skills, experience, projects, certifications, languages, interests, accent, formatDate }) => (
  <div style={{ padding: "32px" }}>
    <div style={{ textAlign: "center", marginBottom: "20px", borderBottom: `3px solid ${accent}`, paddingBottom: "12px" }}>
      <h1 style={{ fontSize: "26px", fontWeight: "800", color: "#1a1a1a" }}>{p.fullName || "Your Name"}</h1>
      {p.jobTitle && <p style={{ fontSize: "14px", color: accent, fontWeight: "600", marginTop: "4px" }}>{p.jobTitle}</p>}
      <div style={{ marginTop: "8px" }}><ContactLine p={p} /></div>
    </div>
    {p.summary && <p style={{ fontSize: "11px", lineHeight: "1.6", color: "#333", marginBottom: "16px" }}>{p.summary}</p>}
    <div style={{ display: "flex", gap: "24px" }}>
      <div style={{ flex: 1 }}>
        {experience.length > 0 && <div style={{ marginBottom: "16px" }}><SectionTitle accent={accent}>Experience</SectionTitle>{experience.map((e, i) => <div key={i} style={{ marginBottom: "10px" }}><strong style={{ fontSize: "12px" }}>{e.position}</strong><p style={{ fontSize: "11px", color: accent }}>{e.company} | {formatDate(e.startDate)} - {e.current ? "Present" : formatDate(e.endDate)}</p><p style={{ fontSize: "11px", lineHeight: "1.5", color: "#444", marginTop: "2px" }}>{e.description}</p></div>)}</div>}
        {projects.length > 0 && <div style={{ marginBottom: "16px" }}><SectionTitle accent={accent}>Projects</SectionTitle>{projects.map((proj, i) => <div key={i} style={{ marginBottom: "8px" }}><strong style={{ fontSize: "12px" }}>{proj.name}</strong>{proj.techStack && <span style={{ fontSize: "10px", color: "#777" }}> — {proj.techStack}</span>}<p style={{ fontSize: "11px", lineHeight: "1.5", color: "#444" }}>{proj.description}</p></div>)}</div>}
      </div>
      <div style={{ width: "1px", background: `${accent}30` }} />
      <div style={{ flex: 1 }}>
        {education.length > 0 && <div style={{ marginBottom: "16px" }}><SectionTitle accent={accent}>Education</SectionTitle>{education.map((e, i) => <div key={i} style={{ marginBottom: "8px" }}><strong style={{ fontSize: "12px" }}>{e.degree}{e.field ? ` in ${e.field}` : ""}</strong><p style={{ fontSize: "11px", color: "#555" }}>{e.institution}</p><p style={{ fontSize: "10px", color: "#777" }}>{formatDate(e.startDate)} - {formatDate(e.endDate)}{e.grade ? ` • ${e.grade}` : ""}</p></div>)}</div>}
        {skills.length > 0 && <div style={{ marginBottom: "16px" }}><SectionTitle accent={accent}>Skills</SectionTitle><div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>{skills.map((s, i) => <span key={i} style={{ fontSize: "10px", background: "#f0f0f0", padding: "2px 8px", borderRadius: "4px" }}>{s}</span>)}</div></div>}
        {certifications.length > 0 && <div style={{ marginBottom: "16px" }}><SectionTitle accent={accent}>Certifications</SectionTitle>{certifications.map((c, i) => <p key={i} style={{ fontSize: "11px" }}>{c.name} — {c.issuer}</p>)}</div>}
        {languages.length > 0 && <div style={{ marginBottom: "16px" }}><SectionTitle accent={accent}>Languages</SectionTitle><p style={{ fontSize: "11px" }}>{languages.join(", ")}</p></div>}
        {interests.length > 0 && <div><SectionTitle accent={accent}>Interests</SectionTitle><p style={{ fontSize: "11px" }}>{interests.join(", ")}</p></div>}
      </div>
    </div>
  </div>
);

// ============ METRO ============
const MetroTemplate = ({ p, education, skills, experience, projects, certifications, languages, interests, accent, formatDate }) => (
  <div style={{ padding: "24px" }}>
    <div style={{ background: accent, color: "white", padding: "20px", marginBottom: "16px" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "900", letterSpacing: "1px" }}>{p.fullName || "Your Name"}</h1>
      {p.jobTitle && <p style={{ fontSize: "14px", opacity: "0.9", marginTop: "4px" }}>{p.jobTitle}</p>}
      <p style={{ fontSize: "10px", marginTop: "8px", opacity: "0.8" }}>{[p.email, p.phone, p.location, p.linkedin, p.github].filter(Boolean).join(" │ ")}</p>
    </div>
    {p.summary && <div style={{ background: "#f8f8f8", padding: "12px", marginBottom: "16px" }}><p style={{ fontSize: "11px", lineHeight: "1.6", color: "#333" }}>{p.summary}</p></div>}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
      {experience.length > 0 && <div style={{ gridColumn: "1 / -1", background: "#fafafa", padding: "12px", borderLeft: `4px solid ${accent}` }}><h2 style={{ fontSize: "13px", fontWeight: "700", color: accent, marginBottom: "8px", textTransform: "uppercase" }}>Experience</h2>{experience.map((e, i) => <div key={i} style={{ marginBottom: "8px" }}><strong style={{ fontSize: "12px" }}>{e.position}</strong><p style={{ fontSize: "11px", color: "#666" }}>{e.company} | {formatDate(e.startDate)} - {e.current ? "Present" : formatDate(e.endDate)}</p><p style={{ fontSize: "11px", lineHeight: "1.5", color: "#444" }}>{e.description}</p></div>)}</div>}
      {projects.length > 0 && <div style={{ background: "#fafafa", padding: "12px", borderLeft: `4px solid ${accent}` }}><h2 style={{ fontSize: "12px", fontWeight: "700", color: accent, marginBottom: "6px", textTransform: "uppercase" }}>Projects</h2>{projects.map((proj, i) => <div key={i} style={{ marginBottom: "6px" }}><strong style={{ fontSize: "11px" }}>{proj.name}</strong><p style={{ fontSize: "10px", lineHeight: "1.5", color: "#444" }}>{proj.description}</p></div>)}</div>}
      {education.length > 0 && <div style={{ background: "#fafafa", padding: "12px", borderLeft: `4px solid ${accent}` }}><h2 style={{ fontSize: "12px", fontWeight: "700", color: accent, marginBottom: "6px", textTransform: "uppercase" }}>Education</h2>{education.map((e, i) => <div key={i} style={{ marginBottom: "6px" }}><strong style={{ fontSize: "11px" }}>{e.degree}{e.field ? ` in ${e.field}` : ""}</strong><p style={{ fontSize: "10px", color: "#555" }}>{e.institution}</p></div>)}</div>}
      {skills.length > 0 && <div style={{ background: accent, color: "white", padding: "12px" }}><h2 style={{ fontSize: "12px", fontWeight: "700", marginBottom: "6px", textTransform: "uppercase" }}>Skills</h2><div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>{skills.map((s, i) => <span key={i} style={{ fontSize: "10px", background: "rgba(255,255,255,0.2)", padding: "2px 8px", borderRadius: "3px" }}>{s}</span>)}</div></div>}
      {certifications.length > 0 && <div style={{ background: "#fafafa", padding: "12px", borderLeft: `4px solid ${accent}` }}><h2 style={{ fontSize: "12px", fontWeight: "700", color: accent, marginBottom: "6px", textTransform: "uppercase" }}>Certifications</h2>{certifications.map((c, i) => <p key={i} style={{ fontSize: "10px" }}>{c.name} — {c.issuer}</p>)}</div>}
      {(languages.length > 0 || interests.length > 0) && <div style={{ background: "#fafafa", padding: "12px", borderLeft: `4px solid ${accent}` }}>{languages.length > 0 && <><h2 style={{ fontSize: "12px", fontWeight: "700", color: accent, marginBottom: "4px", textTransform: "uppercase" }}>Languages</h2><p style={{ fontSize: "10px", marginBottom: "8px" }}>{languages.join(", ")}</p></>}{interests.length > 0 && <><h2 style={{ fontSize: "12px", fontWeight: "700", color: accent, marginBottom: "4px", textTransform: "uppercase" }}>Interests</h2><p style={{ fontSize: "10px" }}>{interests.join(", ")}</p></>}</div>}
    </div>
  </div>
);

// ============ ACADEMIC ============
const AcademicTemplate = ({ p, education, skills, experience, projects, certifications, languages, interests, accent, formatDate }) => (
  <div style={{ padding: "36px 40px", fontFamily: "'Computer Modern', Georgia, serif" }}>
    <div style={{ textAlign: "center", marginBottom: "16px" }}>
      <h1 style={{ fontSize: "22px", fontWeight: "400", letterSpacing: "1px", textTransform: "uppercase", color: "#1a1a1a" }}>{p.fullName || "Your Name"}</h1>
      <div style={{ width: "100%", height: "1px", background: "#1a1a1a", margin: "8px 0" }} />
      <p style={{ fontSize: "10px", color: "#444" }}>{[p.email, p.phone, p.location, p.linkedin, p.github, p.website].filter(Boolean).join(" · ")}</p>
    </div>
    {p.summary && <div style={{ marginBottom: "14px" }}><h2 style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid #ccc", paddingBottom: "2px", marginBottom: "6px" }}>Research Interests</h2><p style={{ fontSize: "10.5px", lineHeight: "1.6", color: "#333", textAlign: "justify" }}>{p.summary}</p></div>}
    {education.length > 0 && <div style={{ marginBottom: "14px" }}><h2 style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid #ccc", paddingBottom: "2px", marginBottom: "6px" }}>Education</h2>{education.map((e, i) => <div key={i} style={{ marginBottom: "6px", display: "flex", justifyContent: "space-between" }}><div><strong style={{ fontSize: "11px" }}>{e.degree}{e.field ? ` in ${e.field}` : ""}</strong><p style={{ fontSize: "10.5px", color: "#555" }}>{e.institution}{e.grade ? ` — ${e.grade}` : ""}</p></div><span style={{ fontSize: "10px", color: "#777" }}>{formatDate(e.startDate)} – {formatDate(e.endDate)}</span></div>)}</div>}
    {experience.length > 0 && <div style={{ marginBottom: "14px" }}><h2 style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid #ccc", paddingBottom: "2px", marginBottom: "6px" }}>Experience</h2>{experience.map((e, i) => <div key={i} style={{ marginBottom: "8px" }}><div style={{ display: "flex", justifyContent: "space-between" }}><strong style={{ fontSize: "11px" }}>{e.position}, {e.company}</strong><span style={{ fontSize: "10px", color: "#777" }}>{formatDate(e.startDate)} – {e.current ? "Present" : formatDate(e.endDate)}</span></div><p style={{ fontSize: "10.5px", lineHeight: "1.5", color: "#444", marginTop: "2px", textAlign: "justify" }}>{e.description}</p></div>)}</div>}
    {projects.length > 0 && <div style={{ marginBottom: "14px" }}><h2 style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid #ccc", paddingBottom: "2px", marginBottom: "6px" }}>Projects & Publications</h2>{projects.map((proj, i) => <div key={i} style={{ marginBottom: "6px" }}><strong style={{ fontSize: "11px" }}>{proj.name}</strong>{proj.techStack && <span style={{ fontSize: "10px", color: "#777", fontStyle: "italic" }}> ({proj.techStack})</span>}<p style={{ fontSize: "10.5px", lineHeight: "1.5", color: "#444", textAlign: "justify" }}>{proj.description}</p></div>)}</div>}
    {skills.length > 0 && <div style={{ marginBottom: "14px" }}><h2 style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid #ccc", paddingBottom: "2px", marginBottom: "6px" }}>Technical Skills</h2><p style={{ fontSize: "10.5px", color: "#333" }}>{skills.join(", ")}</p></div>}
    {(certifications.length > 0 || languages.length > 0) && <div style={{ display: "flex", gap: "24px" }}>{certifications.length > 0 && <div style={{ flex: 1 }}><h2 style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid #ccc", paddingBottom: "2px", marginBottom: "6px" }}>Honors & Awards</h2>{certifications.map((c, i) => <p key={i} style={{ fontSize: "10.5px" }}>{c.name}, {c.issuer} ({c.date})</p>)}</div>}{languages.length > 0 && <div style={{ flex: 1 }}><h2 style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid #ccc", paddingBottom: "2px", marginBottom: "6px" }}>Languages</h2><p style={{ fontSize: "10.5px" }}>{languages.join(", ")}</p></div>}</div>}
  </div>
);

// ============ INFOGRAPHIC ============
const InfographicTemplate = ({ p, education, skills, experience, projects, certifications, languages, interests, accent, formatDate }) => (
  <div style={{ display: "flex", minHeight: "297mm" }}>
    <div style={{ width: "35%", background: "#1a1a2e", color: "white", padding: "24px" }}>
      {p.photo && <img src={p.photo} alt="" style={{ width: "90px", height: "90px", borderRadius: "50%", objectFit: "cover", border: `3px solid ${accent}`, display: "block", margin: "0 auto 16px" }} />}
      <h1 style={{ fontSize: "20px", fontWeight: "800", textAlign: "center" }}>{p.fullName || "Your Name"}</h1>
      {p.jobTitle && <p style={{ fontSize: "11px", textAlign: "center", color: accent, fontWeight: "600", marginBottom: "20px" }}>{p.jobTitle}</p>}
      <div style={{ fontSize: "10px", lineHeight: "2", marginBottom: "20px" }}>
        {p.email && <p>✉ {p.email}</p>}{p.phone && <p>☎ {p.phone}</p>}{p.location && <p>📍 {p.location}</p>}{p.linkedin && <p>🔗 {p.linkedin}</p>}{p.github && <p>⌨ {p.github}</p>}
      </div>
      {skills.length > 0 && <div style={{ marginBottom: "20px" }}><h2 style={{ fontSize: "12px", fontWeight: "700", color: accent, borderBottom: `2px solid ${accent}`, paddingBottom: "4px", marginBottom: "10px", textTransform: "uppercase" }}>Skills</h2>{skills.map((s, i) => <div key={i} style={{ marginBottom: "6px" }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}><span style={{ fontSize: "10px" }}>{s}</span></div><div style={{ width: "100%", height: "4px", background: "rgba(255,255,255,0.15)", borderRadius: "2px" }}><div style={{ width: `${70 + (i * 7) % 30}%`, height: "100%", background: accent, borderRadius: "2px" }} /></div></div>)}</div>}
      {languages.length > 0 && <div style={{ marginBottom: "20px" }}><h2 style={{ fontSize: "12px", fontWeight: "700", color: accent, borderBottom: `2px solid ${accent}`, paddingBottom: "4px", marginBottom: "8px", textTransform: "uppercase" }}>Languages</h2>{languages.map((l, i) => <p key={i} style={{ fontSize: "10px", marginBottom: "4px" }}>● {l}</p>)}</div>}
      {interests.length > 0 && <div><h2 style={{ fontSize: "12px", fontWeight: "700", color: accent, borderBottom: `2px solid ${accent}`, paddingBottom: "4px", marginBottom: "8px", textTransform: "uppercase" }}>Interests</h2><p style={{ fontSize: "10px" }}>{interests.join(" • ")}</p></div>}
    </div>
    <div style={{ flex: 1, padding: "24px" }}>
      {p.summary && <div style={{ marginBottom: "16px", background: `${accent}10`, padding: "12px", borderRadius: "8px", borderLeft: `4px solid ${accent}` }}><p style={{ fontSize: "11px", lineHeight: "1.6", color: "#333" }}>{p.summary}</p></div>}
      {experience.length > 0 && <div style={{ marginBottom: "16px" }}><SectionTitle accent={accent}>Experience</SectionTitle>{experience.map((e, i) => <div key={i} style={{ marginBottom: "12px", paddingLeft: "12px", borderLeft: `3px solid ${accent}` }}><strong style={{ fontSize: "12px" }}>{e.position}</strong><p style={{ fontSize: "11px", color: accent, fontWeight: "600" }}>{e.company} | {formatDate(e.startDate)} - {e.current ? "Present" : formatDate(e.endDate)}</p><p style={{ fontSize: "11px", lineHeight: "1.5", color: "#444", marginTop: "4px" }}>{e.description}</p></div>)}</div>}
      {projects.length > 0 && <div style={{ marginBottom: "16px" }}><SectionTitle accent={accent}>Projects</SectionTitle>{projects.map((proj, i) => <div key={i} style={{ marginBottom: "8px" }}><strong style={{ fontSize: "12px" }}>{proj.name}</strong>{proj.techStack && <span style={{ fontSize: "10px", color: "#777" }}> — {proj.techStack}</span>}<p style={{ fontSize: "11px", lineHeight: "1.5", color: "#444" }}>{proj.description}</p></div>)}</div>}
      {education.length > 0 && <div style={{ marginBottom: "16px" }}><SectionTitle accent={accent}>Education</SectionTitle>{education.map((e, i) => <div key={i} style={{ marginBottom: "8px", padding: "8px", background: "#f9f9f9", borderRadius: "6px" }}><strong style={{ fontSize: "12px" }}>{e.degree}{e.field ? ` in ${e.field}` : ""}</strong><p style={{ fontSize: "11px", color: "#555" }}>{e.institution} | {formatDate(e.startDate)} - {formatDate(e.endDate)}</p>{e.grade && <p style={{ fontSize: "10px", color: accent }}>{e.grade}</p>}</div>)}</div>}
      {certifications.length > 0 && <div><SectionTitle accent={accent}>Certifications</SectionTitle>{certifications.map((c, i) => <p key={i} style={{ fontSize: "11px" }}>🏆 {c.name} — {c.issuer}</p>)}</div>}
    </div>
  </div>
);

// ============ NORDIC ============
const NordicTemplate = ({ p, education, skills, experience, projects, certifications, languages, interests, accent, formatDate }) => (
  <div style={{ padding: "44px", fontFamily: "system-ui, sans-serif" }}>
    <div style={{ marginBottom: "28px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "300", letterSpacing: "2px", color: "#2d2d2d", textTransform: "uppercase" }}>{p.fullName || "Your Name"}</h1>
      {p.jobTitle && <p style={{ fontSize: "12px", color: accent, fontWeight: "400", letterSpacing: "1px", marginTop: "4px" }}>{p.jobTitle}</p>}
      <div style={{ width: "40px", height: "1px", background: accent, margin: "12px 0" }} />
      <div style={{ fontSize: "10px", color: "#888", display: "flex", flexWrap: "wrap", gap: "12px" }}>
        {p.email && <span>{p.email}</span>}{p.phone && <span>{p.phone}</span>}{p.location && <span>{p.location}</span>}{p.linkedin && <span>{p.linkedin}</span>}{p.github && <span>{p.github}</span>}
      </div>
    </div>
    {p.summary && <p style={{ fontSize: "11px", lineHeight: "1.8", color: "#555", marginBottom: "24px", maxWidth: "90%" }}>{p.summary}</p>}
    {experience.length > 0 && <div style={{ marginBottom: "24px" }}><h2 style={{ fontSize: "10px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "2px", color: accent, marginBottom: "12px" }}>Experience</h2>{experience.map((e, i) => <div key={i} style={{ marginBottom: "14px" }}><div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: "12px", fontWeight: "500", color: "#2d2d2d" }}>{e.position}</span><span style={{ fontSize: "10px", color: "#aaa" }}>{formatDate(e.startDate)} — {e.current ? "Present" : formatDate(e.endDate)}</span></div><p style={{ fontSize: "11px", color: "#888", fontWeight: "400" }}>{e.company}{e.location ? `, ${e.location}` : ""}</p><p style={{ fontSize: "11px", lineHeight: "1.6", color: "#555", marginTop: "4px" }}>{e.description}</p></div>)}</div>}
    {projects.length > 0 && <div style={{ marginBottom: "24px" }}><h2 style={{ fontSize: "10px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "2px", color: accent, marginBottom: "12px" }}>Projects</h2>{projects.map((proj, i) => <div key={i} style={{ marginBottom: "10px" }}><span style={{ fontSize: "12px", fontWeight: "500", color: "#2d2d2d" }}>{proj.name}</span>{proj.techStack && <span style={{ fontSize: "10px", color: "#aaa" }}> — {proj.techStack}</span>}<p style={{ fontSize: "11px", lineHeight: "1.6", color: "#555" }}>{proj.description}</p></div>)}</div>}
    <div style={{ display: "flex", gap: "32px" }}>
      {education.length > 0 && <div style={{ flex: 1 }}><h2 style={{ fontSize: "10px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "2px", color: accent, marginBottom: "12px" }}>Education</h2>{education.map((e, i) => <div key={i} style={{ marginBottom: "8px" }}><p style={{ fontSize: "12px", fontWeight: "500", color: "#2d2d2d" }}>{e.degree}{e.field ? ` in ${e.field}` : ""}</p><p style={{ fontSize: "11px", color: "#888" }}>{e.institution}</p></div>)}</div>}
      {skills.length > 0 && <div style={{ flex: 1 }}><h2 style={{ fontSize: "10px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "2px", color: accent, marginBottom: "12px" }}>Skills</h2><p style={{ fontSize: "11px", color: "#555", lineHeight: "2" }}>{skills.join("  ·  ")}</p></div>}
    </div>
    {(languages.length > 0 || interests.length > 0) && <div style={{ display: "flex", gap: "32px", marginTop: "20px" }}>{languages.length > 0 && <div><h2 style={{ fontSize: "10px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "2px", color: accent, marginBottom: "8px" }}>Languages</h2><p style={{ fontSize: "11px", color: "#555" }}>{languages.join("  ·  ")}</p></div>}{interests.length > 0 && <div><h2 style={{ fontSize: "10px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "2px", color: accent, marginBottom: "8px" }}>Interests</h2><p style={{ fontSize: "11px", color: "#555" }}>{interests.join("  ·  ")}</p></div>}</div>}
  </div>
);

// ============ CORPORATE ============
const CorporateTemplate = ({ p, education, skills, experience, projects, certifications, languages, interests, accent, formatDate }) => (
  <div style={{ padding: "32px", fontFamily: "Arial, Helvetica, sans-serif" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: `4px solid ${accent}`, paddingBottom: "12px", marginBottom: "16px" }}>
      <div>
        <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#1a1a1a" }}>{p.fullName || "Your Name"}</h1>
        {p.jobTitle && <p style={{ fontSize: "13px", color: accent, fontWeight: "600" }}>{p.jobTitle}</p>}
      </div>
      <div style={{ fontSize: "10px", color: "#555", textAlign: "right", lineHeight: "1.8" }}>
        {p.email && <p>{p.email}</p>}{p.phone && <p>{p.phone}</p>}{p.location && <p>{p.location}</p>}
      </div>
    </div>
    {p.summary && <div style={{ marginBottom: "16px", padding: "10px", background: "#f7f7f7", borderLeft: `4px solid ${accent}` }}><p style={{ fontSize: "11px", lineHeight: "1.6", color: "#333" }}>{p.summary}</p></div>}
    {experience.length > 0 && <div style={{ marginBottom: "16px" }}><h2 style={{ fontSize: "13px", fontWeight: "bold", color: "#1a1a1a", textTransform: "uppercase", borderBottom: `2px solid ${accent}`, paddingBottom: "4px", marginBottom: "8px" }}>Professional Experience</h2>{experience.map((e, i) => <div key={i} style={{ marginBottom: "10px" }}><div style={{ display: "flex", justifyContent: "space-between" }}><strong style={{ fontSize: "12px" }}>{e.position}</strong><span style={{ fontSize: "10px", color: "#777", fontStyle: "italic" }}>{formatDate(e.startDate)} - {e.current ? "Present" : formatDate(e.endDate)}</span></div><p style={{ fontSize: "11px", color: accent, fontWeight: "600" }}>{e.company}{e.location ? `, ${e.location}` : ""}</p><p style={{ fontSize: "11px", lineHeight: "1.5", color: "#444", marginTop: "4px" }}>{e.description}</p></div>)}</div>}
    {projects.length > 0 && <div style={{ marginBottom: "16px" }}><h2 style={{ fontSize: "13px", fontWeight: "bold", color: "#1a1a1a", textTransform: "uppercase", borderBottom: `2px solid ${accent}`, paddingBottom: "4px", marginBottom: "8px" }}>Key Projects</h2>{projects.map((proj, i) => <div key={i} style={{ marginBottom: "8px" }}><strong style={{ fontSize: "12px" }}>{proj.name}</strong>{proj.techStack && <span style={{ fontSize: "10px", color: "#777" }}> | {proj.techStack}</span>}<p style={{ fontSize: "11px", lineHeight: "1.5", color: "#444" }}>{proj.description}</p></div>)}</div>}
    <div style={{ display: "flex", gap: "24px" }}>
      {education.length > 0 && <div style={{ flex: 1 }}><h2 style={{ fontSize: "13px", fontWeight: "bold", color: "#1a1a1a", textTransform: "uppercase", borderBottom: `2px solid ${accent}`, paddingBottom: "4px", marginBottom: "8px" }}>Education</h2>{education.map((e, i) => <div key={i} style={{ marginBottom: "8px" }}><strong style={{ fontSize: "12px" }}>{e.degree}{e.field ? ` in ${e.field}` : ""}</strong><p style={{ fontSize: "11px", color: "#555" }}>{e.institution} | {formatDate(e.startDate)} - {formatDate(e.endDate)}</p>{e.grade && <p style={{ fontSize: "10px", color: "#777" }}>{e.grade}</p>}</div>)}</div>}
      {skills.length > 0 && <div style={{ flex: 1 }}><h2 style={{ fontSize: "13px", fontWeight: "bold", color: "#1a1a1a", textTransform: "uppercase", borderBottom: `2px solid ${accent}`, paddingBottom: "4px", marginBottom: "8px" }}>Core Competencies</h2><div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>{skills.map((s, i) => <span key={i} style={{ fontSize: "10px", background: `${accent}10`, color: "#333", padding: "3px 10px", borderRadius: "3px", border: `1px solid ${accent}30` }}>{s}</span>)}</div></div>}
    </div>
    {(certifications.length > 0 || languages.length > 0) && <div style={{ display: "flex", gap: "24px", marginTop: "16px" }}>{certifications.length > 0 && <div style={{ flex: 1 }}><h2 style={{ fontSize: "13px", fontWeight: "bold", textTransform: "uppercase", borderBottom: `2px solid ${accent}`, paddingBottom: "4px", marginBottom: "6px" }}>Certifications</h2>{certifications.map((c, i) => <p key={i} style={{ fontSize: "11px" }}>{c.name} — {c.issuer}</p>)}</div>}{languages.length > 0 && <div style={{ flex: 1 }}><h2 style={{ fontSize: "13px", fontWeight: "bold", textTransform: "uppercase", borderBottom: `2px solid ${accent}`, paddingBottom: "4px", marginBottom: "6px" }}>Languages</h2><p style={{ fontSize: "11px" }}>{languages.join(", ")}</p></div>}</div>}
  </div>
);

// ============ MAGAZINE ============
const MagazineTemplate = ({ p, education, skills, experience, projects, certifications, languages, interests, accent, formatDate }) => (
  <div style={{ padding: "32px" }}>
    <div style={{ marginBottom: "20px" }}>
      <h1 style={{ fontSize: "32px", fontWeight: "900", color: "#1a1a1a", lineHeight: "1.1" }}>{p.fullName || "Your Name"}</h1>
      {p.jobTitle && <p style={{ fontSize: "16px", color: accent, fontWeight: "300", fontStyle: "italic", marginTop: "4px" }}>{p.jobTitle}</p>}
      <div style={{ width: "100%", height: "3px", background: `linear-gradient(to right, ${accent}, transparent)`, margin: "12px 0" }} />
      <ContactLine p={p} />
    </div>
    {p.summary && <div style={{ marginBottom: "20px", padding: "16px", borderLeft: `4px solid ${accent}`, background: `${accent}08` }}><p style={{ fontSize: "12px", lineHeight: "1.7", color: "#333", fontStyle: "italic" }}>"{p.summary}"</p></div>}
    <div style={{ display: "flex", gap: "24px" }}>
      <div style={{ flex: 2 }}>
        {experience.length > 0 && <div style={{ marginBottom: "16px" }}><h2 style={{ fontSize: "14px", fontWeight: "900", color: accent, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" }}>Experience</h2>{experience.map((e, i) => <div key={i} style={{ marginBottom: "12px" }}><div style={{ display: "flex", justifyContent: "space-between" }}><strong style={{ fontSize: "12px" }}>{e.position}</strong><span style={{ fontSize: "10px", color: "#999", fontStyle: "italic" }}>{formatDate(e.startDate)} - {e.current ? "Present" : formatDate(e.endDate)}</span></div><p style={{ fontSize: "11px", color: accent, fontWeight: "600" }}>{e.company}</p><p style={{ fontSize: "11px", lineHeight: "1.5", color: "#444", marginTop: "4px" }}>{e.description}</p></div>)}</div>}
        {projects.length > 0 && <div style={{ marginBottom: "16px" }}><h2 style={{ fontSize: "14px", fontWeight: "900", color: accent, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" }}>Projects</h2>{projects.map((proj, i) => <div key={i} style={{ marginBottom: "8px" }}><strong style={{ fontSize: "12px" }}>{proj.name}</strong>{proj.techStack && <span style={{ fontSize: "10px", color: "#999" }}> — {proj.techStack}</span>}<p style={{ fontSize: "11px", lineHeight: "1.5", color: "#444" }}>{proj.description}</p></div>)}</div>}
      </div>
      <div style={{ flex: 1, borderLeft: `1px solid #e0e0e0`, paddingLeft: "20px" }}>
        {education.length > 0 && <div style={{ marginBottom: "16px" }}><h2 style={{ fontSize: "12px", fontWeight: "900", color: accent, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Education</h2>{education.map((e, i) => <div key={i} style={{ marginBottom: "8px" }}><strong style={{ fontSize: "11px" }}>{e.degree}</strong><p style={{ fontSize: "10px", color: "#555" }}>{e.institution}</p><p style={{ fontSize: "10px", color: "#999" }}>{formatDate(e.startDate)} - {formatDate(e.endDate)}</p></div>)}</div>}
        {skills.length > 0 && <div style={{ marginBottom: "16px" }}><h2 style={{ fontSize: "12px", fontWeight: "900", color: accent, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Skills</h2>{skills.map((s, i) => <p key={i} style={{ fontSize: "10px", marginBottom: "3px" }}>▸ {s}</p>)}</div>}
        {certifications.length > 0 && <div style={{ marginBottom: "16px" }}><h2 style={{ fontSize: "12px", fontWeight: "900", color: accent, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Certifications</h2>{certifications.map((c, i) => <p key={i} style={{ fontSize: "10px" }}>{c.name}</p>)}</div>}
        {languages.length > 0 && <div style={{ marginBottom: "16px" }}><h2 style={{ fontSize: "12px", fontWeight: "900", color: accent, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Languages</h2><p style={{ fontSize: "10px" }}>{languages.join(", ")}</p></div>}
        {interests.length > 0 && <div><h2 style={{ fontSize: "12px", fontWeight: "900", color: accent, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Interests</h2><p style={{ fontSize: "10px" }}>{interests.join(", ")}</p></div>}
      </div>
    </div>
  </div>
);

// ============ DEV SIMPLE ============
const DevSimpleTemplate = ({ p, education, skills, experience, projects, certifications, languages, interests, accent, formatDate }) => (
  <div style={{ padding: "32px", fontFamily: "'Courier New', Courier, monospace", color: "#111" }}>
    <div style={{ marginBottom: "16px" }}>
      <h1 style={{ fontSize: "20px", fontWeight: "bold" }}>{p.fullName || "Your Name"}</h1>
      <p style={{ fontSize: "11px", marginTop: "4px" }}>{[p.email, p.phone, p.location, p.linkedin, p.github, p.website].filter(Boolean).join(" | ")}</p>
    </div>
    {p.summary && <div style={{ marginBottom: "14px" }}><h2 style={{ fontSize: "12px", fontWeight: "bold", borderBottom: "1px solid #333", marginBottom: "6px", paddingBottom: "2px" }}>SUMMARY</h2><p style={{ fontSize: "11px", lineHeight: "1.6" }}>{p.summary}</p></div>}
    {skills.length > 0 && <div style={{ marginBottom: "14px" }}><h2 style={{ fontSize: "12px", fontWeight: "bold", borderBottom: "1px solid #333", marginBottom: "6px", paddingBottom: "2px" }}>TECHNICAL SKILLS</h2><p style={{ fontSize: "11px" }}>{skills.join(", ")}</p></div>}
    {experience.length > 0 && <div style={{ marginBottom: "14px" }}><h2 style={{ fontSize: "12px", fontWeight: "bold", borderBottom: "1px solid #333", marginBottom: "6px", paddingBottom: "2px" }}>EXPERIENCE</h2>{experience.map((e, i) => <div key={i} style={{ marginBottom: "10px" }}><div style={{ display: "flex", justifyContent: "space-between" }}><strong style={{ fontSize: "11px" }}>{e.position}, {e.company}</strong><span style={{ fontSize: "10px" }}>{formatDate(e.startDate)} - {e.current ? "Present" : formatDate(e.endDate)}</span></div><p style={{ fontSize: "11px", lineHeight: "1.5", marginTop: "2px" }}>{e.description}</p></div>)}</div>}
    {projects.length > 0 && <div style={{ marginBottom: "14px" }}><h2 style={{ fontSize: "12px", fontWeight: "bold", borderBottom: "1px solid #333", marginBottom: "6px", paddingBottom: "2px" }}>PROJECTS</h2>{projects.map((proj, i) => <div key={i} style={{ marginBottom: "8px" }}><strong style={{ fontSize: "11px" }}>{proj.name}</strong>{proj.techStack && <span style={{ fontSize: "10px" }}> [{proj.techStack}]</span>}<p style={{ fontSize: "11px", lineHeight: "1.5" }}>{proj.description}</p></div>)}</div>}
    {education.length > 0 && <div style={{ marginBottom: "14px" }}><h2 style={{ fontSize: "12px", fontWeight: "bold", borderBottom: "1px solid #333", marginBottom: "6px", paddingBottom: "2px" }}>EDUCATION</h2>{education.map((e, i) => <div key={i} style={{ marginBottom: "6px" }}><strong style={{ fontSize: "11px" }}>{e.degree}{e.field ? ` in ${e.field}` : ""}</strong><span style={{ fontSize: "10px" }}> | {e.institution} | {formatDate(e.startDate)} - {formatDate(e.endDate)}{e.grade ? ` | ${e.grade}` : ""}</span></div>)}</div>}
    {(certifications.length > 0 || languages.length > 0) && <div style={{ display: "flex", gap: "24px" }}>{certifications.length > 0 && <div><h2 style={{ fontSize: "12px", fontWeight: "bold", borderBottom: "1px solid #333", marginBottom: "4px", paddingBottom: "2px" }}>CERTIFICATIONS</h2>{certifications.map((c, i) => <p key={i} style={{ fontSize: "11px" }}>{c.name} - {c.issuer} ({c.date})</p>)}</div>}{languages.length > 0 && <div><h2 style={{ fontSize: "12px", fontWeight: "bold", borderBottom: "1px solid #333", marginBottom: "4px", paddingBottom: "2px" }}>LANGUAGES</h2><p style={{ fontSize: "11px" }}>{languages.join(", ")}</p></div>}</div>}
  </div>
);

// ============ DIAMOND ============
const DiamondTemplate = ({ p, education, skills, experience, projects, certifications, languages, interests, accent, formatDate }) => (
  <div style={{ padding: "32px" }}>
    <div style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)`, color: "white", padding: "20px 24px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <h1 style={{ fontSize: "26px", fontWeight: "800" }}>{p.fullName || "Your Name"}</h1>
        {p.jobTitle && <p style={{ fontSize: "13px", opacity: "0.9", marginTop: "2px" }}>{p.jobTitle}</p>}
      </div>
      <div style={{ fontSize: "10px", textAlign: "right", lineHeight: "1.8", opacity: "0.85" }}>
        {p.email && <p>{p.email}</p>}{p.phone && <p>{p.phone}</p>}{p.location && <p>{p.location}</p>}
      </div>
    </div>
    {p.summary && <p style={{ fontSize: "11px", lineHeight: "1.7", color: "#333", marginBottom: "16px" }}>{p.summary}</p>}
    {experience.length > 0 && <div style={{ marginBottom: "16px" }}><h2 style={{ fontSize: "13px", fontWeight: "700", color: accent, marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}><span style={{ display: "inline-block", width: "8px", height: "8px", background: accent, transform: "rotate(45deg)" }} />Experience</h2>{experience.map((e, i) => <div key={i} style={{ marginBottom: "10px", paddingLeft: "16px", borderLeft: `2px solid ${accent}40` }}><div style={{ display: "flex", justifyContent: "space-between" }}><strong style={{ fontSize: "12px" }}>{e.position}</strong><span style={{ fontSize: "10px", color: "#777" }}>{formatDate(e.startDate)} - {e.current ? "Present" : formatDate(e.endDate)}</span></div><p style={{ fontSize: "11px", color: accent, fontWeight: "600" }}>{e.company}{e.location ? `, ${e.location}` : ""}</p><p style={{ fontSize: "11px", lineHeight: "1.5", color: "#444", marginTop: "4px" }}>{e.description}</p></div>)}</div>}
    {projects.length > 0 && <div style={{ marginBottom: "16px" }}><h2 style={{ fontSize: "13px", fontWeight: "700", color: accent, marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}><span style={{ display: "inline-block", width: "8px", height: "8px", background: accent, transform: "rotate(45deg)" }} />Projects</h2>{projects.map((proj, i) => <div key={i} style={{ marginBottom: "8px", paddingLeft: "16px" }}><strong style={{ fontSize: "12px" }}>{proj.name}</strong>{proj.techStack && <span style={{ fontSize: "10px", color: "#777" }}> — {proj.techStack}</span>}<p style={{ fontSize: "11px", lineHeight: "1.5", color: "#444" }}>{proj.description}</p></div>)}</div>}
    <div style={{ display: "flex", gap: "24px" }}>
      {education.length > 0 && <div style={{ flex: 1 }}><h2 style={{ fontSize: "13px", fontWeight: "700", color: accent, marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}><span style={{ display: "inline-block", width: "8px", height: "8px", background: accent, transform: "rotate(45deg)" }} />Education</h2>{education.map((e, i) => <div key={i} style={{ marginBottom: "8px" }}><strong style={{ fontSize: "12px" }}>{e.degree}{e.field ? ` in ${e.field}` : ""}</strong><p style={{ fontSize: "11px", color: "#555" }}>{e.institution}</p><p style={{ fontSize: "10px", color: "#777" }}>{formatDate(e.startDate)} - {formatDate(e.endDate)}{e.grade ? ` • ${e.grade}` : ""}</p></div>)}</div>}
      {skills.length > 0 && <div style={{ flex: 1 }}><h2 style={{ fontSize: "13px", fontWeight: "700", color: accent, marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}><span style={{ display: "inline-block", width: "8px", height: "8px", background: accent, transform: "rotate(45deg)" }} />Skills</h2><div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>{skills.map((s, i) => <span key={i} style={{ fontSize: "10px", background: `${accent}12`, color: accent, padding: "3px 10px", borderRadius: "3px", fontWeight: "500" }}>{s}</span>)}</div></div>}
    </div>
    {(certifications.length > 0 || languages.length > 0 || interests.length > 0) && <div style={{ display: "flex", gap: "24px", marginTop: "16px" }}>{certifications.length > 0 && <div style={{ flex: 1 }}><h2 style={{ fontSize: "12px", fontWeight: "700", color: accent, marginBottom: "6px" }}>◆ Certifications</h2>{certifications.map((c, i) => <p key={i} style={{ fontSize: "11px" }}>{c.name} — {c.issuer}</p>)}</div>}{languages.length > 0 && <div style={{ flex: 1 }}><h2 style={{ fontSize: "12px", fontWeight: "700", color: accent, marginBottom: "6px" }}>◆ Languages</h2><p style={{ fontSize: "11px" }}>{languages.join(", ")}</p></div>}{interests.length > 0 && <div style={{ flex: 1 }}><h2 style={{ fontSize: "12px", fontWeight: "700", color: accent, marginBottom: "6px" }}>◆ Interests</h2><p style={{ fontSize: "11px" }}>{interests.join(", ")}</p></div>}</div>}
  </div>
);

export default ResumePreview;
