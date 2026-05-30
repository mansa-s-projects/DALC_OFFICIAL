path = r"C:\Users\mehdi\Desktop\02_PROJECTS\01_ACTIVE\DALC_OFFICIAL\src\features\nightlife\pages\NightClubs.tsx"

with open(path, "rb") as f:
    raw = f.read()

# Find all 3-byte UTF-8 sequences starting with 0xE2
# U+201C = LEFT DQ, U+201D = RIGHT DQ, U+2014 = EM DASH, U+2022 = BULLET, U+2018 = L SQ, U+2019 = R SQ
targets = {
    "L_DQ (U+201C)": bytes([0xE2, 0x80, 0x9C]),
    "R_DQ (U+201D)": bytes([0xE2, 0x80, 0x9D]),
    "EM_DASH (U+2014)": bytes([0xE2, 0x80, 0x94]),
    "BULLET (U+2022)": bytes([0xE2, 0x80, 0xA2]),
    "L_SQ (U+2018)": bytes([0xE2, 0x80, 0x98]),
    "R_SQ (U+2019)": bytes([0xE2, 0x80, 0x99]),
}

for name, pattern in targets.items():
    positions = []
    start = 0
    while True:
        pos = raw.find(pattern, start)
        if pos == -1:
            break
        positions.append(pos)
        start = pos + 1
    print(f"{name}: {len(positions)} occurrences at positions: {positions[:15]}")
