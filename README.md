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
This guide (of course) showcases Bot Testing Server. However, with a few changes, it can be in yours pretty quickly.

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
    `"prefix" : ",",`\
    `"pstatus" : "DM me to privately speak to a moderator | Run ,help to see all available commands",`\
    `"ostatus" : "dnd",`\
    `"logchannelID" : "logging channel ID",`\
    `"OwnerID" : "owner's ID"`\
`}`
* (optional) Create a roles.json:\
`{`\
`"role name" : "role ID"`\
`}`

#### Running
Like any bot, all you use to run BTS Bot is `node app.js`

#### Adding to your server
BTS Bot only requires the `MANAGE_ROLES` permission if you intend on using this feature. It, however, is imperative that give it permission to at least see the logging channel.

### Quick setup tutorial
[![](http://img.youtube.com/vi/nq-dHf_5TNM/0.jpg)](https://www.youtube.com/watch?v=nq-dHf_5TNM "")