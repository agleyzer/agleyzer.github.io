import string
import re
from collections import defaultdict
import json
import sys
import tempfile
import shutil

alphabet = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ"

(input, output) = (sys.argv[1], sys.argv[2])

f = open(input, "r", encoding="utf-8")

bigrams = defaultdict(lambda: defaultdict(lambda: 0))
trigrams = defaultdict(lambda: defaultdict(lambda: 0))
words = defaultdict(lambda: 0)

spec_chars = string.punctuation + '\n\xa0«»\t—…'

def process_word(word, cost):
    words[word] = words[word]+cost
    word = '*' + word
    for i in range(0, len(word)-1):
        (a, b) = (word[i], word[i+1])
        bigrams[a][b] = bigrams[a][b]+cost
    for i in range(0, len(word)-2):
        (a, b) = (word[i:i+2], word[i+2])
        trigrams[a][b] = trigrams[a][b]+cost 

def process_line(text, cost):
    print("processing ", len(text))
    text = text.upper()    
    text = "".join([ch for ch in text if ch not in spec_chars])
    text = re.sub(r'\s+', ' ', text)

    for word in text.split(' '):     
        process_word(word, cost)

buf = ''
for line in f:
    buf += line
    if len(buf) > 1024 * 10:
        process_line(buf, 1)
        buf = ''
process_line(buf, 1)

# high cost words to be pushed up
process_line("я мне оля слава", 9000000)
process_line("хочу спасибо пожалуйста", 5000000)
process_line("спать есть больно туалет гулять телевизор", 1000000)

def to_json(data, keys): 
    output = {}
    for c in keys:
        freq = data[c]
        str = ''.join(sorted(freq.keys(), key=freq.get, reverse=True))
        str = ''.join([x for x in str if x in alphabet]) # only alphabet letters
        rest = ''.join([x for x in alphabet if x not in str])
        output[c] = str + rest
    return output

bi_json = to_json(bigrams, alphabet + '*')
tri_json = to_json(trigrams, trigrams.keys())

with tempfile.NamedTemporaryFile(mode='w+', encoding='utf8') as tmp:
    tmp.write('const bigrams = ')
    json.dump(bi_json, tmp, ensure_ascii=False, indent=2)
    tmp.write(';\n')

    tmp.write('const trigrams = ')
    json.dump(tri_json, tmp, ensure_ascii=False, indent=2)
    tmp.write(';\n\n')

    word_tuples = sorted([(v, k) for k, v in words.items()], reverse=True)

    tmp.write('const words = ')
    json.dump([k for (v, k) in word_tuples[:5000]], tmp, ensure_ascii=False, indent=2)
    tmp.write(';\n\n')

    tmp.write('export { bigrams, trigrams, words };\n')
    tmp.seek(0)

    out = open(output, 'w')
    shutil.copyfileobj(tmp, out)

# print(sorted( ((k, v) for k,v in bigrams.items()), reverse=True))
