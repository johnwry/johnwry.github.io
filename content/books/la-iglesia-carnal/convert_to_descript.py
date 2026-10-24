import re

input_file = "manuscrito_audio.md"
output_file = "descript_script.md"

with open(input_file, "r", encoding="utf-8") as f:
    text = f.read()

lines = text.split("\n")
output = []

for line in lines:

    if line.startswith("#"):
        output.append("\n" + line)
        output.append("\n[SFX: ambiente de café]\n")
        continue

    if "Adrián" in line:
        output.append("Adrián:\n" + line)
    elif "Elías" in line:
        output.append("Elías:\n" + line)
    elif "Matías" in line:
        output.append("Matías:\n" + line)
    elif "Marcos" in line:
        output.append("Marcos:\n" + line)
    else:
        if line.strip() != "":
            output.append("Narrador:\n" + line)

with open(output_file, "w", encoding="utf-8") as f:
    f.write("\n".join(output))

print("Finished. File written to descript_script.md")