#!/usr/bin/env python3
"""Generate the missing iPad and MacBook product images."""
from PIL import Image, ImageDraw, ImageFont
import os

OUTPUT_DIR = "/home/zingri/dev/BACKUPZ_DEV_SERVER/alphamobi/dist/images/phones"
os.makedirs(OUTPUT_DIR, exist_ok=True)

W, H = 400, 500

def get_font(size):
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

def draw_tablet_silhouette(draw, x, y, w, h):
    r = 16
    draw.rounded_rectangle([x, y, x+w, y+h], radius=r, fill="#e0e0e0")
    margin = 10
    draw.rounded_rectangle([x+margin, y+margin+15, x+w-margin, y+h-margin], radius=r-4, fill="#1a1a2e")
    draw.ellipse([x + 20, y + 20, x + 36, y + 36], fill="#333333", outline="#555555")

def draw_laptop_silhouette(draw, x, y, w, h):
    draw.rounded_rectangle([x, y, x+w, y+h*0.6], radius=8, fill="#c0c0c0")
    margin = 6
    draw.rounded_rectangle([x+margin, y+margin+10, x+w-margin, y+h*0.6-margin], radius=4, fill="#1a1a2e")
    base_y = int(y + h*0.6)
    draw.rounded_rectangle([x-10, base_y, x+w+10, base_y+12], radius=4, fill="#a0a0a0")
    draw.ellipse([x + w//2 - 5, y + 12, x + w//2 + 5, y + 22], fill="#333333")

PRODUCTS = [
    ("ipad-pro-11.jpg", "iPad Pro 11\"", "Apple", "Brand New", 125000, "tablet"),
    ("ipad-pro-129.jpg", "iPad Pro 12.9\"", "Apple", "Brand New", 155000, "tablet"),
    ("macbook-pro-16.jpg", "MacBook Pro 16\"", "Apple", "Brand New", 385000, "laptop"),
    ("macbook-air-m3-13.jpg", "MacBook Air M3 13\"", "Apple", "Brand New", 165000, "laptop"),
]

for filename, name, brand, condition, price, device_type in PRODUCTS:
    img = Image.new("RGB", (W, H), "#1d1d1f")
    draw = ImageDraw.Draw(img)
    
    # Gradient background
    for i in range(H):
        alpha = i / H
        r = int(29 * (1 - alpha * 0.3))
        g = int(29 * (1 - alpha * 0.3))
        b = int(31 * (1 - alpha * 0.3))
        draw.line([(0, i), (W, i)], fill=(r, g, b))
    
    # Decorative elements
    draw.ellipse([W-120, -60, W+60, 180], fill=(20, 20, 25))
    draw.ellipse([-80, H-150, 100, H+50], fill=(15, 15, 20))
    
    # Device silhouette
    if device_type == "tablet":
        draw_tablet_silhouette(draw, W//2-80, 60, 160, 220)
    else:
        draw_laptop_silhouette(draw, W//2-100, 60, 200, 150)
    
    # Brand
    brand_font = get_font(16)
    draw.text((W//2, 330), "APPLE", fill="#0071e3", font=brand_font, anchor="mm")
    
    # Name
    name_font = get_font(20)
    draw.text((W//2, 355), name, fill="#f5f5f7", font=name_font, anchor="mm")
    
    # Condition badge
    badge_font = get_font(12)
    badge_w = 140
    badge_h = 26
    badge_x = W//2 - badge_w//2
    badge_y = 385
    draw.rounded_rectangle([badge_x, badge_y, badge_x+badge_w, badge_y+badge_h], radius=13, fill="#22c55e")
    draw.text((W//2, badge_y + badge_h//2), "✓ BRAND NEW", fill="#ffffff", font=badge_font, anchor="mm")
    
    # Price
    price_font = get_font(22)
    draw.text((W//2, badge_y + badge_h + 25), f"KSh {price:,}", fill="#fbbf24", font=price_font, anchor="mm")
    
    # Bottom bar
    draw.rectangle([0, H-40, W, H], fill="#000000")
    small_font = get_font(11)
    draw.text((W//2, H-20), "Alphamobitech • Nairobi, Kenya", fill="#888888", font=small_font, anchor="mm")
    
    filepath = os.path.join(OUTPUT_DIR, filename)
    img.save(filepath, "JPEG", quality=90)
    size = os.path.getsize(filepath)
    print(f"Generated: {filename} ({size} bytes)")

print("Done!")
