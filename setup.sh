echo Starting setup of BTS Bot...
read -t 5 -p "You will be required to enter configuration settings in the form of JSON. If you do not do this, BTS Bot will throw errors or crash!"
git clone https://github.com/439bananas/BTSBot
cd BTSBot
npm install colors
npm install discord.js
read -t 5 -p "You are now required to provide the settings outlined in the README file."
nano conf.json
read -t 5 -p "You are not obliged to, but if you wish, you may enter role aliases and provide them each with an ID."
nano roles.json
read -t 10 -p "Setup complete! You must now edit BTS Bot to comply with your server."