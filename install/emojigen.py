#############################################################
#                                                           #
#                          BTS Bot                          #
#                                                           #
#                    File: emojigen.py                      #
#                                                           #
#                Author: Thomas (439bananas)                #
#                                                           #
#  Copyright 439bananas 2022 under the Apache 2.0 license.  #
#                                                           #
#############################################################

def get_filename_from_url(url): # Get the file name so we can name them
  return url.split('/')[-1]

import os
import requests
import re
import fileinput

text = requests.get('https://raw.githubusercontent.com/SebastianAigner/twemoji-amazing/master/twemoji-amazing.css').text
with open('../src/server/views/resources/css/twemoji-amazing.css', 'w') as f: # Get and write the file
  f.write(text)

os.system('node strip-comments.js') # Comments make generation crash? Oops

print('Generating emojis, this could take a while...')

os.mkdir('../src/server/views/resources/emojis') # Create dir
with open('../src/server/views/resources/css/twemoji-amazing.css') as css: # Look through CSS for links
  text = css.read()
urls = re.findall(r'https?://[^"]+', text, re.I) # Find URLs then add to list
urls = list(set(urls))

filecount = int(0) # Purely statistical
for item in urls: # For each URL, get and save them
  text = requests.get(item).text
  with open('../src/server/views/resources/emojis/' + get_filename_from_url(item), 'w') as svg:
    svg.write(text)
    print('Downloaded ' + get_filename_from_url(item))
    filecount = filecount + 1

print('Downloaded all', filecount, 'files!')

print('Attempting to modify CSS file...') # Replace all references with local
css = open('../src/server/views/resources/css/twemoji-amazing.css', 'rt') # Read and replace in the program itself
data = css.read()
data = data.replace('https://twemoji.maxcdn.com/v/latest/svg', '/resources/emojis')
css.close()
css = open('../src/server/views/resources/css/twemoji-amazing.css', 'wt') # Write the changes
css.write(data)
css.close()
print('All', filecount, 'instances of "https://twemoji.maxcdn.com/v/latest/svg" have been replaced with "/resources/emojis".')

print('Attempting to modify resources.js file...') # Add API endpoints here
js = open('resources-original.js', 'rt')
data = js.read()
data = data.replace('module.exports = router;', '') # Remove so that BTS Bot doesn't crash
for item in urls:
  data = data + "router.get('/emojis/" + get_filename_from_url(item) + "', (req, res) => {\n    res.sendFile(path.resolve('../src/server/views/resources/emojis/" + get_filename_from_url(item) + "'));\n});\n\n" # Replace
data = data + "module.exports = router;" # Add back to end so BTS Bot doesn't crash
js.close()
js = open('../src/server/resources.js', 'wt')
js.write(data) # Write
js.close()

print("Emoji generation complete!")