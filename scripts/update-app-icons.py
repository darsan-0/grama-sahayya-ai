import os
import base64
from PIL import Image, ImageDraw

def generate_all_assets():
    src_path = r"C:\Users\Darsan\.gemini\antigravity-ide\brain\a68e83c0-f3ee-435d-8c3c-340e793e4ab9\.user_uploaded\media_1792491791083.jpg"
    workspace_root = r"d:\Darsan_projects\CSP\New folder"
    public_dir = os.path.join(workspace_root, "public")
    dist_dir = os.path.join(workspace_root, "dist")
    android_res_dir = os.path.join(workspace_root, "android", "app", "src", "main", "res")
    android_dir = os.path.join(workspace_root, "android")

    os.makedirs(public_dir, exist_ok=True)
    if os.path.exists(dist_dir):
        os.makedirs(dist_dir, exist_ok=True)

    # Open source image
    src_img = Image.open(src_path).convert("RGBA")
    w, h = src_img.size # 1024, 1024

    # 1. Create squircle masked version with transparent corners (RGBA)
    # The squircle card in source image is approximately:
    # left=84, top=74, right=940, bottom=946 with corner radius 195.
    scale = 4
    mask = Image.new("L", (w * scale, h * scale), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle(
        [int(84 * scale), int(74 * scale), int(940 * scale), int(946 * scale)],
        radius=int(195 * scale),
        fill=255
    )
    mask_smooth = mask.resize((w, h), Image.Resampling.LANCZOS)

    squircle_icon = src_img.copy()
    squircle_icon.putalpha(mask_smooth)

    # 2. Also create a crop of the card itself, centered
    # Card is 856 x 872
    card_crop = squircle_icon.crop((84, 74, 940, 946))
    # Make a square version of the card
    max_side = max(card_crop.size)
    card_square = Image.new("RGBA", (max_side, max_side), (0, 0, 0, 0))
    offset_x = (max_side - card_crop.width) // 2
    offset_y = (max_side - card_crop.height) // 2
    card_square.paste(card_crop, (offset_x, offset_y))

    # Standard clean logo (512x512)
    logo_512 = card_square.resize((512, 512), Image.Resampling.LANCZOS)
    logo_512.save(os.path.join(public_dir, "logo.png"), "PNG")
    if os.path.exists(dist_dir):
        logo_512.save(os.path.join(dist_dir, "logo.png"), "PNG")
    print("Saved logo.png (512x512)")

    # PWA Standard Icons (with comfortable padding for launcher bounds)
    pwa_512 = logo_512.copy()
    pwa_512.save(os.path.join(public_dir, "pwa-512x512.png"), "PNG")
    if os.path.exists(dist_dir):
        pwa_512.save(os.path.join(dist_dir, "pwa-512x512.png"), "PNG")

    pwa_192 = logo_512.resize((192, 192), Image.Resampling.LANCZOS)
    pwa_192.save(os.path.join(public_dir, "pwa-192x192.png"), "PNG")
    if os.path.exists(dist_dir):
        pwa_192.save(os.path.join(dist_dir, "pwa-192x192.png"), "PNG")

    # Apple Touch Icon (180x180)
    apple_touch = logo_512.resize((180, 180), Image.Resampling.LANCZOS)
    apple_touch.save(os.path.join(public_dir, "apple-touch-icon.png"), "PNG")
    if os.path.exists(dist_dir):
        apple_touch.save(os.path.join(dist_dir, "apple-touch-icon.png"), "PNG")

    # Maskable Icon (512x512)
    # Android maskable spec: Solid background, graphic centered within safe circle (diameter ~ 400px = 80%)
    maskable_512 = Image.new("RGBA", (512, 512), (255, 255, 255, 255))
    # Resize card_square to 410x410 so entire logo is within safe zone
    safe_graphic = card_square.resize((410, 410), Image.Resampling.LANCZOS)
    maskable_512.paste(safe_graphic, ((512 - 410) // 2, (512 - 410) // 2), safe_graphic)
    maskable_512.save(os.path.join(public_dir, "pwa-maskable-512x512.png"), "PNG")
    if os.path.exists(dist_dir):
        maskable_512.save(os.path.join(dist_dir, "pwa-maskable-512x512.png"), "PNG")

    # Favicon ICO (Multi-resolution: 16, 32, 48, 64)
    ico_sizes = [(16, 16), (32, 32), (48, 48), (64, 64)]
    ico_images = [logo_512.resize(s, Image.Resampling.LANCZOS) for s in ico_sizes]
    ico_images[0].save(
        os.path.join(public_dir, "favicon.ico"),
        format="ICO",
        sizes=ico_sizes,
        append_images=ico_images[1:]
    )
    if os.path.exists(dist_dir):
        ico_images[0].save(
            os.path.join(dist_dir, "favicon.ico"),
            format="ICO",
            sizes=ico_sizes,
            append_images=ico_images[1:]
        )
    print("Saved favicon.ico")

    # SVG Icon embedding high-res PNG for vector icon tags
    with open(os.path.join(public_dir, "pwa-512x512.png"), "rb") as f:
        b64_png = base64.b64encode(f.read()).decode("utf-8")
    svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <image href="data:image/png;base64,{b64_png}" width="512" height="512" />
</svg>'''
    with open(os.path.join(public_dir, "icon.svg"), "w", encoding="utf-8") as f:
        f.write(svg_content)
    if os.path.exists(dist_dir):
        with open(os.path.join(dist_dir, "icon.svg"), "w", encoding="utf-8") as f:
            f.write(svg_content)
    print("Saved icon.svg")

    # Android Store Icon (512x512)
    if os.path.exists(android_dir):
        logo_512.save(os.path.join(android_dir, "store_icon.png"), "PNG")
        print("Saved android/store_icon.png")

    # Android Mipmap ic_launcher.png
    launcher_sizes = {
        "mipmap-mdpi": (48, 48),
        "mipmap-hdpi": (72, 72),
        "mipmap-xhdpi": (96, 96),
        "mipmap-xxhdpi": (144, 144),
        "mipmap-xxxhdpi": (192, 192),
    }
    for folder, size in launcher_sizes.items():
        dest_folder = os.path.join(android_res_dir, folder)
        if os.path.exists(dest_folder):
            res_icon = logo_512.resize(size, Image.Resampling.LANCZOS)
            res_icon.save(os.path.join(dest_folder, "ic_launcher.png"), "PNG")
            print(f"Saved {folder}/ic_launcher.png {size}")

    # Android Mipmap ic_maskable.png
    maskable_sizes = {
        "mipmap-mdpi": (82, 82),
        "mipmap-hdpi": (123, 123),
        "mipmap-xhdpi": (164, 164),
        "mipmap-xxhdpi": (246, 246),
        "mipmap-xxxhdpi": (328, 328),
    }
    for folder, size in maskable_sizes.items():
        dest_folder = os.path.join(android_res_dir, folder)
        if os.path.exists(dest_folder):
            # Safe margin maskable icon
            m_img = Image.new("RGBA", size, (255, 255, 255, 255))
            safe_size = int(size[0] * 0.8)
            graphic = card_square.resize((safe_size, safe_size), Image.Resampling.LANCZOS)
            m_img.paste(graphic, ((size[0] - safe_size) // 2, (size[1] - safe_size) // 2), graphic)
            m_img.save(os.path.join(dest_folder, "ic_maskable.png"), "PNG")
            print(f"Saved {folder}/ic_maskable.png {size}")

    # Android Splash Screen drawables
    splash_sizes = {
        "drawable-mdpi": (300, 300),
        "drawable-hdpi": (450, 450),
        "drawable-xhdpi": (600, 600),
        "drawable-xxhdpi": (900, 900),
        "drawable-xxxhdpi": (1200, 1200),
    }
    for folder, size in splash_sizes.items():
        dest_folder = os.path.join(android_res_dir, folder)
        if os.path.exists(dest_folder):
            # Centered logo inside splash
            sp_img = Image.new("RGBA", size, (248, 247, 242, 255)) # App background color #F8F7F2
            # Logo is centered taking ~45% of splash screen
            logo_sz = int(size[0] * 0.45)
            graphic = logo_512.resize((logo_sz, logo_sz), Image.Resampling.LANCZOS)
            sp_img.paste(graphic, ((size[0] - logo_sz) // 2, (size[1] - logo_sz) // 2), graphic)
            sp_img.save(os.path.join(dest_folder, "splash.png"), "PNG")
            print(f"Saved {folder}/splash.png {size}")

    print("All icons successfully generated and saved!")

if __name__ == "__main__":
    generate_all_assets()
