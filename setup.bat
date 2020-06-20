@echo off
echo Starting setup of BTS Bot...
echo You will be required to enter configuration settings in the form of JSON. If you do not do this, BTS Bot will throw errors or crash!
pause 
git clone https://github.com/439bananas/BTSBot
cd BTSBot
echo Installing libraries, this could take a while...
start installcolors.bat
start installdiscord.bat
pause
echo You are now required to provide the following: token, prefix, pstatus, ostatus, logchannelID, OwnerID
echo Respectively, your bot token, your command prefix, your desired playing status, your desired activity status, the channel you wish to log to, the ID of the person who is considered "owner"
pause
notepad conf.json
echo You are not obliged to, but if you wish, you may enter role aliases and provide them each with an ID.
pause
notepad roles.json
echo Setup complete! You must now edit BTS Bot to comply with your server.