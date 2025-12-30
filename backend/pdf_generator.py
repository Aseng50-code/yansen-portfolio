"""
CV PDF Generator for CV Build for SEAMAN
Generates professional maritime CV PDFs using ReportLab - Matching Web Preview Design
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, white
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from io import BytesIO
import base64
import os


# Color scheme matching the frontend
SIDEBAR_TOP = HexColor('#0C4A6E')  # sky-800
SIDEBAR_BOTTOM = HexColor('#075985')  # sky-900
TEXT_COLOR = HexColor('#1f2937')  # gray-800
LIGHT_TEXT = HexColor('#6b7280')  # gray-500
DOT_FILLED = HexColor('#0369A1')  # sky-700
DOT_EMPTY = HexColor('#D1D5DB')  # gray-300
HEADING_COLOR = HexColor('#0C4A6E')  # sky-800


def draw_gradient_rect(c, x, y, w, h, color1, color2, steps=50):
    """Draw a vertical gradient rectangle"""
    step_h = h / steps
    for i in range(steps):
        # Interpolate between colors
        ratio = i / steps
        r = color1.red + (color2.red - color1.red) * ratio
        g = color1.green + (color2.green - color1.green) * ratio
        b = color1.blue + (color2.blue - color1.blue) * ratio
        c.setFillColorRGB(r, g, b)
        c.rect(x, y + h - (i + 1) * step_h, w, step_h + 0.5, fill=True, stroke=False)


def draw_circular_photo(c, image_data, center_x, center_y, radius):
    """Draw a circular photo with white border"""
    try:
        if ',' in image_data:
            photo_data = base64.b64decode(image_data.split(',')[1])
        else:
            photo_data = base64.b64decode(image_data)
        
        from PIL import Image as PILImage, ImageDraw
        from io import BytesIO as ImgBuffer
        from reportlab.lib.utils import ImageReader
        
        img_buffer = ImgBuffer(photo_data)
        img = PILImage.open(img_buffer)
        
        # Create circular mask
        size = (int(radius * 2 * 4), int(radius * 2 * 4))  # High res for quality
        mask = PILImage.new('L', size, 0)
        draw = ImageDraw.Draw(mask)
        draw.ellipse((0, 0, size[0], size[1]), fill=255)
        
        # Resize and crop to square
        img = img.convert('RGBA')
        min_dim = min(img.size)
        left = (img.size[0] - min_dim) // 2
        top = (img.size[1] - min_dim) // 2
        img = img.crop((left, top, left + min_dim, top + min_dim))
        img = img.resize(size, PILImage.Resampling.LANCZOS)
        
        # Apply mask
        output = PILImage.new('RGBA', size, (255, 255, 255, 0))
        output.paste(img, (0, 0))
        output.putalpha(mask)
        
        output_buffer = ImgBuffer()
        output.save(output_buffer, format='PNG')
        output_buffer.seek(0)
        
        # Draw white circle border
        c.setStrokeColor(white)
        c.setLineWidth(6)
        c.circle(center_x, center_y, radius + 3, fill=False, stroke=True)
        
        # Draw the image
        img_reader = ImageReader(output_buffer)
        c.drawImage(img_reader, center_x - radius, center_y - radius, 
                   width=radius * 2, height=radius * 2, mask='auto')
        return True
    except Exception as e:
        print(f"Photo error: {e}")
        return False


def draw_text_icon(c, symbol, x, y, size=10):
    """Draw a text-based icon symbol"""
    c.setFont("Helvetica", size)
    c.drawString(x, y, symbol)


def draw_skill_dots(c, x, y, level, max_level=5):
    """Draw skill rating dots"""
    dot_size = 3.5 * mm
    spacing = 1.5 * mm
    for i in range(max_level):
        if i < level:
            c.setFillColor(DOT_FILLED)
        else:
            c.setFillColor(DOT_EMPTY)
        c.circle(x + i * (dot_size + spacing) + dot_size/2, y, dot_size/2, fill=True, stroke=False)


def generate_cv_pdf(cv_data: dict, profile_photo: str = None) -> BytesIO:
    """Generate a professional CV PDF matching the web preview design"""
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4
    
    # Layout
    sidebar_width = 74 * mm
    content_x = sidebar_width + 8 * mm
    content_width = width - content_x - 12 * mm
    margin = 8 * mm
    
    # Data extraction
    personal = cv_data.get('personalInfo', {})
    experience = cv_data.get('experience', [])
    education = cv_data.get('education', [])
    certificates = cv_data.get('certificates', [])
    skills = cv_data.get('skills', [])
    languages = cv_data.get('languages', [])
    
    # ==================== LEFT SIDEBAR ====================
    # Calculate blue section height based on content
    blue_height = 175 * mm
    
    # Draw gradient sidebar (from sky-800 to sky-900)
    draw_gradient_rect(c, 0, height - blue_height, sidebar_width, blue_height, SIDEBAR_TOP, SIDEBAR_BOTTOM)
    
    y = height - 18 * mm
    
    # === NAME ===
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 18)
    name = personal.get('fullName', 'Your Name')
    
    # Word wrap name
    max_name_width = sidebar_width - 16*mm
    if c.stringWidth(name, "Helvetica-Bold", 18) > max_name_width:
        words = name.split()
        line1 = ""
        line2 = ""
        for word in words:
            test = line1 + " " + word if line1 else word
            if c.stringWidth(test, "Helvetica-Bold", 18) <= max_name_width:
                line1 = test
            else:
                line2 += " " + word if line2 else word
        c.drawCentredString(sidebar_width/2, y, line1)
        if line2:
            y -= 6*mm
            c.drawCentredString(sidebar_width/2, y, line2)
    else:
        c.drawCentredString(sidebar_width/2, y, name)
    
    # Underline
    y -= 5*mm
    c.setStrokeColor(white)
    c.setLineWidth(2)
    c.line(sidebar_width/2 - 30*mm, y, sidebar_width/2 + 30*mm, y)
    
    # === TITLE ===
    y -= 6*mm
    c.setFont("Helvetica-Bold", 11)
    title = personal.get('title', 'Professional Title')
    
    # Word wrap title
    if c.stringWidth(title, "Helvetica-Bold", 11) > max_name_width:
        words = title.split()
        line = ""
        for word in words:
            test = line + " " + word if line else word
            if c.stringWidth(test, "Helvetica-Bold", 11) <= max_name_width:
                line = test
            else:
                c.drawCentredString(sidebar_width/2, y, line)
                y -= 5*mm
                line = word
        if line:
            c.drawCentredString(sidebar_width/2, y, line)
    else:
        c.drawCentredString(sidebar_width/2, y, title)
    
    # === PHOTO ===
    y -= 10*mm
    photo_radius = 24*mm
    photo_x = sidebar_width/2
    photo_y = y - photo_radius
    
    photo_drawn = False
    if profile_photo:
        photo_drawn = draw_circular_photo(c, profile_photo, photo_x, photo_y, photo_radius)
    
    if not photo_drawn:
        # Placeholder circle
        c.setFillColor(HexColor('#0A3D5C'))
        c.setStrokeColor(white)
        c.setLineWidth(6)
        c.circle(photo_x, photo_y, photo_radius, fill=True, stroke=True)
        c.setFillColor(white)
        c.setFont("Helvetica", 10)
        c.drawCentredString(photo_x, photo_y, "Upload Photo")
    
    y = photo_y - photo_radius - 12*mm
    
    # === PERSONAL DETAILS ===
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 12)
    c.drawString(margin, y, "PERSONAL DETAILS")
    y -= 3*mm
    c.setLineWidth(1.5)
    c.line(margin, y, sidebar_width - margin, y)
    y -= 10*mm
    
    # Personal details with simple text symbols
    c.setFont("Helvetica", 9)
    icon_col = margin
    text_col = margin + 8*mm
    line_height = 6.5*mm
    
    details = [
        ('●', personal.get('fullName', '')),
        ('✉', personal.get('email', '')),
        ('☎', personal.get('phone', '')),
        ('⌂', personal.get('location', '')),
        ('⚑', personal.get('nationality', '')),
        ('◉', personal.get('dateOfBirth', '')),
    ]
    
    # Social media
    if personal.get('linkedin'):
        details.append(('in', personal.get('linkedin')))
    if personal.get('facebook'):
        details.append(('f', personal.get('facebook')))
    if personal.get('instagram'):
        details.append(('📷', personal.get('instagram')))
    if personal.get('twitter'):
        details.append(('𝕏', personal.get('twitter')))
    if personal.get('youtube'):
        details.append(('▶', personal.get('youtube')))
    
    for symbol, value in details:
        if value:
            # Draw symbol
            c.setFont("Helvetica-Bold", 9)
            c.drawString(icon_col, y, symbol)
            
            # Draw value with word wrap
            c.setFont("Helvetica", 9)
            max_text_width = sidebar_width - text_col - margin
            
            if c.stringWidth(value, "Helvetica", 9) > max_text_width:
                # Wrap long text
                words = value.split()
                line = ""
                for word in words:
                    test = line + " " + word if line else word
                    if c.stringWidth(test, "Helvetica", 9) <= max_text_width:
                        line = test
                    else:
                        c.drawString(text_col, y, line)
                        y -= 4*mm
                        line = word
                if line:
                    c.drawString(text_col, y, line)
            else:
                c.drawString(text_col, y, value)
            
            y -= line_height
    
    # ==================== WHITE SECTION (Skills & Languages) ====================
    white_top = y + 5*mm
    c.setFillColor(white)
    c.rect(0, 0, sidebar_width, white_top, fill=True, stroke=False)
    
    y -= 8*mm
    
    # === SKILLS ===
    if skills:
        c.setFillColor(HEADING_COLOR)
        c.setFont("Helvetica-Bold", 12)
        c.drawString(margin, y, "SKILLS")
        y -= 3*mm
        c.setStrokeColor(HEADING_COLOR)
        c.setLineWidth(1.5)
        c.line(margin, y, sidebar_width - margin, y)
        y -= 10*mm
        
        c.setFont("Helvetica", 9)
        for skill in skills[:8]:
            c.setFillColor(TEXT_COLOR)
            c.drawString(margin, y, skill.get('name', '')[:24])
            y -= 5*mm
            draw_skill_dots(c, margin, y + 1*mm, skill.get('level', 3))
            y -= 7*mm
    
    # === LANGUAGES ===
    if languages:
        y -= 5*mm
        c.setFillColor(HEADING_COLOR)
        c.setFont("Helvetica-Bold", 12)
        c.drawString(margin, y, "LANGUAGES")
        y -= 3*mm
        c.setStrokeColor(HEADING_COLOR)
        c.line(margin, y, sidebar_width - margin, y)
        y -= 8*mm
        
        c.setFont("Helvetica", 9)
        for lang in languages[:5]:
            c.setFillColor(TEXT_COLOR)
            lang_text = f"{lang.get('name', '')}: {lang.get('level', '')}"
            c.drawString(margin, y, lang_text)
            y -= 5.5*mm
    
    # ==================== RIGHT CONTENT AREA ====================
    y = height - 20*mm
    
    # === PROFILE ===
    summary = personal.get('summary', '')
    if summary:
        c.setFillColor(HEADING_COLOR)
        c.setFont("Helvetica-Bold", 14)
        c.drawString(content_x, y, "PROFILE")
        y -= 4*mm
        c.setStrokeColor(HEADING_COLOR)
        c.setLineWidth(3)
        c.line(content_x, y, content_x + 45*mm, y)
        y -= 10*mm
        
        c.setFillColor(TEXT_COLOR)
        c.setFont("Helvetica", 9)
        
        # Word wrap summary
        words = summary.split()
        line = ""
        for word in words:
            test = line + " " + word if line else word
            if c.stringWidth(test, "Helvetica", 9) <= content_width:
                line = test
            else:
                c.drawString(content_x, y, line)
                y -= 4*mm
                line = word
        if line:
            c.drawString(content_x, y, line)
            y -= 4*mm
    
    # === EDUCATION ===
    if education:
        y -= 10*mm
        c.setFillColor(HEADING_COLOR)
        c.setFont("Helvetica-Bold", 14)
        c.drawString(content_x, y, "EDUCATION")
        y -= 4*mm
        c.setStrokeColor(HEADING_COLOR)
        c.setLineWidth(3)
        c.line(content_x, y, content_x + 45*mm, y)
        y -= 10*mm
        
        for edu in education[:3]:
            c.setFillColor(TEXT_COLOR)
            c.setFont("Helvetica-Bold", 10)
            c.drawString(content_x, y, edu.get('degree', '')[:50])
            
            grad_date = edu.get('graduationDate', '')
            if grad_date:
                c.setFont("Helvetica", 9)
                c.drawRightString(width - 12*mm, y, grad_date)
            
            y -= 5*mm
            c.setFillColor(HEADING_COLOR)
            c.setFont("Helvetica-Oblique", 9)
            inst = f"{edu.get('institution', '')}, {edu.get('location', '')}"
            c.drawString(content_x, y, inst[:55])
            
            y -= 5*mm
            desc = edu.get('description', '')
            if desc:
                c.setFillColor(TEXT_COLOR)
                c.setFont("Helvetica", 8)
                c.drawString(content_x + 3*mm, y, f"• {desc[:65]}")
                y -= 4*mm
            y -= 5*mm
    
    # === EMPLOYMENT ===
    if experience:
        y -= 5*mm
        c.setFillColor(HEADING_COLOR)
        c.setFont("Helvetica-Bold", 14)
        c.drawString(content_x, y, "EMPLOYMENT")
        y -= 4*mm
        c.setStrokeColor(HEADING_COLOR)
        c.setLineWidth(3)
        c.line(content_x, y, content_x + 45*mm, y)
        y -= 10*mm
        
        for exp in experience[:3]:
            if y < 40*mm:
                break
            c.setFillColor(TEXT_COLOR)
            c.setFont("Helvetica-Bold", 10)
            c.drawString(content_x, y, exp.get('position', '')[:45])
            
            date_range = f"{exp.get('startDate', '')} - {exp.get('endDate', 'Present') if not exp.get('current') else 'Present'}"
            c.setFont("Helvetica", 9)
            c.drawRightString(width - 12*mm, y, date_range)
            
            y -= 5*mm
            c.setFillColor(HEADING_COLOR)
            c.setFont("Helvetica-Oblique", 9)
            company = f"{exp.get('employer', '')}, {exp.get('location', '')}"
            c.drawString(content_x, y, company[:55])
            
            y -= 5*mm
            descriptions = exp.get('description', [])
            if isinstance(descriptions, list):
                c.setFillColor(TEXT_COLOR)
                c.setFont("Helvetica", 8)
                for desc in descriptions[:4]:
                    if desc and y > 35*mm:
                        c.drawString(content_x + 3*mm, y, f"• {desc[:60]}")
                        y -= 4*mm
            y -= 5*mm
    
    # === CERTIFICATES ===
    if certificates and y > 50*mm:
        y -= 5*mm
        c.setFillColor(HEADING_COLOR)
        c.setFont("Helvetica-Bold", 14)
        c.drawString(content_x, y, "CERTIFICATES & LICENSES")
        y -= 4*mm
        c.setStrokeColor(HEADING_COLOR)
        c.setLineWidth(3)
        c.line(content_x, y, content_x + 55*mm, y)
        y -= 8*mm
        
        for cert in certificates[:5]:
            if y < 25*mm:
                break
            c.setFillColor(TEXT_COLOR)
            c.setFont("Helvetica-Bold", 9)
            c.drawString(content_x, y, cert.get('name', '')[:45])
            
            cert_date = cert.get('date', '')
            if cert_date:
                c.setFont("Helvetica", 8)
                c.drawRightString(width - 12*mm, y, cert_date)
            
            y -= 4*mm
            c.setFillColor(LIGHT_TEXT)
            c.setFont("Helvetica", 8)
            issuer = cert.get('issuer', '')
            validity = cert.get('validity', '')
            info = f"{issuer}"
            if validity:
                info += f" | Valid: {validity}"
            c.drawString(content_x, y, info[:55])
            y -= 6*mm
    
    c.save()
    buffer.seek(0)
    return buffer
