"""
CV PDF Generator for CV Build for SEAMAN
Generates professional maritime CV PDFs using ReportLab
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, cm
from reportlab.lib.colors import HexColor, white, black
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.pdfgen import canvas
from io import BytesIO
import base64


# Color scheme matching the frontend
PRIMARY_COLOR = HexColor('#0C4A6E')  # sky-800
SECONDARY_COLOR = HexColor('#075985')  # sky-700
TEXT_COLOR = HexColor('#1f2937')  # gray-800
LIGHT_TEXT = HexColor('#6b7280')  # gray-500


def generate_cv_pdf(cv_data: dict, profile_photo: str = None) -> BytesIO:
    """
    Generate a professional CV PDF from CV data
    
    Args:
        cv_data: Dictionary containing CV information
        profile_photo: Base64 encoded profile photo (optional)
    
    Returns:
        BytesIO buffer containing the PDF
    """
    buffer = BytesIO()
    
    # Create PDF with custom canvas
    c = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4
    
    # Define margins and sidebar
    sidebar_width = 75 * mm
    content_x = sidebar_width + 10 * mm
    content_width = width - content_x - 15 * mm
    
    # Extract data with defaults
    personal_info = cv_data.get('personalInfo', {})
    experience = cv_data.get('experience', [])
    education = cv_data.get('education', [])
    certificates = cv_data.get('certificates', [])
    skills = cv_data.get('skills', [])
    languages = cv_data.get('languages', [])
    
    # ==================== LEFT SIDEBAR (Blue) ====================
    # Draw blue sidebar background
    c.setFillColor(PRIMARY_COLOR)
    c.rect(0, 0, sidebar_width, height, fill=True, stroke=False)
    
    # Name at top of sidebar
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 16)
    name = personal_info.get('fullName', 'Your Name')
    
    # Wrap name if too long
    y_position = height - 30 * mm
    name_parts = name.split(' ')
    if len(name) > 18:
        c.drawCentredString(sidebar_width / 2, y_position, ' '.join(name_parts[:2]))
        if len(name_parts) > 2:
            c.drawCentredString(sidebar_width / 2, y_position - 7 * mm, ' '.join(name_parts[2:]))
            y_position -= 14 * mm
        else:
            y_position -= 7 * mm
    else:
        c.drawCentredString(sidebar_width / 2, y_position, name)
        y_position -= 7 * mm
    
    # Title/Position
    c.setFont("Helvetica", 11)
    title = personal_info.get('title', 'Professional Title')
    if len(title) > 25:
        # Split title into two lines
        mid = len(title) // 2
        space_pos = title.find(' ', mid)
        if space_pos > 0:
            c.drawCentredString(sidebar_width / 2, y_position, title[:space_pos])
            c.drawCentredString(sidebar_width / 2, y_position - 5 * mm, title[space_pos+1:])
            y_position -= 10 * mm
        else:
            c.drawCentredString(sidebar_width / 2, y_position, title)
            y_position -= 5 * mm
    else:
        c.drawCentredString(sidebar_width / 2, y_position, title)
        y_position -= 5 * mm
    
    # Separator line
    y_position -= 5 * mm
    c.setStrokeColor(white)
    c.setLineWidth(1)
    c.line(10 * mm, y_position, sidebar_width - 10 * mm, y_position)
    
    # Profile photo placeholder
    y_position -= 35 * mm
    photo_size = 30 * mm
    photo_x = (sidebar_width - photo_size) / 2
    
    # Draw photo circle border
    c.setStrokeColor(white)
    c.setLineWidth(2)
    c.circle(sidebar_width / 2, y_position + photo_size / 2, photo_size / 2, fill=False)
    
    # If photo is provided, try to draw it
    if profile_photo:
        try:
            # Handle base64 image
            if ',' in profile_photo:
                photo_data = base64.b64decode(profile_photo.split(',')[1])
            else:
                photo_data = base64.b64decode(profile_photo)
            
            from reportlab.lib.utils import ImageReader
            from PIL import Image as PILImage
            from io import BytesIO as ImgBuffer
            
            img_buffer = ImgBuffer(photo_data)
            img = PILImage.open(img_buffer)
            
            # Create circular mask effect by clipping
            temp_buffer = ImgBuffer()
            img.save(temp_buffer, format='PNG')
            temp_buffer.seek(0)
            
            c.drawImage(ImageReader(temp_buffer), photo_x, y_position, 
                       width=photo_size, height=photo_size, mask='auto')
        except Exception as e:
            # Draw placeholder text if image fails
            c.setFont("Helvetica", 8)
            c.drawCentredString(sidebar_width / 2, y_position + photo_size / 2, "Photo")
    else:
        c.setFont("Helvetica", 8)
        c.drawCentredString(sidebar_width / 2, y_position + photo_size / 2, "Photo")
    
    # Personal Details Section
    y_position -= 15 * mm
    c.setFont("Helvetica-Bold", 11)
    c.drawString(8 * mm, y_position, "PERSONAL DETAILS")
    
    y_position -= 3 * mm
    c.line(8 * mm, y_position, sidebar_width - 8 * mm, y_position)
    
    y_position -= 8 * mm
    c.setFont("Helvetica", 9)
    
    # Personal details items
    details = [
        personal_info.get('email', ''),
        personal_info.get('phone', ''),
        personal_info.get('location', ''),
        personal_info.get('nationality', ''),
        personal_info.get('dateOfBirth', '')
    ]
    
    for detail in details:
        if detail:
            # Wrap long text
            if len(detail) > 30:
                c.drawString(8 * mm, y_position, detail[:30])
                c.drawString(8 * mm, y_position - 4 * mm, detail[30:])
                y_position -= 8 * mm
            else:
                c.drawString(8 * mm, y_position, detail)
                y_position -= 5 * mm
    
    # ==================== SKILLS SECTION (White area below blue) ====================
    # End blue section and start white for skills
    skills_start_y = y_position - 10 * mm
    
    # Draw white background for skills section in sidebar
    c.setFillColor(white)
    c.rect(0, 0, sidebar_width, skills_start_y + 5 * mm, fill=True, stroke=False)
    
    # Skills title
    y_position = skills_start_y
    c.setFillColor(PRIMARY_COLOR)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(8 * mm, y_position, "SKILLS")
    
    y_position -= 3 * mm
    c.setStrokeColor(PRIMARY_COLOR)
    c.line(8 * mm, y_position, sidebar_width - 8 * mm, y_position)
    
    y_position -= 8 * mm
    c.setFont("Helvetica", 9)
    c.setFillColor(TEXT_COLOR)
    
    for skill in skills[:8]:  # Limit to 8 skills to fit
        skill_name = skill.get('name', '')
        skill_level = skill.get('level', 3)
        
        # Skill name
        c.drawString(8 * mm, y_position, skill_name[:25])
        
        # Rating dots
        y_position -= 5 * mm
        dot_x = 8 * mm
        for i in range(5):
            if i < skill_level:
                c.setFillColor(PRIMARY_COLOR)
            else:
                c.setFillColor(HexColor('#D1D5DB'))
            c.circle(dot_x + 3 * mm, y_position + 1.5 * mm, 2 * mm, fill=True, stroke=False)
            dot_x += 6 * mm
        
        y_position -= 6 * mm
        c.setFillColor(TEXT_COLOR)
    
    # Languages section
    if languages:
        y_position -= 5 * mm
        c.setFillColor(PRIMARY_COLOR)
        c.setFont("Helvetica-Bold", 11)
        c.drawString(8 * mm, y_position, "LANGUAGES")
        
        y_position -= 3 * mm
        c.setStrokeColor(PRIMARY_COLOR)
        c.line(8 * mm, y_position, sidebar_width - 8 * mm, y_position)
        
        y_position -= 7 * mm
        c.setFont("Helvetica", 9)
        c.setFillColor(TEXT_COLOR)
        
        for lang in languages[:5]:  # Limit to 5 languages
            lang_name = lang.get('name', '')
            lang_level = lang.get('level', '')
            c.drawString(8 * mm, y_position, f"{lang_name}: {lang_level}")
            y_position -= 5 * mm
    
    # ==================== RIGHT CONTENT AREA ====================
    y_position = height - 25 * mm
    
    # Profile/Summary Section
    summary = personal_info.get('summary', '')
    if summary:
        c.setFillColor(PRIMARY_COLOR)
        c.setFont("Helvetica-Bold", 14)
        c.drawString(content_x, y_position, "PROFILE")
        
        y_position -= 3 * mm
        c.setStrokeColor(PRIMARY_COLOR)
        c.setLineWidth(2)
        c.line(content_x, y_position, content_x + 50 * mm, y_position)
        
        y_position -= 8 * mm
        c.setFillColor(TEXT_COLOR)
        c.setFont("Helvetica", 9)
        
        # Word wrap for summary
        words = summary.split()
        line = ""
        max_chars = 70
        for word in words:
            if len(line + word) < max_chars:
                line += word + " "
            else:
                c.drawString(content_x, y_position, line.strip())
                y_position -= 4 * mm
                line = word + " "
        if line:
            c.drawString(content_x, y_position, line.strip())
            y_position -= 4 * mm
    
    # Education Section
    if education:
        y_position -= 10 * mm
        c.setFillColor(PRIMARY_COLOR)
        c.setFont("Helvetica-Bold", 14)
        c.drawString(content_x, y_position, "EDUCATION")
        
        y_position -= 3 * mm
        c.setStrokeColor(PRIMARY_COLOR)
        c.setLineWidth(2)
        c.line(content_x, y_position, content_x + 50 * mm, y_position)
        
        y_position -= 8 * mm
        
        for edu in education[:3]:  # Limit to 3 education entries
            c.setFillColor(TEXT_COLOR)
            c.setFont("Helvetica-Bold", 10)
            c.drawString(content_x, y_position, edu.get('degree', '')[:50])
            
            # Date on right
            grad_date = edu.get('graduationDate', '')
            if grad_date:
                c.setFont("Helvetica", 9)
                c.drawRightString(width - 15 * mm, y_position, grad_date)
            
            y_position -= 5 * mm
            c.setFillColor(SECONDARY_COLOR)
            c.setFont("Helvetica-Oblique", 9)
            institution = f"{edu.get('institution', '')}, {edu.get('location', '')}"
            c.drawString(content_x, y_position, institution[:60])
            
            y_position -= 5 * mm
            desc = edu.get('description', '')
            if desc:
                c.setFillColor(TEXT_COLOR)
                c.setFont("Helvetica", 8)
                c.drawString(content_x + 3 * mm, y_position, f"• {desc[:70]}")
                y_position -= 4 * mm
            
            y_position -= 5 * mm
    
    # Experience Section
    if experience:
        y_position -= 5 * mm
        c.setFillColor(PRIMARY_COLOR)
        c.setFont("Helvetica-Bold", 14)
        c.drawString(content_x, y_position, "EMPLOYMENT")
        
        y_position -= 3 * mm
        c.setStrokeColor(PRIMARY_COLOR)
        c.setLineWidth(2)
        c.line(content_x, y_position, content_x + 50 * mm, y_position)
        
        y_position -= 8 * mm
        
        for exp in experience[:3]:  # Limit to 3 experience entries
            c.setFillColor(TEXT_COLOR)
            c.setFont("Helvetica-Bold", 10)
            c.drawString(content_x, y_position, exp.get('position', '')[:45])
            
            # Date range on right
            date_range = f"{exp.get('startDate', '')} - {exp.get('endDate', 'Present') if not exp.get('current') else 'Present'}"
            c.setFont("Helvetica", 9)
            c.drawRightString(width - 15 * mm, y_position, date_range)
            
            y_position -= 5 * mm
            c.setFillColor(SECONDARY_COLOR)
            c.setFont("Helvetica-Oblique", 9)
            company_info = f"{exp.get('employer', '')}, {exp.get('location', '')}"
            c.drawString(content_x, y_position, company_info[:60])
            
            y_position -= 5 * mm
            
            # Description bullets
            descriptions = exp.get('description', [])
            if isinstance(descriptions, list):
                c.setFillColor(TEXT_COLOR)
                c.setFont("Helvetica", 8)
                for desc in descriptions[:4]:  # Limit to 4 bullet points
                    if desc:
                        c.drawString(content_x + 3 * mm, y_position, f"• {desc[:65]}")
                        y_position -= 4 * mm
            
            y_position -= 5 * mm
    
    # Certificates Section
    if certificates and y_position > 50 * mm:
        y_position -= 5 * mm
        c.setFillColor(PRIMARY_COLOR)
        c.setFont("Helvetica-Bold", 14)
        c.drawString(content_x, y_position, "CERTIFICATES & LICENSES")
        
        y_position -= 3 * mm
        c.setStrokeColor(PRIMARY_COLOR)
        c.setLineWidth(2)
        c.line(content_x, y_position, content_x + 60 * mm, y_position)
        
        y_position -= 7 * mm
        
        for cert in certificates[:5]:  # Limit to 5 certificates
            c.setFillColor(TEXT_COLOR)
            c.setFont("Helvetica-Bold", 9)
            c.drawString(content_x, y_position, cert.get('name', '')[:45])
            
            cert_date = cert.get('date', '')
            if cert_date:
                c.setFont("Helvetica", 8)
                c.drawRightString(width - 15 * mm, y_position, cert_date)
            
            y_position -= 4 * mm
            c.setFillColor(LIGHT_TEXT)
            c.setFont("Helvetica", 8)
            issuer = cert.get('issuer', '')
            validity = cert.get('validity', '')
            cert_info = f"{issuer}"
            if validity:
                cert_info += f" | Valid: {validity}"
            c.drawString(content_x, y_position, cert_info[:60])
            
            y_position -= 6 * mm
    
    # Save the PDF
    c.save()
    buffer.seek(0)
    return buffer
