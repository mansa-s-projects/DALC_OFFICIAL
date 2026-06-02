path = r"C:\Users\mehdi\Desktop\02_PROJECTS\01_ACTIVE\DALC_OFFICIAL\src\features\nightlife\pages\NightClubs.tsx"

with open(path, "rb") as f:
    raw = f.read()

# Find all U+201D (RIGHT DQ) positions, show byte patterns before/after
RDQ = bytes([0xE2, 0x80, 0x9D])  # U+201D

positions = []
start = 0
while True:
    pos = raw.find(RDQ, start)
    if pos == -1:
        break
    positions.append(pos)
    start = pos + 1

print(f"Total U+201D: {len(positions)}")

# Show first 15 occurrences with surrounding bytes
for i, pos in enumerate(positions[:15]):
    before = raw[max(0, pos - 20) : pos]
    after = raw[pos + 3 : pos + 10]
    print(f"\n  Occurrence {i + 1} at byte offset {pos}:")
    print(
        f"    Before bytes: {before.hex()} => decoded: {before.decode('utf-8', errors='replace')}"
    )
    print(
        f"    After  bytes: {after.hex()} => decoded: {after.decode('utf-8', errors='replace')}"
    )

# Count occurrences by what comes RIGHT AFTER the 3-byte sequence
after_counts = {}
for pos in positions:
    next_byte = raw[pos + 3 : pos + 4].hex()
    after_counts[next_byte] = after_counts.get(next_byte, 0) + 1

print("\nBytes right after U+201D:")
for b, cnt in sorted(after_counts.items(), key=lambda x: -x[1])[:10]:
    print(f"  0x{b}: {cnt} times")
