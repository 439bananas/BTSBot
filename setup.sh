echo Starting setup of BTS Bot...
read -t 5 -p "You will be required to enter configuration settings in the form of JSON. If you do not do this, BTS Bot will throw errors or crash!"
git clone https://github.com/439bananas/BTSBot
npm install colors
npm install discord.js
read -t 5 -p "You are now required to provide the following: token, prefix, pstatus, ostatus, logchannelID, OwnerID"
echo Respectively, your bot token, your command prefix, your desired playing status, your desired activity status, the channel you wish to log to, the ID of the person who is considered \"owner\"
nano conf.json
read -t 5 -p "You are not obliged to, but if you wish, you may enter role aliases and provide them each with an ID."
nano roles.json
read -t 10 -p "Setup complete! You must now edit BTS Bot to comply with your server."