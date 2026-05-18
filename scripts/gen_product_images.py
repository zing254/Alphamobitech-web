#!/usr/bin/env python3
"""Generate proper product phone images for Alphamobitech."""
from PIL import Image, ImageDraw, ImageFont
import os

OUTPUT_DIR = "/home/zingri/dev/BACKUPZ_DEV_SERVER/alphamobi/dist/images/phones"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Brand colors
BRAND_COLORS = {
    "Apple": {"bg": "#1d1d1f", "accent": "#0071e3", "text": "#f5f5f7"},
    "Samsung": {"bg": "#1428a0", "accent": "#ffffff", "text": "#ffffff"},
    "Xiaomi": {"bg": "#ff6900", "accent": "#ffffff", "text": "#ffffff"},
    "Google": {"bg": "#4285f4", "accent": "#ffffff", "text": "#ffffff"},
    "OnePlus": {"bg": "#eb0028", "accent": "#ffffff", "text": "#ffffff"},
    "Huawei": {"bg": "#cf0a2c", "accent": "#ffffff", "text": "#ffffff"},
    "Oppo": {"bg": "#00a550", "accent": "#ffffff", "text": "#ffffff"},
    "Vivo": {"bg": "#415fff", "accent": "#ffffff", "text": "#ffffff"},
    "Realme": {"bg": "#ffc915", "accent": "#000000", "text": "#000000"},
    "Tecno": {"bg": "#00b4d8", "accent": "#ffffff", "text": "#ffffff"},
    "Infinix": {"bg": "#6c63ff", "accent": "#ffffff", "text": "#ffffff"},
    "Nokia": {"bg": "#124191", "accent": "#ffffff", "text": "#ffffff"},
    "Sony": {"bg": "#000000", "accent": "#ffffff", "text": "#ffffff"},
    "LG": {"bg": "#a50034", "accent": "#ffffff", "text": "#ffffff"},
    "Motorola": {"bg": "#5c5c5c", "accent": "#ffffff", "text": "#ffffff"},
    "Itel": {"bg": "#0066cc", "accent": "#ffffff", "text": "#ffffff"},
}

# Product data: (filename, display_name, brand, condition, price)
PRODUCTS = [
    # Xiaomi/Redmi
    ("a7-3-64.jpg", "Redmi A7 3/64GB", "Xiaomi", "Brand New", 11200),
    ("a7pro-4-64.jpg", "Redmi A7 Pro 4/64GB", "Xiaomi", "Brand New", 12200),
    ("a7pro-4-128.jpg", "Redmi A7 Pro 4/128GB", "Xiaomi", "Brand New", 13900),
    ("redmi-15c-4-128.jpg", "Redmi 15C 4/128GB", "Xiaomi", "Brand New", 13700),
    ("redmi-15c-6-128.jpg", "Redmi 15C 6/128GB", "Xiaomi", "Brand New", 15300),
    ("redmi-15c-8-256.jpg", "Redmi 15C 8/256GB", "Xiaomi", "Brand New", 17400),
    ("redmi-15-6-128.jpg", "Redmi 15 6/128GB", "Xiaomi", "Brand New", 17900),
    ("redmi-15-8-256.jpg", "Redmi 15 8/256GB", "Xiaomi", "Brand New", 19900),
    ("note-15-6-128.jpg", "Redmi Note 15 6/128GB", "Xiaomi", "Brand New", 23200),
    ("note-15-8-256.jpg", "Redmi Note 15 8/256GB", "Xiaomi", "Brand New", 26900),
    ("note-15pro-8-256.jpg", "Redmi Note 15 Pro 8/256GB", "Xiaomi", "Brand New", 34000),
    ("note-15pro-12-512.jpg", "Redmi Note 15 Pro 12/512GB", "Xiaomi", "Brand New", 42000),
    # Samsung
    ("a06-4-64.jpg", "Samsung Galaxy A06 4/64GB", "Samsung", "Brand New", 11000),
    ("a06-4-128.jpg", "Samsung Galaxy A06 4/128GB", "Samsung", "Brand New", 12500),
    ("a07-4-64.jpg", "Samsung Galaxy A07 4/64GB", "Samsung", "Brand New", 12600),
    ("a07-4-128.jpg", "Samsung Galaxy A07 4/128GB", "Samsung", "Brand New", 13400),
    ("a16-4-128.jpg", "Samsung Galaxy A16 4/128GB", "Samsung", "Brand New", 16300),
    ("a16-6-128.jpg", "Samsung Galaxy A16 6/128GB", "Samsung", "Brand New", 18000),
    ("a17-4-128.jpg", "Samsung Galaxy A17 4/128GB", "Samsung", "Brand New", 18900),
    ("a17-6-128.jpg", "Samsung Galaxy A17 6/128GB", "Samsung", "Brand New", 20000),
    ("a17-8-256.jpg", "Samsung Galaxy A17 8/256GB", "Samsung", "Brand New", 26000),
    ("a26-6-128.jpg", "Samsung Galaxy A26 6/128GB", "Samsung", "Brand New", 26000),
    ("a56-8-256.jpg", "Samsung Galaxy A56 8/256GB", "Samsung", "Brand New", 47500),
    ("a37-8-256.jpg", "Samsung Galaxy A37 8/256GB", "Samsung", "Brand New", 49000),
    ("a57-8-256.jpg", "Samsung Galaxy A57 8/256GB", "Samsung", "Brand New", 56000),
    ("tab-a11-64-4.jpg", "Samsung Tab A11 4/64GB", "Samsung", "Brand New", 16300),
    ("tab-a11-plus-128-6.jpg", "Samsung Tab A11 Plus 6/128GB", "Samsung", "Brand New", 31500),
    ("s25ultra-256gb.jpg", "Samsung S25 Ultra 256GB", "Samsung", "Brand New", 119000),
    ("s25ultra-512gb.jpg", "Samsung S25 Ultra 512GB", "Samsung", "Brand New", 136000),
    ("s26-ultra-25612.jpg", "Samsung S26 Ultra 256GB", "Samsung", "Brand New", 140000),
    ("s26-ultra-51212.jpg", "Samsung S26 Ultra 512GB", "Samsung", "Brand New", 152000),
    ("s26-256.jpg", "Samsung S26 256GB", "Samsung", "Brand New", 107000),
    ("s22-ultra-8128gb.jpg", "Samsung S22 Ultra 8/128GB", "Samsung", "Refurbished", 46000),
    ("s22-ultra-12256gb.jpg", "Samsung S22 Ultra 12/256GB", "Samsung", "Refurbished", 50000),
    ("s22-ultra-12512gb.jpg", "Samsung S22 Ultra 12/512GB", "Samsung", "Refurbished", 55000),
    ("s23-8256gb.jpg", "Samsung S23 8/256GB", "Samsung", "Refurbished", 42000),
    ("s23-ultra-256gb.jpg", "Samsung S23 Ultra 256GB", "Samsung", "Refurbished", 63000),
    ("s23-ultra-512gb.jpg", "Samsung S23 Ultra 512GB", "Samsung", "Refurbished", 67000),
    ("s24-plus-256gb.jpg", "Samsung S24 Plus 256GB", "Samsung", "Refurbished", 60000),
    ("s24-ultra-12256gb.jpg", "Samsung S24 Ultra 12/256GB", "Samsung", "Refurbished", 82000),
    ("s24-ultra-12512gb.jpg", "Samsung S24 Ultra 12/512GB", "Samsung", "Refurbished", 87000),
    ("s25-256gb.jpg", "Samsung S25 256GB", "Samsung", "Brand New", 60000),
    ("s25-ultra-12256gb.jpg", "Samsung S25 Ultra 12/256GB", "Samsung", "Brand New", 95000),
    ("s25-ultra-12512gb.jpg", "Samsung S25 Ultra 12/512GB", "Samsung", "Brand New", 105000),
    ("fold-6-512gb.jpg", "Samsung Galaxy Fold 6 512GB", "Samsung", "Refurbished", 95000),
    # Apple iPhone
    ("11-128gb.jpg", "iPhone 11 128GB", "Apple", "Refurbished", 27000),
    ("11-256gb.jpg", "iPhone 11 256GB", "Apple", "Refurbished", 29000),
    ("11-pro-256gb.jpg", "iPhone 11 Pro 256GB", "Apple", "Refurbished", 34000),
    ("11-pro-max-256gb.jpg", "iPhone 11 Pro Max 256GB", "Apple", "Refurbished", 38000),
    ("11-pro-max-512gb.jpg", "iPhone 11 Pro Max 512GB", "Apple", "Refurbished", 40000),
    ("12-128gb.jpg", "iPhone 12 128GB", "Apple", "Refurbished", 32000),
    ("12-pro-128gb.jpg", "iPhone 12 Pro 128GB", "Apple", "Refurbished", 38000),
    ("12-pro-256gb.jpg", "iPhone 12 Pro 256GB", "Apple", "Refurbished", 42000),
    ("12-pro-512gb.jpg", "iPhone 12 Pro 512GB", "Apple", "Refurbished", 44000),
    ("12-pro-max-128gb.jpg", "iPhone 12 Pro Max 128GB", "Apple", "Refurbished", 44000),
    ("12-pro-max-256gb.jpg", "iPhone 12 Pro Max 256GB", "Apple", "Refurbished", 49000),
    ("12-pro-max-512gb.jpg", "iPhone 12 Pro Max 512GB", "Apple", "Refurbished", 50000),
    ("13-128gb.jpg", "iPhone 13 128GB", "Apple", "Refurbished", 40000),
    ("13-256gb.jpg", "iPhone 13 256GB", "Apple", "Refurbished", 42000),
    ("13-512gb.jpg", "iPhone 13 512GB", "Apple", "Refurbished", 45000),
    ("13-pro-128gb.jpg", "iPhone 13 Pro 128GB", "Apple", "Refurbished", 50000),
    ("13-pro-256gb.jpg", "iPhone 13 Pro 256GB", "Apple", "Refurbished", 55000),
    ("13-pro-512gb.jpg", "iPhone 13 Pro 512GB", "Apple", "Refurbished", 58000),
    ("13-pro-1tb.jpg", "iPhone 13 Pro 1TB", "Apple", "Refurbished", 60000),
    ("13-pro-max-128gb.jpg", "iPhone 13 Pro Max 128GB", "Apple", "Refurbished", 57000),
    ("13-pro-max-256gb.jpg", "iPhone 13 Pro Max 256GB", "Apple", "Refurbished", 63000),
    ("13-pro-max-512gb.jpg", "iPhone 13 Pro Max 512GB", "Apple", "Refurbished", 65000),
    ("13-pro-max-1tb.jpg", "iPhone 13 Pro Max 1TB", "Apple", "Refurbished", 67000),
    ("14-128gb.jpg", "iPhone 14 128GB", "Apple", "Refurbished", 45000),
    ("14-256gb.jpg", "iPhone 14 256GB", "Apple", "Refurbished", 50000),
    ("14-plus-128gb.jpg", "iPhone 14 Plus 128GB", "Apple", "Refurbished", 49000),
    ("14-pro-128gb.jpg", "iPhone 14 Pro 128GB", "Apple", "Refurbished", 63000),
    ("14-pro-256gb.jpg", "iPhone 14 Pro 256GB", "Apple", "Refurbished", 68000),
    ("14-pro-max-256gb.jpg", "iPhone 14 Pro Max 256GB", "Apple", "Refurbished", 76000),
    ("14-pro-max-512gb.jpg", "iPhone 14 Pro Max 512GB", "Apple", "Refurbished", 77000),
    ("14-pro-max-1tb.jpg", "iPhone 14 Pro Max 1TB", "Apple", "Refurbished", 79000),
    ("15-128gb.jpg", "iPhone 15 128GB", "Apple", "Refurbished", 65000),
    ("15-plus-128gb.jpg", "iPhone 15 Plus 128GB", "Apple", "Refurbished", 67000),
    ("15-pro-max-256gb.jpg", "iPhone 15 Pro Max 256GB", "Apple", "Refurbished", 90000),
    ("15-pro-max-512gb.jpg", "iPhone 15 Pro Max 512GB", "Apple", "Refurbished", 95000),
    ("16-pro-max-256gb.jpg", "iPhone 16 Pro Max 256GB", "Apple", "Brand New", 113000),
    ("16-pro-max-512gb.jpg", "iPhone 16 Pro Max 512GB", "Apple", "Brand New", 122000),
    # Tablets & Laptops
    ("ipad-pro-11.svg", "iPad Pro 11\"", "Apple", "Brand New", 125000),
    ("ipad-pro-129.svg", "iPad Pro 12.9\"", "Apple", "Brand New", 155000),
    ("macbook-pro-16.svg", "MacBook Pro 16\"", "Apple", "Brand New", 385000),
    ("macbook-air-m3-13.svg", "MacBook Air M3 13\"", "Apple", "Brand New", 165000),
]

W, H = 400, 500

def get_font(size):
    """Try to load a nice font, fall back to default."""
    font_paths = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
        "/usr/share/fonts/truetype/freefont/FreeSansBold.ttf",
    ]
    for fp in font_paths:
        if os.path.exists(fp):
            try:
                return ImageFont.truetype(fp, size)
            except:
                pass
    return ImageFont.load_default()

def draw_phone_silhouette(draw, x, y, w, h, color):
    """Draw a phone silhouette."""
    # Phone body
    r = 20
    draw.rounded_rectangle([x, y, x+w, y+h], radius=r, fill=color)
    # Screen
    margin = 8
    screen_color = "#1a1a2e"
    draw.rounded_rectangle([x+margin, y+margin, x+w-margin, y+h-margin], radius=r-4, fill=screen_color)
    # Notch / Dynamic Island
    nw = 60
    nh = 12
    draw.rounded_rectangle([x + (w-nw)//2, y+margin, x + (w+nw)//2, y+margin+nh], radius=6, fill="#000000")
    # Camera bump on back (visible as a small circle on top)
    draw.ellipse([x + w//2 - 15, y + 40, x + w//2 + 15, y + 70], fill="#333333", outline="#555555")
    draw.ellipse([x + w//2 - 8, y + 47, x + w//2 + 8, y + 63], fill="#1a1a2e", outline="#444444")

def draw_tablet_silhouette(draw, x, y, w, h, color):
    """Draw a tablet silhouette."""
    r = 16
    draw.rounded_rectangle([x, y, x+w, y+h], radius=r, fill=color)
    margin = 10
    draw.rounded_rectangle([x+margin, y+margin+15, x+w-margin, y+h-margin], radius=r-4, fill="#1a1a2e")
    # Camera
    draw.ellipse([x + 20, y + 20, x + 36, y + 36], fill="#333333", outline="#555555")

def draw_laptop_silhouette(draw, x, y, w, h, color):
    """Draw a laptop silhouette."""
    # Screen
    draw.rounded_rectangle([x, y, x+w, y+h*0.6], radius=8, fill=color)
    margin = 6
    draw.rounded_rectangle([x+margin, y+margin+10, x+w-margin, y+h*0.6-margin], radius=4, fill="#1a1a2e")
    # Base
    base_y = int(y + h*0.6)
    draw.rounded_rectangle([x-10, base_y, x+w+10, base_y+12], radius=4, fill="#c0c0c0")
    # Notch
    draw.ellipse([x + w//2 - 5, y + 12, x + w//2 + 5, y + 22], fill="#333333")

def generate_image(filename, name, brand, condition, price):
    """Generate a product image."""
    is_svg = filename.endswith('.svg')
    
    colors = BRAND_COLORS.get(brand, {"bg": "#333333", "accent": "#ffffff", "text": "#ffffff"})
    
    img = Image.new("RGB", (W, H), colors["bg"])
    draw = ImageDraw.Draw(img)
    
    # Gradient background effect
    for i in range(H):
        alpha = i / H
        r = int(int(colors["bg"][1:3], 16) * (1 - alpha * 0.3))
        g = int(int(colors["bg"][3:5], 16) * (1 - alpha * 0.3))
        b = int(int(colors["bg"][5:7], 16) * (1 - alpha * 0.3))
        draw.line([(0, i), (W, i)], fill=(r, g, b))
    
    # Decorative circles
    bg_r = int(colors["bg"][1:3], 16) // 2
    bg_g = int(colors["bg"][3:5], 16) // 2
    bg_b = int(colors["bg"][5:7], 16) // 2
    draw.ellipse([W-120, -60, W+60, 180], fill=(bg_r, bg_g, bg_b))
    draw.ellipse([-80, H-150, 100, H+50], fill=(bg_r//2, bg_g//2, bg_b//2))
    
    # Determine device type and draw silhouette
    name_lower = name.lower()
    if "tab" in name_lower or "ipad" in name_lower:
        draw_tablet_silhouette(draw, W//2-80, 60, 160, 220, "#e0e0e0")
    elif "macbook" in name_lower or "laptop" in name_lower:
        draw_laptop_silhouette(draw, W//2-100, 60, 200, 150, "#c0c0c0")
    else:
        draw_phone_silhouette(draw, W//2-65, 50, 130, 260, "#e8e8e8")
    
    # Brand name
    brand_font = get_font(16)
    draw.text((W//2, 330), brand.upper(), fill=colors["accent"], font=brand_font, anchor="mm")
    
    # Product name
    name_font = get_font(20)
    # Wrap name if too long
    words = name.split()
    lines = []
    current_line = ""
    for word in words:
        test = current_line + " " + word if current_line else word
        bbox = draw.textbbox((0, 0), test, font=name_font)
        if bbox[2] - bbox[0] < W - 40:
            current_line = test
        else:
            if current_line:
                lines.append(current_line)
            current_line = word
    if current_line:
        lines.append(current_line)
    
    y_offset = 355
    for line in lines:
        draw.text((W//2, y_offset), line, fill=colors["text"], font=name_font, anchor="mm")
        y_offset += 26
    
    # Condition badge
    if condition == "Brand New":
        badge_color = "#22c55e"
        badge_text = "✓ BRAND NEW"
    elif condition == "Refurbished":
        badge_color = "#f59e0b"
        badge_text = "↻ REFURBISHED"
    else:
        badge_color = "#6b7280"
        badge_text = condition.upper()
    
    badge_font = get_font(12)
    badge_w = 140
    badge_h = 26
    badge_x = W//2 - badge_w//2
    badge_y = y_offset + 10
    draw.rounded_rectangle([badge_x, badge_y, badge_x+badge_w, badge_y+badge_h], radius=13, fill=badge_color)
    draw.text((W//2, badge_y + badge_h//2), badge_text, fill="#ffffff", font=badge_font, anchor="mm")
    
    # Price
    price_font = get_font(22)
    price_text = f"KSh {price:,}"
    draw.text((W//2, badge_y + badge_h + 25), price_text, fill="#fbbf24", font=price_font, anchor="mm")
    
    # Bottom bar
    draw.rectangle([0, H-40, W, H], fill="#000000")
    small_font = get_font(11)
    draw.text((W//2, H-20), "Alphamobitech • Nairobi, Kenya", fill="#888888", font=small_font, anchor="mm")
    
    # Save
    filepath = os.path.join(OUTPUT_DIR, filename)
    if is_svg:
        # For SVG products, save as PNG with SVG extension (browser will handle fallback)
        filepath = filepath.replace('.svg', '.jpg')
    
    img.save(filepath, "JPEG", quality=90)
    return filepath

print(f"Generating {len(PRODUCTS)} product images...")
count = 0
for filename, name, brand, condition, price in PRODUCTS:
    try:
        path = generate_image(filename, name, brand, condition, price)
        count += 1
        if count % 10 == 0:
            print(f"  Generated {count}/{len(PRODUCTS)}...")
    except Exception as e:
        print(f"  ERROR generating {filename}: {e}")

print(f"\nDone! Generated {count} images in {OUTPUT_DIR}")
