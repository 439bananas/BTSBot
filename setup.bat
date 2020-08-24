@echo off
echo Starting setup of BTS Bot...
echo You will be required to enter configuration settings in the form of JSON. If you do not do this, BTS Bot will throw errors or crash!
pause 
git clone https://github.com/439bananas/BTSBot
cd BTSBot
git switch alpha
echo Installing dependencies, this could take a while...
start installcolors.bat
start installdiscord.bat
pause
echo You are now required to provide the settings outlined in the README file.
pause
notepad conf.json
echo You are not obliged to, but if you wish, you may enter role aliases and provide them each with an ID. If you do not wish to provide roles, please enter {} in roles.json and save and close the file.
pause
notepad roles.json
echo Setup complete! You must now edit BTS Bot to comply with your server.