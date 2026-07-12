#!/usr/bin/env python3
import os
import json
import re

PHOTOS_DIR = "assets/photos"
OUTPUT_FILE = "data/photos.json"

IMAGE_EXT = (".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp")

def parse_filename(filename):
    name_no_ext = os.path.splitext(filename)[0]
    match = re.match(r"^(.+)-(\d+)$", name_no_ext)
    if match:
        name = match.group(1).strip()
        number = int(match.group(2))
    else:
        name = name_no_ext
        number = 999
    return name, number

def main():
    if not os.path.isdir(PHOTOS_DIR):
        print(f"目录不存在: {PHOTOS_DIR}")
        return

    files = [f for f in os.listdir(PHOTOS_DIR) if f.lower().endswith(IMAGE_EXT)]

    albums_dict = {}
    for f in files:
        name, number = parse_filename(f)
        if name not in albums_dict:
            albums_dict[name] = []
        albums_dict[name].append({
            "filename": f,
            "number": number,
            "name": name
        })

    for name in albums_dict:
        albums_dict[name].sort(key=lambda x: x["number"])

    albums = []
    photo_id = 1
    for idx, (album_name, photos) in enumerate(sorted(albums_dict.items()), start=1):
        album_photos = []
        for p in photos:
            album_photos.append({
                "id": photo_id,
                "src": os.path.join(PHOTOS_DIR, p["filename"]).replace("\\", "/"),
                "title": f"{p['name']} {p['number']:02d}",
                "date": ""
            })
            photo_id += 1

        cover = album_photos[0]["src"] if album_photos else ""

        albums.append({
            "id": idx,
            "name": album_name,
            "cover": cover,
            "photos": album_photos
        })

    result = {"albums": albums}

    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    print(f"已生成 {OUTPUT_FILE}")
    print(f"共 {len(albums)} 个相册，{photo_id - 1} 张照片")
    for album in albums:
        print(f"  [{album['id']}] {album['name']} ({len(album['photos'])}张)")

if __name__ == "__main__":
    main()
