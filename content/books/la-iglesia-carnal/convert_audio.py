import re

with open("manuscrito.md", "r", encoding="utf-8") as f:
    lines = f.readlines()

output = []

for line in lines:
    stripped = line.strip()

    if stripped == "":
        output.append("\n")
        continue

    # keep markdown headings
    if stripped.startswith("#"):
        output.append(line)
        continue

    # dialogue detection
    if stripped.startswith("—") or stripped.startswith("-"):
        cleaned = stripped.lstrip("—- ").strip()
        output.append("PERSONAJE:\n")
        output.append(cleaned + "\n")
    else:
        output.append("NARRADOR:\n")
        output.append(stripped + "\n")

with open("manuscrito_audio.md", "w", encoding="utf-8") as f:
    f.writelines(output)

print("✓ Recording script created: manuscrito_audio.md")