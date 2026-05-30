import re, sys

path = r"C:\Users\mehdi\Desktop\02_PROJECTS\01_ACTIVE\DALC_OFFICIAL\src\features\nightlife\pages\NightClubs.tsx"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

RQ = "\u201d"
BULLET = "\u2022"

# Pattern: any visible char (not space, RQ, or newline) immediately followed by RQ → char + BULLET
c = re.sub(r"([^\s\n\u201d])" + re.escape(RQ), r"\1" + BULLET, c)

# Double-check: lone BULLET + space + BULLET → single BULLET + space
c = re.sub(BULLET + r"\s*" + BULLET, BULLET, c)

lq_left = c.count("\u201c")
rq_left = c.count(RQ)
print(f"LQ remaining: {lq_left}, RQ remaining: {rq_left}")

if rq_left > 0:
    for i, m in enumerate(re.finditer(re.escape(RQ), c)):
        ctx = c[max(0, m.start() - 50) : m.end() + 50].replace("\n", " ")
        if i < 20:
            print(f"  RQ@{m.start()}: ...{ctx}...")

with open(path, "w", encoding="utf-8") as f:
    f.write(c)
print("Done" if rq_left == 0 else "RQ still remaining — see above")
