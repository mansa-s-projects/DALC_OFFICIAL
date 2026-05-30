path = r"C:\Users\mehdi\Desktop\02_PROJECTS\01_ACTIVE\DALC_OFFICIAL\src\features\nightlife\pages\NightClubs.tsx"

with open(path, "r", encoding="utf-8") as f:
    content = f.read()

print(f"Total chars: {len(content)}")
print(f"Contains U+201C (\\u201c): {chr(0x201C) in content}")
print(f"Contains U+201D (\\u201d): {chr(0x201D) in content}")

# Find all occurrences with context
for enc_name, char in [
    ("L DOUBLE QUOTE", chr(0x201C)),
    ("R DOUBLE QUOTE", chr(0x201D)),
]:
    idx = 0
    occ = 0
    while True:
        pos = content.find(char, idx)
        if pos == -1:
            break
        occ += 1
        start = max(0, pos - 30)
        end = min(len(content), pos + 30)
        ctx = content[start:end].replace("\n", "\\n")
        print(f"  {enc_name} occ {occ} at pos {pos}: ...{ctx}...")
        idx = pos + 1
