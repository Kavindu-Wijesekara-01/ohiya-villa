import os
import glob
from PIL import Image

def optimize_all():
    base_dir = os.path.join("public", "images", "attractions")
    image_paths = glob.glob(os.path.join(base_dir, "*", "*.jpg")) + glob.glob(os.path.join(base_dir, "*", "*.png"))
    print(f"Found {len(image_paths)} images to process...")

    for path in image_paths:
        try:
            size_mb = os.path.getsize(path) / (1024 * 1024)
            with Image.open(path) as img:
                img = img.convert("RGB")
                orig_w, orig_h = img.size

                # Resize if wider than 1600 or taller than 1200
                max_w, max_h = 1600, 1200
                if orig_w > max_w or orig_h > max_h:
                    img.thumbnail((max_w, max_h), Image.Resampling.LANCZOS)
                
                # Save optimized jpeg
                target_path = os.path.splitext(path)[0] + ".jpg"
                img.save(target_path, "JPEG", quality=84, optimize=True, progressive=True)
                new_size_kb = os.path.getsize(target_path) / 1024
                print(f"Optimized {os.path.basename(path)}: {size_mb:.2f}MB -> {new_size_kb:.1f}KB ({img.size[0]}x{img.size[1]})")
        except Exception as e:
            print(f"Failed {path}: {e}")

if __name__ == "__main__":
    optimize_all()
