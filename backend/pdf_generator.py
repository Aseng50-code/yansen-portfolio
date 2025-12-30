"""
CV PDF Generator for CV Build for SEAMAN
Generates professional maritime CV PDFs using ReportLab - Matching Web Preview Design
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, cm
from reportlab.lib.colors import HexColor, white, black
from reportlab.pdfgen import canvas
from io import BytesIO
import base64
import math


# Color scheme matching the frontend
PRIMARY_COLOR = HexColor('#0C4A6E')  # sky-800
SECONDARY_COLOR = HexColor('#075985')  # sky-700
TEXT_COLOR = HexColor('#1f2937')  # gray-800
LIGHT_TEXT = HexColor('#6b7280')  # gray-500
DOT_FILLED = HexColor('#0369A1')  # sky-700
DOT_EMPTY = HexColor('#D1D5DB')  # gray-300


def draw_circle_clip_image(c, image_data, center_x, center_y, radius):
    """Draw a circular photo with white border"""
    try:
        if ',' in image_data:
            photo_data = base64.b64decode(image_data.split(',')[1])
        else:
            photo_data = base64.b64decode(image_data)
        
        from PIL import Image as PILImage
        from io import BytesIO as ImgBuffer
        from reportlab.lib.utils import ImageReader
        
        img_buffer = ImgBuffer(photo_data)
        img = PILImage.open(img_buffer)
        
        # Create circular mask
        size = (int(radius * 2 * 3), int(radius * 2 * 3))  # 3x for quality
        mask = PILImage.new('L', size, 0)
        from PIL import ImageDraw
        draw = ImageDraw.Draw(mask)
        draw.ellipse((0, 0, size[0], size[1]), fill=255)
        
        # Resize and crop image to square
        img = img.convert('RGBA')
        min_dim = min(img.size)
        left = (img.size[0] - min_dim) // 2
        top = (img.size[1] - min_dim) // 2
        img = img.crop((left, top, left + min_dim, top + min_dim))
        img = img.resize(size, PILImage.Resampling.LANCZOS)
        
        # Apply circular mask
        output = PILImage.new('RGBA', size, (255, 255, 255, 0))
        output.paste(img, (0, 0))
        output.putalpha(mask)
        
        # Save to buffer
        output_buffer = ImgBuffer()
        output.save(output_buffer, format='PNG')
        output_buffer.seek(0)
        
        # Draw white circle border first
        c.setStrokeColor(white)
        c.setLineWidth(4)
        c.circle(center_x, center_y, radius + 2, fill=False, stroke=True)
        
        # Draw the circular image
        img_reader = ImageReader(output_buffer)
        c.drawImage(img_reader, center_x - radius, center_y - radius, 
                   width=radius * 2, height=radius * 2, mask='auto')
        
        return True
    except Exception as e:
        print(f"Error drawing circular image: {e}")
        return False


def draw_icon(c, icon_type, x, y, size=4*mm):
    """Draw simple icons for personal details"""
    c.setStrokeColor(white)
    c.setFillColor(white)
    c.setLineWidth(0.5)
    
    cx = x + size/2
    cy = y + size/2
    
    if icon_type == 'person':
        # Head circle
        c.circle(cx, cy + size*0.15, size*0.25, fill=True)
        # Body arc
        c.arc(cx - size*0.35, cy - size*0.4, cx + size*0.35, cy + size*0.1, 0, 180)
        
    elif icon_type == 'email':
        # Envelope
        c.rect(x + size*0.1, y + size*0.25, size*0.8, size*0.5, fill=False, stroke=True)
        # V lines for envelope flap
        c.line(x + size*0.1, y + size*0.75, cx, cy)
        c.line(x + size*0.9, y + size*0.75, cx, cy)
        
    elif icon_type == 'phone':
        # Simple phone shape
        c.roundRect(x + size*0.2, y + size*0.1, size*0.6, size*0.8, size*0.1, fill=False, stroke=True)
        c.line(x + size*0.35, y + size*0.2, x + size*0.65, y + size*0.2)
        
    elif icon_type == 'location':
        # Location pin
        c.circle(cx, cy + size*0.1, size*0.2, fill=True)
        # Triangle for pin point
        path = c.beginPath()
        path.moveTo(cx - size*0.25, cy + size*0.1)
        path.lineTo(cx, cy - size*0.35)
        path.lineTo(cx + size*0.25, cy + size*0.1)
        path.close()
        c.drawPath(path, fill=True, stroke=False)
        
    elif icon_type == 'flag':
        # Flag for nationality
        c.line(x + size*0.2, y + size*0.1, x + size*0.2, y + size*0.9)
        c.rect(x + size*0.2, y + size*0.5, size*0.6, size*0.35, fill=True)
        
    elif icon_type == 'calendar':
        # Calendar
        c.rect(x + size*0.15, y + size*0.15, size*0.7, size*0.6, fill=False, stroke=True)
        c.line(x + size*0.15, y + size*0.55, x + size*0.85, y + size*0.55)
        # Top hooks
        c.line(x + size*0.35, y + size*0.75, x + size*0.35, y + size*0.85)
        c.line(x + size*0.65, y + size*0.75, x + size*0.65, y + size*0.85)


def draw_skill_dots(c, x, y, level, max_level=5, dot_size=3*mm, spacing=1.5*mm):
    """Draw skill rating dots"""
    for i in range(max_level):
        if i < level:
            c.setFillColor(DOT_FILLED)
        else:
            c.setFillColor(DOT_EMPTY)
        c.circle(x + i * (dot_size + spacing), y, dot_size/2, fill=True, stroke=False)


def generate_cv_pdf(cv_data: dict, profile_photo: str = None) -> BytesIO:
    """
    Generate a professional CV PDF matching the web preview design
    """
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4
    
    # Layout dimensions
    sidebar_width = 72 * mm
    content_x = sidebar_width + 8 * mm
    content_width = width - content_x - 12 * mm
    margin_left = 8 * mm
    
    # Extract data with defaults
    personal_info = cv_data.get('personalInfo', {})
    experience = cv_data.get('experience', [])
    education = cv_data.get('education', [])
    certificates = cv_data.get('certificates', [])
    skills = cv_data.get('skills', [])
    languages = cv_data.get('languages', [])
    
    # ==================== LEFT SIDEBAR (Blue) ====================
    # Draw blue sidebar background - only top portion for personal details
    blue_section_height = 180 * mm  # Adjust based on content
    c.setFillColor(PRIMARY_COLOR)
    c.rect(0, height - blue_section_height, sidebar_width, blue_section_height, fill=True, stroke=False)
    
    # Starting Y position
    y_pos = height - 18 * mm
    
    # === NAME ===
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 18)
    name = personal_info.get('fullName', 'Your Name')
    
    # Center name with word wrap
    name_lines = []
    words = name.split()
    current_line = ""
    for word in words:
        test_line = current_line + " " + word if current_line else word
        if c.stringWidth(test_line, "Helvetica-Bold", 18) > sidebar_width - 16*mm:
            if current_line:
                name_lines.append(current_line)
            current_line = word
        else:
            current_line = test_line
    if current_line:
        name_lines.append(current_line)
    
    for line in name_lines:
        c.drawCentredString(sidebar_width / 2, y_pos, line)
        y_pos -= 7 * mm
    
    # === TITLE/POSITION ===
    y_pos -= 2 * mm
    c.setFont("Helvetica-Bold", 11)
    title = personal_info.get('title', 'Professional Title')
    
    # Word wrap for title
    title_lines = []
    words = title.split()
    current_line = ""
    for word in words:
        test_line = current_line + " " + word if current_line else word
        if c.stringWidth(test_line, "Helvetica-Bold", 11) > sidebar_width - 16*mm:
            if current_line:
                title_lines.append(current_line)
            current_line = word
        else:
            current_line = test_line
    if current_line:
        title_lines.append(current_line)
    
    for line in title_lines:
        c.drawCentredString(sidebar_width / 2, y_pos, line)
        y_pos -= 5 * mm
    
    # === PHOTO (Circular, Larger) ===
    y_pos -= 8 * mm
    photo_radius = 22 * mm  # Larger circular photo
    photo_center_x = sidebar_width / 2
    photo_center_y = y_pos - photo_radius
    
    if profile_photo:
        success = draw_circle_clip_image(c, profile_photo, photo_center_x, photo_center_y, photo_radius)
        if not success:
            # Draw placeholder circle
            c.setStrokeColor(white)
            c.setLineWidth(3)
            c.circle(photo_center_x, photo_center_y, photo_radius, fill=False, stroke=True)
            c.setFillColor(white)
            c.setFont("Helvetica", 9)
            c.drawCentredString(photo_center_x, photo_center_y, "Photo")
    else:
        # Draw placeholder circle with border
        c.setStrokeColor(white)
        c.setLineWidth(3)
        c.setFillColor(HexColor('#0A3D5C'))  # Slightly lighter blue
        c.circle(photo_center_x, photo_center_y, photo_radius, fill=True, stroke=True)
        c.setFillColor(white)
        c.setFont("Helvetica", 9)
        c.drawCentredString(photo_center_x, photo_center_y, "Upload Photo")
    
    y_pos = photo_center_y - photo_radius - 12 * mm
    
    # === PERSONAL DETAILS SECTION ===
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(margin_left, y_pos, "PERSONAL DETAILS")
    
    # Underline
    y_pos -= 3 * mm
    c.setStrokeColor(white)
    c.setLineWidth(1)
    c.line(margin_left, y_pos, sidebar_width - margin_left, y_pos)
    
    y_pos -= 10 * mm
    
    # Personal detail items with icons
    icon_size = 4 * mm
    text_x = margin_left + icon_size + 4 * mm
    c.setFont("Helvetica", 9)
    
    details = [
        ('person', personal_info.get('fullName', '')),
        ('email', personal_info.get('email', '')),
        ('phone', personal_info.get('phone', '')),
        ('location', personal_info.get('location', '')),
        ('flag', personal_info.get('nationality', '')),
        ('calendar', personal_info.get('dateOfBirth', '')),
    ]
    
    for icon_type, value in details:
        if value:
            # Draw icon
            draw_icon(c, icon_type, margin_left, y_pos - icon_size/2, icon_size)
            
            # Draw text with word wrap
            c.setFillColor(white)
            c.setFont("Helvetica", 9)
            
            # Check if text needs wrapping
            max_text_width = sidebar_width - text_x - margin_left
            if c.stringWidth(value, "Helvetica", 9) > max_text_width:
                # Wrap text
                words = value.split()
                line = ""
                line_y = y_pos
                for word in words:
                    test = line + " " + word if line else word
                    if c.stringWidth(test, "Helvetica", 9) > max_text_width:
                        c.drawString(text_x, line_y, line)
                        line_y -= 4 * mm
                        line = word
                    else:
                        line = test
                if line:
                    c.drawString(text_x, line_y, line)
                    y_pos = line_y - 7 * mm
            else:
                c.drawString(text_x, y_pos, value)
                y_pos -= 7 * mm
    
    # ==================== SKILLS SECTION (Still in sidebar, below blue) ====================
    # Draw white background for rest of sidebar
    white_section_top = y_pos + 5 * mm
    c.setFillColor(white)
    c.rect(0, 0, sidebar_width, white_section_top, fill=True, stroke=False)
    
    y_pos -= 10 * mm
    
    # Skills header
    c.setFillColor(PRIMARY_COLOR)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(margin_left, y_pos, "SKILLS")
    
    y_pos -= 3 * mm
    c.setStrokeColor(PRIMARY_COLOR)
    c.setLineWidth(1)
    c.line(margin_left, y_pos, sidebar_width - margin_left, y_pos)
    
    y_pos -= 8 * mm
    
    # Draw skills with dots
    c.setFont("Helvetica", 9)
    for skill in skills[:8]:
        skill_name = skill.get('name', '')
        skill_level = skill.get('level', 3)
        
        c.setFillColor(TEXT_COLOR)
        c.drawString(margin_left, y_pos, skill_name[:22])
        
        y_pos -= 5 * mm
        draw_skill_dots(c, margin_left, y_pos + 1*mm, skill_level)
        y_pos -= 7 * mm
    
    # === LANGUAGES SECTION ===
    if languages:
        y_pos -= 5 * mm
        c.setFillColor(PRIMARY_COLOR)
        c.setFont("Helvetica-Bold", 11)
        c.drawString(margin_left, y_pos, "LANGUAGES")
        
        y_pos -= 3 * mm
        c.setStrokeColor(PRIMARY_COLOR)
        c.line(margin_left, y_pos, sidebar_width - margin_left, y_pos)
        
        y_pos -= 7 * mm
        c.setFont("Helvetica", 9)
        
        for lang in languages[:5]:
            c.setFillColor(TEXT_COLOR)
            lang_text = f"{lang.get('name', '')}: {lang.get('level', '')}"
            c.drawString(margin_left, y_pos, lang_text)
            y_pos -= 5 * mm
    
    # ==================== RIGHT CONTENT AREA ====================
    y_pos = height - 20 * mm
    
    # === PROFILE/SUMMARY ===
    summary = personal_info.get('summary', '')
    if summary:
        c.setFillColor(PRIMARY_COLOR)
        c.setFont("Helvetica-Bold", 14)
        c.drawString(content_x, y_pos, "PROFILE")
        
        y_pos -= 4 * mm
        c.setStrokeColor(PRIMARY_COLOR)
        c.setLineWidth(2)
        c.line(content_x, y_pos, content_x + 45 * mm, y_pos)
        
        y_pos -= 8 * mm
        c.setFillColor(TEXT_COLOR)
        c.setFont("Helvetica", 9)
        
        # Word wrap summary
        words = summary.split()
        line = ""
        max_width = content_width
        for word in words:
            test = line + " " + word if line else word
            if c.stringWidth(test, "Helvetica", 9) > max_width:
                c.drawString(content_x, y_pos, line)
                y_pos -= 4 * mm
                line = word
            else:
                line = test
        if line:
            c.drawString(content_x, y_pos, line)
            y_pos -= 4 * mm
    
    # === EDUCATION ===
    if education:
        y_pos -= 10 * mm
        c.setFillColor(PRIMARY_COLOR)
        c.setFont("Helvetica-Bold", 14)
        c.drawString(content_x, y_pos, "EDUCATION")
        
        y_pos -= 4 * mm
        c.setStrokeColor(PRIMARY_COLOR)
        c.setLineWidth(2)
        c.line(content_x, y_pos, content_x + 45 * mm, y_pos)
        
        y_pos -= 8 * mm
        
        for edu in education[:3]:
            c.setFillColor(TEXT_COLOR)
            c.setFont("Helvetica-Bold", 10)
            c.drawString(content_x, y_pos, edu.get('degree', '')[:50])
            
            # Date on right
            grad_date = edu.get('graduationDate', '')
            if grad_date:
                c.setFont("Helvetica", 9)
                c.drawRightString(width - 12*mm, y_pos, grad_date)
            
            y_pos -= 5 * mm
            c.setFillColor(SECONDARY_COLOR)
            c.setFont("Helvetica-Oblique", 9)
            institution = f"{edu.get('institution', '')}, {edu.get('location', '')}"
            c.drawString(content_x, y_pos, institution[:55])
            
            y_pos -= 5 * mm
            desc = edu.get('description', '')
            if desc:
                c.setFillColor(TEXT_COLOR)
                c.setFont("Helvetica", 8)
                c.drawString(content_x + 3*mm, y_pos, f"• {desc[:65]}")
                y_pos -= 4 * mm
            
            y_pos -= 5 * mm
    
    # === EMPLOYMENT ===
    if experience:
        y_pos -= 5 * mm
        c.setFillColor(PRIMARY_COLOR)
        c.setFont("Helvetica-Bold", 14)
        c.drawString(content_x, y_pos, "EMPLOYMENT")
        
        y_pos -= 4 * mm
        c.setStrokeColor(PRIMARY_COLOR)
        c.setLineWidth(2)
        c.line(content_x, y_pos, content_x + 45 * mm, y_pos)
        
        y_pos -= 8 * mm
        
        for exp in experience[:3]:
            c.setFillColor(TEXT_COLOR)
            c.setFont("Helvetica-Bold", 10)
            c.drawString(content_x, y_pos, exp.get('position', '')[:45])
            
            # Date range
            date_range = f"{exp.get('startDate', '')} - {exp.get('endDate', 'Present') if not exp.get('current') else 'Present'}"
            c.setFont("Helvetica", 9)
            c.drawRightString(width - 12*mm, y_pos, date_range)
            
            y_pos -= 5 * mm
            c.setFillColor(SECONDARY_COLOR)
            c.setFont("Helvetica-Oblique", 9)
            company = f"{exp.get('employer', '')}, {exp.get('location', '')}"
            c.drawString(content_x, y_pos, company[:55])
            
            y_pos -= 5 * mm
            
            # Description bullets
            descriptions = exp.get('description', [])
            if isinstance(descriptions, list):
                c.setFillColor(TEXT_COLOR)
                c.setFont("Helvetica", 8)
                for desc in descriptions[:5]:
                    if desc and y_pos > 30*mm:
                        c.drawString(content_x + 3*mm, y_pos, f"• {desc[:60]}")
                        y_pos -= 4 * mm
            
            y_pos -= 5 * mm
    
    # === CERTIFICATES ===
    if certificates and y_pos > 50*mm:
        y_pos -= 5 * mm
        c.setFillColor(PRIMARY_COLOR)
        c.setFont("Helvetica-Bold", 14)
        c.drawString(content_x, y_pos, "CERTIFICATES & LICENSES")
        
        y_pos -= 4 * mm
        c.setStrokeColor(PRIMARY_COLOR)
        c.setLineWidth(2)
        c.line(content_x, y_pos, content_x + 55 * mm, y_pos)
        
        y_pos -= 7 * mm
        
        for cert in certificates[:5]:
            if y_pos < 25*mm:
                break
                
            c.setFillColor(TEXT_COLOR)
            c.setFont("Helvetica-Bold", 9)
            c.drawString(content_x, y_pos, cert.get('name', '')[:45])
            
            cert_date = cert.get('date', '')
            if cert_date:
                c.setFont("Helvetica", 8)
                c.drawRightString(width - 12*mm, y_pos, cert_date)
            
            y_pos -= 4 * mm
            c.setFillColor(LIGHT_TEXT)
            c.setFont("Helvetica", 8)
            issuer = cert.get('issuer', '')
            validity = cert.get('validity', '')
            cert_info = f"{issuer}"
            if validity:
                cert_info += f" | Valid: {validity}"
            c.drawString(content_x, y_pos, cert_info[:55])
            
            y_pos -= 6 * mm
    
    # Save PDF
    c.save()
    buffer.seek(0)
    return buffer
