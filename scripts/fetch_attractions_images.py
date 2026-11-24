import urllib.request
import urllib.parse
import json
import os
import time

ATTRACTIONS = [
    {
        "slug": "ohiya-railway-station",
        "name": "Ohiya Railway Station",
        "search_queries": [
            "Ohiya Railway Station",
            "Ohiya railway",
            "Ohiya Sri Lanka",
        ]
    },
    {
        "slug": "horton-plains",
        "name": "Horton Plains National Park",
        "search_queries": [
            "World's End Horton Plains",
            "Horton Plains Baker's Falls",
            "Horton Plains National Park Sri Lanka",
            "Horton Plains deer",
        ]
    },
    {
        "slug": "pattipola-railway-station",
        "name": "Pattipola Railway Station",
        "search_queries": [
            "Pattipola Railway Station",
            "Pattipola station Sri Lanka",
            "Pattipola tunnel",
        ]
    },
    {
        "slug": "ambewela-railway-station",
        "name": "Ambewela Railway Station",
        "search_queries": [
            "Ambewela Railway Station",
            "Ambewela railway Sri Lanka",
            "Ambewela train",
        ]
    },
    {
        "slug": "ambewela-farms",
        "name": "Ambewela Farm",
        "search_queries": [
            "Ambewela Farm Sri Lanka",
            "Ambewela cattle",
            "Ambewela pasture",
        ]
    },
    {
        "slug": "hakgala-botanical-garden",
        "name": "Hakgala Botanical Garden",
        "search_queries": [
            "Hakgala Botanical Garden",
            "Hakgala Garden Sri Lanka",
            "Hakgala rock",
        ]
    },
    {
        "slug": "bambarakanda-falls",
        "name": "Bambarakanda Falls",
        "search_queries": [
            "Bambarakanda Falls",
            "Bambarakanda waterfall Sri Lanka",
            "Bambarakanda",
        ]
    },
    {
        "slug": "gregory-lake",
        "name": "Gregory Lake Nuwara Eliya",
        "search_queries": [
            "Gregory Lake Nuwara Eliya",
            "Lake Gregory Sri Lanka",
            "Gregory Lake boats",
        ]
    },
    {
        "slug": "castlereigh-reservoir",
        "name": "Castlereigh Reservoir",
        "search_queries": [
            "Castlereigh Reservoir Sri Lanka",
            "Castlereigh Dam",
            "Castlereigh Hatton",
        ]
    },
    {
        "slug": "devils-staircase",
        "name": "Devil's Staircase Ohiya",
        "search_queries": [
            "Devils Staircase Sri Lanka",
            "Devil's Staircase Ohiya",
            "Ohiya Kalupahana",
        ]
    }
]

headers = {
    "User-Agent": "OhiyaVillaTourismApp/1.0 (contact: info@ohiyavilla.lk)"
}

def search_commons(query, limit=10):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(query)}&gsrnamespace=6&prop=imageinfo&iiprop=url|size|mime&format=json&gsrlimit={limit}"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode("utf-8"))
            pages = data.get("query", {}).get("pages", {})
            results = []
            for page_id, page in pages.items():
                title = page.get("title", "")
                imageinfo = page.get("imageinfo", [{}])[0]
                img_url = imageinfo.get("url", "")
                mime = imageinfo.get("mime", "")
                width = imageinfo.get("width", 0)
                height = imageinfo.get("height", 0)
                if img_url and ("image/jpeg" in mime or "image/png" in mime or "image/webp" in mime) and width >= 600 and not title.endswith('.svg'):
                    results.append({
                        "title": title,
                        "url": img_url,
                        "width": width,
                        "height": height
                    })
            return results
    except Exception as e:
        print(f"Error querying {query}: {e}")
        return []

def download_file(url, target_path):
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            content = resp.read()
            if len(content) > 10000: # ensure valid file
                with open(target_path, "wb") as f:
                    f.write(content)
                return True
    except Exception as e:
        print(f"Failed to download {url}: {e}")
    return False

def main():
    base_dir = os.path.join("public", "images", "attractions")
    os.makedirs(base_dir, exist_ok=True)
    manifest = {}

    for att in ATTRACTIONS:
        slug = att["slug"]
        att_dir = os.path.join(base_dir, slug)
        os.makedirs(att_dir, exist_ok=True)
        print(f"\nProcessing {att['name']} ({slug})...")

        found_images = []
        seen_urls = set()

        for q in att["search_queries"]:
            res = search_commons(q, limit=8)
            for item in res:
                if item["url"] not in seen_urls:
                    seen_urls.add(item["url"])
                    found_images.append(item)
            time.sleep(0.3)

        print(f"Found {len(found_images)} candidates for {slug}")
        downloaded = []
        idx = 1
        for img in found_images:
            if len(downloaded) >= 4:
                break
            ext = ".jpg" if "png" not in img["url"].lower() else ".png"
            filename = f"{slug}-{idx}{ext}"
            filepath = os.path.join(att_dir, filename)
            
            # Check if file exists and has size
            if os.path.exists(filepath) and os.path.getsize(filepath) > 10000:
                downloaded.append({
                    "path": f"/images/attractions/{slug}/{filename}",
                    "title": img["title"].replace("File:", "").replace(".jpg", "").replace(".JPG", "").replace("_", " ")
                })
                idx += 1
                continue

            print(f"Downloading {img['title']} -> {filename} ({img['width']}x{img['height']})...")
            if download_file(img["url"], filepath):
                downloaded.append({
                    "path": f"/images/attractions/{slug}/{filename}",
                    "title": img["title"].replace("File:", "").replace(".jpg", "").replace(".JPG", "").replace("_", " ")
                })
                idx += 1
            time.sleep(0.3)

        manifest[slug] = downloaded

    manifest_path = os.path.join(base_dir, "manifest.json")
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)
    print(f"\nAll done! Manifest written to {manifest_path}")

if __name__ == "__main__":
    main()
