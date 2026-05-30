path = r"C:\Users\mehdi\Desktop\02_PROJECTS\01_ACTIVE\DALC_OFFICIAL\src\features\nightlife\pages\NightClubs.tsx"

with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Pattern: LEFT_DQ + space inside JSX text strings serving as replacements for bullet (•)
# In music genre strings specifically: 'House [fake_sep] Hip-Hop [fake_sep] X'
# Where [fake_sep] = LEFT_DQ SPACE or RIGHT_DQ SPACE

LQ = "\u201c"
RQ = "\u201d"
DOT = "\u2022"  # BULLET - what should be used

count = 0

# Fix LQ used as bullet separator: " Genre " → " • Genre "
# Pattern: LQ followed by space (inside single-quoted JavaScript strings)
# These appear in music: 'House " Hip-Hop "...' strings
content_new = content
while LQ + " " in content_new:
    content_new = content_new.replace(LQ + " ", DOT + " ")
    count += 1

while " " + RQ + " " in content_new:
    content_new = content_new.replace(" " + RQ + " ", " " + DOT + " ")
    count += 1
while " " + RQ + " " in content_new:
    # repeat to catch remaining
    content_new = content_new.replace(" " + RQ + " ", " " + DOT + " ")
    count += 1

print(f"Replacements made: {count}")
print(f"LQ remaining: {content_new.count(LQ)}")
print(f"RQ remaining: {content_new.count(RQ)}")

if content_new != content:
    with open(path, "w", encoding="utf-8") as f:
        f.write(content_new)
    print("File updated successfully!")
else:
    print("No changes made.")
