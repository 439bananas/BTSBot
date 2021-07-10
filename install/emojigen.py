def get_filename_from_url(url):
  return url.split('/')[-1]

import os
import requests
import re
import fileinput

text = requests.get('https://raw.githubusercontent.com/SebastianAigner/twemoji-amazing/master/twemoji-amazing.css').text
with open('../src/server/pages/resources/twemoji-amazing.css', 'w') as f:
  f.write(text)

os.system('node strip-comments.js')

print('Generating emojis, this could take a while...')

os.mkdir('../src/server/pages/resources/emojis')
with open('../src/server/pages/resources/twemoji-amazing.css') as css:
  text = css.read()
urls = re.findall(r'https?://[^"]+', text, re.I)
urls = list(set(urls))

filecount = int(0)
for item in urls:
  text = requests.get(item).text
  with open('../src/server/pages/resources/emojis/' + get_filename_from_url(item), 'w') as svg:
    svg.write(text)
    print('Downloaded ' + get_filename_from_url(item))
    filecount = filecount + 1

print('Downloaded all', filecount, 'files!')

print('Attempting to modify CSS file...')
css = open('../src/server/pages/resources/twemoji-amazing.css', 'rt')
data = css.read()
data = data.replace('https://twemoji.maxcdn.com/v/latest/svg', '/resources/emojis')
css.close()
css = open('../src/server/pages/resources/twemoji-amazing.css', 'wt')
css.write(data)
css.close()
print('All', filecount, 'instances of "https://twemoji.maxcdn.com/v/latest/svg" have been replaced with "/resources/emojis".')

print('Attempting to modify resources.js file...')
js = open('resources-original.js', 'rt')
data = js.read()
data = data.replace('module.exports = router;', '')
for item in urls:
  data = data + "router.get('/emojis/" + get_filename_from_url(item) + "', (req, res) => {\n    res.sendFile('./pages/resources/emojis/" + get_filename_from_url(item) + "', { root: __dirname });\n});\n\n"
data = data + "module.exports = router;"
js.close()
js = open('../src/server/resources.js', 'wt')
js.write(data)
js.close

print("Emoji generation complete!")