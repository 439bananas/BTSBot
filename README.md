# BTS Bot
<center>

![BTS Bot banner](https://439bananas.com/projects/btsbot/readmeHeaderBanner.png)
[![Dashboard](https://img.shields.io/badge/-Dashboard-%232f3136)](https://btsbot.439bananas.com)
[![Wiki](https://img.shields.io/badge/-Wiki-%23f0600f)](https://wiki.btsbot.439bananas.com)
[![Discord](https://img.shields.io/discord/361233849847644160?color=%235865F2&label=Discord)](https://discord.gg/ahyzfEv)

</center>

## Where am I?
Physically? No idea. Digitally? You're at BTS Bot's open-source GitHub (or GitLab, if that's what you're into) repository!

We want to create a better experience for those using BTS Bot and we agree that the best way to improve user experience is to open the source code for others to contribute.

### But what is it?
For the uninitiated, BTS Bot is ~~a K-pop bot~~ an open-source utility and moderation bot created for the sake of the end user.

## Can I contribute?
Of course! While some features may not be approved (typically things that may legally or technically be a challenge, such as music commands), we're happy for you to contribute.

### How do I contribute?
You can contribute by forking this repository and creating a pull request or opening an issue. Do remember that code contributions should ideally follow similar code practices (such as well-commented code and absolutely not looking like spaghetti junction) before they're pushed to the `master` branch. You also should **not** create issues or pull requests via the GitLab repository, as they likely will not be read.

## Installing
[A more detailed version of this guide is on the wiki](https://wiki.btsbot.439bananas.com/wiki/Installing)\
Prerequisites:
* Node.JS
* Git
* Python 3
* MariaDB

Installing:
* Create a MariaDB database and user
* Git clone this repository
* Run `npm install`
* Install the Pythonic `requests` module
* Within /install, run `emojigen.py`
* Within /, run `npm start`
* Navigate to http://localhost:8082 in your web browser
* Follow the configuration steps

## Important notes
* When debugging in ~~Visual Studio~~ (This is currently disabled, Visual Studio 2022 has an annoying bug where if "start web browser on launch" is enabled, it will not open the console output in Windows Terminal) or Visual Studio Code, a browser window will open automatically, directing to http://locahost:8082
* To close BTS Bot, you *must* run the /stop command. If BTS Bot cannot yet log into Discord, then it is safe to close BTS Bot via your task manager by ending createElements.js. Attempting to close BTS Bot using CTRL + C or closing the terminal window is not enough and will keep BTS Bot running in the background; this is because the console is only an output to BTS Bot and does not host the bot itself.