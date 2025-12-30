import React from 'react';

/**
 * A4 CV Preview Component
 * Renders CV content at exact A4 dimensions (210mm × 297mm)
 * Supports automatic pagination for multi-page CVs
 */

// A4 dimensions in pixels at 96 DPI (standard screen)
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const MM_TO_PX = 3.7795275591; // 1mm = 3.78px at 96 DPI

const A4_WIDTH_PX = Math.round(A4_WIDTH_MM * MM_TO_PX);  // ~794px
const A4_HEIGHT_PX = Math.round(A4_HEIGHT_MM * MM_TO_PX); // ~1123px

// Page margins
const MARGIN_TOP = 24; // pt
const MARGIN_BOTTOM = 24; // pt
const MARGIN_LEFT = 0; // Sidebar starts at edge
const MARGIN_RIGHT = 24; // pt

// Sidebar width percentage
const SIDEBAR_WIDTH_PERCENT = 35;

const A4CVPreview = ({ cvData, profilePhoto }) => {
  // Icon components for reuse
  const PersonIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
  );

  const EmailIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
    </svg>
  );

  const PhoneIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
    </svg>
  );

  const LocationIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>
  );

  const FlagIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
    </svg>
  );

  const CalendarIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
    </svg>
  );

  const LinkedInIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>
  );

  const FacebookIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );

  const InstagramIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );

  const TwitterIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );

  const YouTubeIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );

  // Detail item component
  const DetailItem = ({ icon: Icon, value }) => {
    if (!value) return null;
    return (
      <div className="flex items-start gap-2 mb-1.5">
        <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Icon />
        </div>
        <span className="text-[9pt] leading-tight break-words flex-1">{value}</span>
      </div>
    );
  };

  // Skill dots component
  const SkillDots = ({ level }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`w-2.5 h-2.5 rounded-full ${
            i <= level ? 'bg-sky-700' : 'bg-gray-300'
          }`}
        />
      ))}
    </div>
  );

  const personal = cvData?.personalInfo || {};
  const experience = cvData?.experience || [];
  const education = cvData?.education || [];
  const certificates = cvData?.certificates || [];
  const skills = cvData?.skills || [];
  const languages = cvData?.languages || [];

  return (
    <div className="flex flex-col gap-4">
      {/* A4 Page Container */}
      <div
        className="bg-white shadow-2xl mx-auto relative"
        style={{
          width: `${A4_WIDTH_PX}px`,
          minHeight: `${A4_HEIGHT_PX}px`,
          fontFamily: 'Arial, Helvetica, sans-serif',
          fontSize: '9pt',
          lineHeight: '1.4',
          color: '#1f2937',
          pageBreakAfter: 'always',
          overflow: 'hidden',
        }}
      >
        {/* A4 Page Indicator */}
        <div className="absolute top-2 right-2 bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded z-10">
          A4 (210×297mm)
        </div>

        <div className="flex h-full">
          {/* Left Sidebar */}
          <div
            className="flex flex-col"
            style={{ width: `${SIDEBAR_WIDTH_PERCENT}%` }}
          >
            {/* Blue Section - Personal Details */}
            <div
              className="text-white p-5 flex-shrink-0"
              style={{
                background: 'linear-gradient(180deg, #0c4a6e 0%, #075985 100%)',
              }}
            >
              {/* Name */}
              <h1 className="text-[16pt] font-bold text-center mb-1 leading-tight">
                {personal.fullName || 'Your Name'}
              </h1>
              
              {/* Underline */}
              <div className="w-16 h-0.5 bg-white mx-auto mb-2" />
              
              {/* Title */}
              <h2 className="text-[10pt] font-semibold text-center mb-4 leading-tight">
                {personal.title || 'Professional Title'}
              </h2>

              {/* Photo */}
              <div className="flex justify-center mb-4">
                {profilePhoto ? (
                  <div
                    className="rounded-full border-4 border-white overflow-hidden bg-gray-200"
                    style={{ width: '100pt', height: '100pt' }}
                  >
                    <img
                      src={profilePhoto}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div
                    className="rounded-full border-4 border-white bg-sky-950 flex items-center justify-center"
                    style={{ width: '100pt', height: '100pt' }}
                  >
                    <span className="text-[8pt] text-white text-center px-2">
                      Upload Photo
                    </span>
                  </div>
                )}
              </div>

              {/* Personal Details Header */}
              <h3 className="text-[10pt] font-bold uppercase mb-2 pb-1 border-b border-white">
                Personal Details
              </h3>

              {/* Personal Details Items */}
              <div className="space-y-1">
                <DetailItem icon={PersonIcon} value={personal.fullName} />
                <DetailItem icon={EmailIcon} value={personal.email} />
                <DetailItem icon={PhoneIcon} value={personal.phone} />
                <DetailItem icon={LocationIcon} value={personal.location} />
                <DetailItem icon={FlagIcon} value={personal.nationality} />
                <DetailItem icon={CalendarIcon} value={personal.dateOfBirth} />
                <DetailItem icon={LinkedInIcon} value={personal.linkedin} />
                <DetailItem icon={FacebookIcon} value={personal.facebook} />
                <DetailItem icon={InstagramIcon} value={personal.instagram} />
                <DetailItem icon={TwitterIcon} value={personal.twitter} />
                <DetailItem icon={YouTubeIcon} value={personal.youtube} />
              </div>
            </div>

            {/* White Section - Skills & Languages */}
            <div className="bg-white p-5 flex-grow">
              {/* Skills */}
              {skills.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-[10pt] font-bold text-sky-800 uppercase mb-2 pb-1 border-b-2 border-sky-800">
                    Skills
                  </h3>
                  <div className="space-y-2">
                    {skills.map((skill, idx) => (
                      <div key={idx}>
                        <p className="text-[8pt] font-medium text-gray-800 mb-0.5">
                          {skill.name}
                        </p>
                        <SkillDots level={skill.level || 3} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages */}
              {languages.length > 0 && (
                <div>
                  <h3 className="text-[10pt] font-bold text-sky-800 uppercase mb-2 pb-1 border-b-2 border-sky-800">
                    Languages
                  </h3>
                  <div className="space-y-1">
                    {languages.map((lang, idx) => (
                      <div key={idx} className="flex justify-between text-[8pt]">
                        <span className="font-semibold text-gray-800">{lang.name}</span>
                        <span className="text-gray-600">{lang.level}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Content Area */}
          <div
            className="bg-white border-l-2 border-gray-200 p-5"
            style={{ width: `${100 - SIDEBAR_WIDTH_PERCENT}%` }}
          >
            {/* Profile */}
            {personal.summary && (
              <div className="mb-4">
                <h3 className="text-[12pt] font-bold text-sky-800 uppercase mb-1 pb-1 border-b-[3px] border-sky-800">
                  Profile
                </h3>
                <p className="text-[9pt] text-gray-800 leading-relaxed text-justify mt-2">
                  {personal.summary}
                </p>
              </div>
            )}

            {/* Education */}
            {education.length > 0 && (
              <div className="mb-4">
                <h3 className="text-[12pt] font-bold text-sky-800 uppercase mb-1 pb-1 border-b-[3px] border-sky-800">
                  Education
                </h3>
                {education.map((edu, idx) => (
                  <div key={idx} className="mt-2">
                    <div className="flex justify-between items-start">
                      <h4 className="text-[10pt] font-bold text-gray-800">
                        {edu.degree}
                      </h4>
                      <span className="text-[8pt] text-gray-500 ml-2 flex-shrink-0">
                        {edu.graduationDate}
                      </span>
                    </div>
                    <p className="text-[9pt] italic text-sky-700">
                      {edu.institution}, {edu.location}
                    </p>
                    {edu.description && (
                      <p className="text-[8pt] text-gray-700 mt-0.5 pl-2">
                        • {edu.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Employment */}
            {experience.length > 0 && (
              <div className="mb-4">
                <h3 className="text-[12pt] font-bold text-sky-800 uppercase mb-1 pb-1 border-b-[3px] border-sky-800">
                  Employment
                </h3>
                {experience.map((exp, idx) => (
                  <div key={idx} className="mt-2">
                    <div className="flex justify-between items-start">
                      <h4 className="text-[10pt] font-bold text-gray-800">
                        {exp.position}
                      </h4>
                      <span className="text-[8pt] text-gray-500 ml-2 flex-shrink-0">
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <p className="text-[9pt] italic text-sky-700">
                      {exp.employer}, {exp.location}
                    </p>
                    {Array.isArray(exp.description) && exp.description.length > 0 && (
                      <div className="mt-0.5 pl-2">
                        {exp.description.slice(0, 4).map((desc, i) => (
                          <p key={i} className="text-[8pt] text-gray-700">
                            • {desc}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Certificates */}
            {certificates.length > 0 && (
              <div className="mb-4">
                <h3 className="text-[12pt] font-bold text-sky-800 uppercase mb-1 pb-1 border-b-[3px] border-sky-800">
                  Certificates & Licenses
                </h3>
                {certificates.map((cert, idx) => (
                  <div key={idx} className="mt-1.5">
                    <div className="flex justify-between items-start">
                      <h4 className="text-[9pt] font-bold text-gray-800">
                        {cert.name}
                      </h4>
                      <span className="text-[8pt] text-gray-500 ml-2 flex-shrink-0">
                        {cert.date}
                      </span>
                    </div>
                    <p className="text-[8pt] text-gray-500">
                      {cert.issuer}
                      {cert.validity && ` | Valid: ${cert.validity}`}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Page info footer */}
      <div className="text-center text-xs text-gray-500">
        Preview at actual A4 size • Content will automatically flow to additional pages in PDF
      </div>
    </div>
  );
};

export default A4CVPreview;
