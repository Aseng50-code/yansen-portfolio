"""
CV PDF Generator for CV Build for SEAMAN
Uses HTML/CSS to PDF conversion for pixel-perfect match with web preview
Supports automatic pagination for multi-page CVs
"""

from weasyprint import HTML
from weasyprint.text.fonts import FontConfiguration
from io import BytesIO


def get_cv_html(cv_data: dict, profile_photo: str = None) -> str:
    """Generate HTML that matches the CV preview exactly with pagination support"""
    
    personal = cv_data.get('personalInfo', {})
    experience = cv_data.get('experience', [])
    education = cv_data.get('education', [])
    certificates = cv_data.get('certificates', [])
    skills = cv_data.get('skills', [])
    languages = cv_data.get('languages', [])
    
    # Build personal details items
    personal_details_html = ""
    
    # Name with person icon
    if personal.get('fullName'):
        personal_details_html += '''
        <div class="detail-item">
            <div class="icon-wrapper">
                <svg class="icon" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                </svg>
            </div>
            <span>''' + personal.get('fullName') + '''</span>
        </div>'''
    
    # Email
    if personal.get('email'):
        personal_details_html += '''
        <div class="detail-item">
            <div class="icon-wrapper">
                <svg class="icon" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
            </div>
            <span>''' + personal.get('email') + '''</span>
        </div>'''
    
    # Phone
    if personal.get('phone'):
        personal_details_html += '''
        <div class="detail-item">
            <div class="icon-wrapper">
                <svg class="icon" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
            </div>
            <span>''' + personal.get('phone') + '''</span>
        </div>'''
    
    # Location
    if personal.get('location'):
        personal_details_html += '''
        <div class="detail-item">
            <div class="icon-wrapper">
                <svg class="icon" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                </svg>
            </div>
            <span>''' + personal.get('location') + '''</span>
        </div>'''
    
    # Nationality
    if personal.get('nationality'):
        personal_details_html += '''
        <div class="detail-item">
            <div class="icon-wrapper">
                <svg class="icon" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clip-rule="evenodd" />
                </svg>
            </div>
            <span>''' + personal.get('nationality') + '''</span>
        </div>'''
    
    # Date of Birth
    if personal.get('dateOfBirth'):
        personal_details_html += '''
        <div class="detail-item">
            <div class="icon-wrapper">
                <svg class="icon" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                </svg>
            </div>
            <span>''' + personal.get('dateOfBirth') + '''</span>
        </div>'''
    
    # Social Media - LinkedIn
    if personal.get('linkedin'):
        personal_details_html += '''
        <div class="detail-item">
            <div class="icon-wrapper">
                <svg class="icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
            </div>
            <span class="social-text">''' + personal.get('linkedin') + '''</span>
        </div>'''
    
    # Facebook
    if personal.get('facebook'):
        personal_details_html += '''
        <div class="detail-item">
            <div class="icon-wrapper">
                <svg class="icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
            </div>
            <span class="social-text">''' + personal.get('facebook') + '''</span>
        </div>'''
    
    # Instagram
    if personal.get('instagram'):
        personal_details_html += '''
        <div class="detail-item">
            <div class="icon-wrapper">
                <svg class="icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
            </div>
            <span class="social-text">''' + personal.get('instagram') + '''</span>
        </div>'''
    
    # Twitter/X
    if personal.get('twitter'):
        personal_details_html += '''
        <div class="detail-item">
            <div class="icon-wrapper">
                <svg class="icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
            </div>
            <span class="social-text">''' + personal.get('twitter') + '''</span>
        </div>'''
    
    # YouTube
    if personal.get('youtube'):
        personal_details_html += '''
        <div class="detail-item">
            <div class="icon-wrapper">
                <svg class="icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
            </div>
            <span class="social-text">''' + personal.get('youtube') + '''</span>
        </div>'''
    
    # Build skills HTML
    skills_html = ""
    for skill in skills[:10]:
        dots = ""
        level = skill.get('level', 3)
        for i in range(5):
            if i < level:
                dots += '<div class="skill-dot filled"></div>'
            else:
                dots += '<div class="skill-dot empty"></div>'
        skills_html += '''
        <div class="skill-item">
            <div class="skill-name">''' + skill.get('name', '') + '''</div>
            <div class="skill-dots">''' + dots + '''</div>
        </div>'''
    
    # Build languages HTML
    languages_html = ""
    for lang in languages[:6]:
        languages_html += '''
        <div class="language-item">
            <span class="lang-name">''' + lang.get('name', '') + '''</span>
            <span class="lang-level">''' + lang.get('level', '') + '''</span>
        </div>'''
    
    # Build education HTML
    education_html = ""
    for edu in education:
        desc_html = '<div class="item-description">• ' + edu.get("description", "") + '</div>' if edu.get('description') else ''
        education_html += '''
        <div class="content-item">
            <div class="item-header">
                <div class="item-title">''' + edu.get('degree', '') + '''</div>
                <div class="item-date">''' + edu.get('graduationDate', '') + '''</div>
            </div>
            <div class="item-subtitle">''' + edu.get('institution', '') + ', ' + edu.get('location', '') + '''</div>
            ''' + desc_html + '''
        </div>'''
    
    # Build experience HTML
    experience_html = ""
    for exp in experience:
        end_date = 'Present' if exp.get('current') else exp.get('endDate', '')
        descriptions = exp.get('description', [])
        desc_html = ""
        if isinstance(descriptions, list):
            for desc in descriptions[:6]:
                if desc:
                    desc_html += '<div class="item-description">• ' + desc + '</div>'
        experience_html += '''
        <div class="content-item">
            <div class="item-header">
                <div class="item-title">''' + exp.get('position', '') + '''</div>
                <div class="item-date">''' + exp.get('startDate', '') + ' - ' + end_date + '''</div>
            </div>
            <div class="item-subtitle">''' + exp.get('employer', '') + ', ' + exp.get('location', '') + '''</div>
            ''' + desc_html + '''
        </div>'''
    
    # Build certificates HTML
    certificates_html = ""
    for cert in certificates:
        validity = " | Valid: " + cert.get('validity') if cert.get('validity') else ""
        certificates_html += '''
        <div class="content-item cert-item">
            <div class="item-header">
                <div class="item-title cert-title">''' + cert.get('name', '') + '''</div>
                <div class="item-date">''' + cert.get('date', '') + '''</div>
            </div>
            <div class="cert-issuer">''' + cert.get('issuer', '') + validity + '''</div>
        </div>'''
    
    # Photo HTML
    if profile_photo:
        photo_html = '<img src="' + profile_photo + '" alt="Profile Photo" class="photo-img" />'
    else:
        photo_html = '<span class="photo-placeholder">Upload Photo</span>'
    
    # Skills section
    skills_section = ""
    if skills:
        skills_section = '''
            <div class="section-header section-header-dark">Skills</div>
            ''' + skills_html
    
    # Languages section
    languages_section = ""
    if languages:
        languages_section = '''
            <div class="section-header section-header-dark" style="margin-top: 14pt;">Languages</div>
            ''' + languages_html
    
    # Profile section
    profile_section = ""
    if personal.get('summary'):
        profile_section = '''
            <div class="content-section">
                <div class="content-header">Profile</div>
                <div class="profile-text">''' + personal.get('summary', '') + '''</div>
            </div>'''
    
    # Education section
    education_section = ""
    if education:
        education_section = '''
            <div class="content-section">
                <div class="content-header">Education</div>
                ''' + education_html + '''
            </div>'''
    
    # Experience section
    experience_section = ""
    if experience:
        experience_section = '''
            <div class="content-section">
                <div class="content-header">Employment</div>
                ''' + experience_html + '''
            </div>'''
    
    # Certificates section
    certificates_section = ""
    if certificates:
        certificates_section = '''
            <div class="content-section">
                <div class="content-header">Certificates & Licenses</div>
                ''' + certificates_html + '''
            </div>'''
    
    # Complete HTML with pagination support
    html = '''<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        @page {
            size: A4;
            margin: 0;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        html, body {
            width: 210mm;
            min-height: 297mm;
        }
        
        body {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 9pt;
            line-height: 1.4;
            color: #1f2937;
            background: white;
        }
        
        .cv-container {
            width: 210mm;
            min-height: 297mm;
            display: flex;
            page-break-inside: avoid;
        }
        
        /* Left Sidebar - Fixed on first page */
        .sidebar {
            width: 35%;
            min-height: 297mm;
            display: flex;
            flex-direction: column;
            position: relative;
        }
        
        .sidebar-blue {
            background: linear-gradient(180deg, #0c4a6e 0%, #075985 100%);
            color: white;
            padding: 20pt 16pt;
            flex-shrink: 0;
        }
        
        .sidebar-white {
            background: white;
            padding: 16pt;
            flex-grow: 1;
        }
        
        /* Header Section */
        .name {
            font-size: 16pt;
            font-weight: bold;
            text-align: center;
            margin-bottom: 4pt;
            line-height: 1.2;
        }
        
        .name-underline {
            width: 50pt;
            height: 2pt;
            background: white;
            margin: 0 auto 6pt auto;
        }
        
        .title {
            font-size: 10pt;
            font-weight: bold;
            text-align: center;
            margin-bottom: 12pt;
            line-height: 1.3;
        }
        
        /* Photo */
        .photo-container {
            width: 100pt;
            height: 100pt;
            border-radius: 50%;
            border: 4pt solid white;
            margin: 0 auto 12pt auto;
            overflow: hidden;
            background: #0a3d5c;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .photo-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 50%;
        }
        
        .photo-placeholder {
            font-size: 8pt;
            color: white;
            text-align: center;
        }
        
        /* Section Headers */
        .section-header {
            font-size: 10pt;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 6pt;
            padding-bottom: 3pt;
            border-bottom: 1.5pt solid white;
        }
        
        .section-header-dark {
            color: #0c4a6e;
            border-bottom-color: #0c4a6e;
            margin-bottom: 8pt;
        }
        
        /* Personal Details */
        .detail-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 5pt;
            gap: 6pt;
        }
        
        .icon-wrapper {
            width: 12pt;
            height: 12pt;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .icon {
            width: 10pt;
            height: 10pt;
        }
        
        .detail-item span {
            flex: 1;
            word-break: break-word;
            font-size: 8pt;
            line-height: 1.3;
        }
        
        .social-text {
            font-size: 7pt !important;
        }
        
        /* Skills */
        .skill-item {
            margin-bottom: 6pt;
        }
        
        .skill-name {
            font-size: 8pt;
            font-weight: 500;
            color: #1f2937;
            margin-bottom: 2pt;
        }
        
        .skill-dots {
            display: flex;
            gap: 2pt;
        }
        
        .skill-dot {
            width: 8pt;
            height: 8pt;
            border-radius: 50%;
        }
        
        .skill-dot.filled {
            background: #0369a1;
        }
        
        .skill-dot.empty {
            background: #d1d5db;
        }
        
        /* Languages */
        .language-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 3pt;
            font-size: 8pt;
        }
        
        .lang-name {
            font-weight: 600;
            color: #1f2937;
        }
        
        .lang-level {
            color: #6b7280;
        }
        
        /* Right Content */
        .main-content {
            width: 65%;
            padding: 20pt;
            background: white;
            border-left: 2pt solid #e5e7eb;
        }
        
        .content-section {
            margin-bottom: 14pt;
            page-break-inside: avoid;
        }
        
        .content-header {
            font-size: 12pt;
            font-weight: bold;
            color: #0c4a6e;
            text-transform: uppercase;
            margin-bottom: 3pt;
            padding-bottom: 3pt;
            border-bottom: 2.5pt solid #0c4a6e;
        }
        
        .profile-text {
            font-size: 9pt;
            line-height: 1.5;
            text-align: justify;
            color: #1f2937;
            margin-top: 6pt;
        }
        
        /* Content Items */
        .content-item {
            margin-top: 8pt;
            page-break-inside: avoid;
        }
        
        .item-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }
        
        .item-title {
            font-size: 10pt;
            font-weight: bold;
            color: #1f2937;
        }
        
        .item-date {
            font-size: 8pt;
            color: #6b7280;
            flex-shrink: 0;
            margin-left: 6pt;
        }
        
        .item-subtitle {
            font-size: 9pt;
            font-style: italic;
            color: #075985;
            margin-top: 1pt;
        }
        
        .item-description {
            font-size: 8pt;
            color: #1f2937;
            margin-top: 1pt;
            padding-left: 6pt;
        }
        
        .cert-item {
            margin-top: 5pt;
        }
        
        .cert-title {
            font-size: 9pt;
        }
        
        .cert-issuer {
            font-size: 7pt;
            color: #6b7280;
            margin-top: 1pt;
        }
        
        /* Print and pagination */
        @media print {
            body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            
            .content-section {
                page-break-inside: avoid;
            }
            
            .content-item {
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="cv-container">
        <!-- Left Sidebar -->
        <div class="sidebar">
            <div class="sidebar-blue">
                <div class="name">''' + personal.get('fullName', 'Your Name') + '''</div>
                <div class="name-underline"></div>
                <div class="title">''' + personal.get('title', 'Professional Title') + '''</div>
                
                <div class="photo-container">
                    ''' + photo_html + '''
                </div>
                
                <div class="section-header">Personal Details</div>
                ''' + personal_details_html + '''
            </div>
            
            <div class="sidebar-white">
                ''' + skills_section + '''
                ''' + languages_section + '''
            </div>
        </div>
        
        <!-- Main Content -->
        <div class="main-content">
            ''' + profile_section + '''
            ''' + education_section + '''
            ''' + experience_section + '''
            ''' + certificates_section + '''
        </div>
    </div>
</body>
</html>'''
    return html


def generate_cv_pdf(cv_data: dict, profile_photo: str = None) -> BytesIO:
    """Generate a professional CV PDF using HTML/CSS conversion with pagination support"""
    
    # Get profile photo from cv_data if not provided separately
    if not profile_photo:
        profile_photo = cv_data.get('profilePhoto')
    
    # Generate HTML
    html_content = get_cv_html(cv_data, profile_photo)
    
    # Configure fonts
    font_config = FontConfiguration()
    
    # Convert HTML to PDF
    html = HTML(string=html_content)
    
    # Generate PDF to buffer
    buffer = BytesIO()
    html.write_pdf(buffer, font_config=font_config)
    buffer.seek(0)
    
    return buffer
