import re, sys

path = r"C:\Users\mehdi\Desktop\02_PROJECTS\01_ACTIVE\DALC_OFFICIAL\src\features\nightlife\pages\NightClubs.tsx"

with open(path, "rb") as f:
    raw = f.read()

print(f"File size: {len(raw)} bytes")
print(f"Decoded ok: {raw.decode('utf-8', errors='replace')[:200]}")

# The garbled characters are 3-byte UTF-8 sequences showing as 'â€"' etc
# The pattern in the terminal output was:  â€"—  and â€" multiple times
# â = U+00E2, € = U+20AC, " = U+2019 or U+0022
# These together form: E2 80 A2 (asterisk-like?) No -

# Let's scan for all multi-byte sequences and report surrounding context
import struct

# Try to find 'â€"' as raw bytes - these read as 'a-circumflex euro-quote'
# In UTF-8 raw:
#   â  = \xc3\xa2 (U+00E2)
#   €  = \xe2\x82\xac (U+20AC) -- wait that's euro sign
# But â€" is actually: \xc3\xa2\xe2\x82\xac\xe2\x80\x9c which is too long

# Actually the simplest approach: scan the raw bytes and look for
# any 3-byte sequences containing 0xE2 (start of U+2000 range)
positions_e2 = [i for i, b in enumerate(raw) if b == 0xE2]
print(f"Positions with 0xE2 byte (start of 3-byte UTF-8): {positions_e2[:20]}")

for pos in positions_e2[:10]:
    chunk = raw[pos : pos + 6]
    try:
        decoded = chunk.decode("utf-8", errors="replace")
        print(f"  pos {pos}: hex={chunk.hex()} => '{decoded}'")
    except:
        print(f"  pos {pos}: hex={chunk.hex()} => (decode error)")
