path = r"C:\Users\mehdi\Desktop\02_PROJECTS\01_ACTIVE\DALC_OFFICIAL\src\features\nightlife\pages\NightClubs.tsx"

with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Find specific problematic pattern: LDQUOTE used where a plain dash or comma should be in string values
# Pattern: LDQUOTE (\u201c) followed by space and text -- these are "fake commas/dashes"
# Pattern: RDQUOTE (\u201d) followed by space

# Show all L/R curly-quote WITH surrounding context (skip the long bar that fires false positives)
import re

# Skip long runs of U+2500 (box-drawing) by looking only where char count between LQ and RQ is small
left_q = "\u201c"
right_q = "\u201d"

entries = []
pos = 0
while True:
    lpos = content.find(left_q, pos)
    if lpos == -1:
        break
    rpos = content.find(right_q, lpos + 1)
    if rpos == -1:
        break
    between = content[lpos + 1 : rpos]
    # Only show if it's not the drawing bar (which has 100+ same chars)
    if len(set(between.replace("\n", ""))) > 1 or len(between) < 10:
        ctx_before = content[max(0, lpos - 60) : lpos].replace("\n", " ")
        ctx_after = content[rpos : rpos + 60].replace("\n", " ")
        entries.append(
            f"  LQ@{lpos}: ...{ctx_before}[LQ]{between}[RQ]...{ctx_after}..."
        )
    pos = rpos + 1

print("Real typographic quote occurrences:")
for e in entries[:60]:
    print(e)
