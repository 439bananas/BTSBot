# BTS Bot
The bot that runs the core features in Bot Testing Server, simply open source.
## What is this?
This is BTS Bot. If you are familiar with [Bot Testing Server](https://discord.gg/ahyzfEv), it allows for features such as customisable self-assignable roles, modmail, a report command and more.
## Can I contribute?
Possibly, however BTS Bot was intended to provide core features and not features such as random dad jokes that can benefit multiple servers. However, the best way is just to wing it with pull requests. The word that will happen is that I will just say "no". You won't be banned from seeing the repository or the server itself.
## You said "multiple servers", can I add this bot to my server instead of cloning this repository?
Nope! It's easier for us all if you clone, edit and host it for yourself.
## Should I host this myself?
You can! However, this is suited to Bot Testing Server, so you will have to adapt a lot of it. For anyone who wants a quick, dirty and simple setup without screwing around with code, cloning this bot is probably not for you.
## If it's so hard to host it, what's the point, even, in putting it on here?
The original reason I put BTS Bot on here was actually just for people who were curious as to how it worked. 
## Okay, I'm up for this battle. Show me how I can download and run this bot so I can change it for myself.
This guide (of course) showcases Bot Testing Server. However, with a few changes, it can still be in your server. Please do note, however, that due to the quantity of IDs, this is a fatiguing bot to configure.

Prerequisites:
* Node.js
* Git (if on Windows, just ensure that it's on your path so you can properly clone it)

### Installation
* Run the respective command for your operating system:\
Windows: `powershell iwr -outf setup.bat https://439bananas.com/projects/btsbot/setup.bat && setup.bat`\
Linux/Unix/MacOS: `wget https://439bananas.com/projects/btsbot/setup.sh && bash setup.sh`
* Create a conf.json:\
`{`\
    `"token" : "token goes here",`\
    `"appeallink" : "appeal link to become unbanned goes here",`\
    `"prefix" : ",",`\
    `"pstatus" : "DM me to privately speak to a moderator | Run ,help to see all available commands",`\
    `"ostatus" : "dnd",`\
    `"logchannelID" : "logging channel id goes here",`\
    `"OwnerID" : "owner id goes here",`\
    `"btsid" : "server 1 id goes here",`\
    `"btst3id" : "server 2 id goes here",`\
    `"btsbotsroleid" : "server 1 bots role id goes here",`\
    `"btst3botsroleid" : "server 2 bots role id goes here",`\
    `"modmailid" : "modmail channel id goes here id goes here",`\
    `"btsbotrequestsid" : "server 1 bot requests channel id goes here",`\
    `"btst3botrequestsid" : "server 2 bot request channel id goes here",`\
    `"announcementfactoryid" : "announcement-factory channel id goes here",`\
    `"announcersroleid" : "announcers role id goes here",`\
    `"announcementsid" : "announcements channel id goes here",`\
    `"moderatorsroleid" : "server 1 moderators role id goes here",`\
    `"reportschannelid" : "reports channel id goes here",`\
    `"privcmdschannelid" : "private commands channel id goes here",`\
    `"tbmroleid" : "trusted bot managers role id goes here",`\
    `"tbmpingroleid" : "pingable trusted bot managers role id goes here",`\
    `"btst3botownersroleid" : "server 2 bot owners role id goes here",`\
    `"botaddingid" : "bot-adding channel id goes here",`\
    `"btst3moderatorsroleid" : "server 2 moderators role id goes here",`\
    `"pollchannelid" : "poll channel id goes here",`\
    `"bannedusernametokens" : ["parts", "of", "usernames", "that", "constitute", "a", "ban", "go", "here"]`
`}`

#### Running
Like any bot, all you use to run BTS Bot is `node app.js`

#### Adding to your server
BTS Bot only requires the `MANAGE_ROLES` permission if you intend on using this feature. It, however, is imperative that give it permission to at least see the logging channel.

### Quick setup tutorial
[![](http://img.youtube.com/vi/nq-dHf_5TNM/0.jpg)](https://www.youtube.com/watch?v=nq-dHf_5TNM "")