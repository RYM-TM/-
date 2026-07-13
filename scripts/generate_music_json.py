#!/usr/bin/env python3
import os
import json

MUSIC_DIR = "assets/music"
OUTPUT_FILE = "data/music.json"

AUDIO_EXT = (".mp3", ".m4a", ".ogg", ".wav", ".flac", ".aac")
IMAGE_EXT = (".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp")

def load_existing_covers():
    """读取已有 music.json 中的封面映射，用于保留未找到新封面时的旧封面"""
    if not os.path.exists(OUTPUT_FILE):
        return {}
    try:
        with open(OUTPUT_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
        return {s["title"]: s.get("cover", "") for s in data.get("songs", []) if s.get("cover")}
    except (json.JSONDecodeError, KeyError):
        return {}

def main():
    if not os.path.isdir(MUSIC_DIR):
        print(f"目录不存在: {MUSIC_DIR}")
        return

    existing_covers = load_existing_covers()

    files = os.listdir(MUSIC_DIR)

    audio_files = [f for f in files if f.lower().endswith(AUDIO_EXT)]
    image_files = [f for f in files if f.lower().endswith(IMAGE_EXT)]

    cover_map = {}
    for img in image_files:
        name_no_ext = os.path.splitext(img)[0]
        if name_no_ext.endswith("-封面"):
            song_name = name_no_ext[:-3]
            cover_map[song_name] = os.path.join(MUSIC_DIR, img).replace("\\", "/")

    songs = []
    for idx, audio in enumerate(sorted(audio_files), start=1):
        name_no_ext = os.path.splitext(audio)[0]

        if "-" in name_no_ext:
            parts = name_no_ext.rsplit("-", 1)
            title = parts[0].strip()
            artist = parts[1].strip()
        else:
            title = name_no_ext
            artist = "未知"

        cover = cover_map.get(title) or existing_covers.get(title, "")

        songs.append({
            "id": idx,
            "title": title,
            "artist": artist,
            "cover": cover,
            "src": os.path.join(MUSIC_DIR, audio).replace("\\", "/"),
            "duration": ""
        })

    result = {"songs": songs}

    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    print(f"已生成 {OUTPUT_FILE}，共 {len(songs)} 首歌曲")
    for s in songs:
        print(f"  {s['id']}. {s['title']} - {s['artist']}")

if __name__ == "__main__":
    main()
