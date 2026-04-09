import codecs

try:
    with open('maven_output.txt', 'rb') as f:
        text = f.read().decode('utf-16')
    print("Decoded as utf-16")
except UnicodeDecodeError:
    with open('maven_output.txt', 'rb') as f:
        text = f.read().decode('utf-8', errors='ignore')
    print("Decoded as utf-8")

with open('maven_error.txt', 'w', encoding='utf-8') as f:
    f.write(text)
print("Finished writing to maven_error.txt")
