const projname = "BTSBot"
const colours = require('colors');
const Discord = require("discord.js");
const client = new Discord.Client();
const conf = require("./conf.json");
const rolenames = require("./roles.json");
console.log(`${colours.cyan(`${new Date()}`)} - ${'INFO:'.green} Attempting to connect to Discord\'s API...`);

client.on("ready", () => {
    console.log(`${colours.cyan(`${new Date()}`)} - ${'INFO:'.green} Successfully connected to Discord's API!\n${projname} will now list who ran what command in which server and channel at what time.\n\Prefix: ${conf.prefix}\n\Status: ${conf.ostatus}\n\Playing status: ${conf.pstatus}`);
    client.channels.fetch(conf.logchannelID)
    .then(channel => channel.send({
        embed: {
          color: 0x9b59b6,
          description: `${new Date()} - INFO: ${projname} has started.`,
        },
      })
    );
    client.user.setPresence({ activity: { name: conf.pstatus }, status: conf.ostatus })
        .catch(console.error);
    });

client.on('error', (error) => {
    console.trace(`${colours.cyan(`${new Date()}`)} - ${'WARN:'.yellow} ${error}`);
    client.channels.fetch(conf.logchannelID)
    .then(channel => channel.send({
        embed: {
        color: 0xff0000,
        title: 'Error',
        description: `${new Date()} - WARN: ${JSON.stringify(error).toString().slice(0, 1994)}`,
        },
    }).catch(O_o=>{})
    )});

client.on("guildMemberAdd", (member) => {
    if (member.user.bot) {
        console.log(`${colours.cyan(`${new Date()}`)} - ${'INFO:'.green} ${member.user.tag} (${member.id}) was added to ${member.guild.name} (${member.guild.id}). The "Bots" role was assigned automatically`);
        client.channels.fetch(conf.logchannelID)
        .then(channel => channel.send({
            embed: {
              color: 0x9b59b6,
              description: `${colours.cyan(`${new Date()}`)} - INFO: ${member.user.tag} (${member.id}) was added to ${member.guild.name} (${member.guild.id}). The "Bots" role was assigned automatically`,
            },
          }).catch(O_o=>{})
        )
        if (member.guild.id == "361233849847644160") {
            member.guild.members.fetch(member.id).then(gm => gm.roles.add("402560844841615373"))
        }
        if (member.guild.id == "714538145512685648") {
            member.guild.members.fetch(member.id).then(gm => gm.roles.add("714549456535814174"))
        }
    }
})

client.on("message", async (message) => {
    if (!message.author.bot && message.channel.type == "dm") {
        console.log(`${colours.cyan(`${new Date()}`)} - ${'INFO:'.green} ${message.author.tag} (${message.author.id}) sent a modmail message with the content "${message.content}" in ${message.channel.id}.`);
        client.channels.fetch(conf.logchannelID)
        .then(channel => channel.send({
            embed: {
              color: 0x9b59b6,
              description: `${new Date()} - INFO: ${message.author.tag} (${message.author.id}) sent a modmail message with the content "${message.content}" in ${message.channel.id}.`,
            },
          }).catch(O_o=>{})
        )
        message.channel.send({
            embed: {
              color: 0x9b59b6,
              description: `Thank you for your message! We will reply as soon as possible. To ensure that we can actually reply to it, please join [our main server](https://discord.gg/ahyzfEv).`,
            },
          })
        client.channels.fetch("723075096234950667")
        .then(channel => channel.send({embed: {
            color: 0xE67E22,
            author: {
                name: message.author.tag,
                icon_url: message.author.avatarURL()
            },
            title: "A user has sent a modmail message",
            description: `To reply to this message, use ,reply ${message.author.id} <message>`,
            fields: [
            {
                name: "User (and their ID)",
                value: message.author.tag + " (" + message.author.id + ")"
            },
            {
                name: "Message",
                value: message.content
                  }
            ],
            timestamp: new Date(),
            footer: {
                icon_url: client.user.avatarURL(),
                text: "This message is confidential. Unauthorised disclosure may result in sanctions including warnings and potentially revocation of privileges."
            }
        }
    }))
}
});

client.on("message", async (message) => {
    if (!message.content.startsWith(conf.prefix) || message.author.bot) return;
    if (message.channel.type === 'dm') return;
    const args = message.content.slice(conf.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    if (command == "help" || command == "report" || command == "request" || command == "role" || command == "announce" || command == "stop" || command == "restart" || command == "reply" || command == "reachout") {
        console.log(`${colours.cyan(`${new Date()}`)} - ${'INFO:'.green} ${message.author.tag} (${message.author.id}) ran ${message.content} in ${message.guild.name} (${message.guild.id}), #${message.channel.name} (${message.channel.id}).`);
        client.channels.fetch(conf.logchannelID)
        .then(channel => channel.send({
            embed: {
              color: 0x9b59b6,
              description: `${new Date()} - INFO: ${message.author.tag} (${message.author.id}) ran ${message.content} in ${message.guild.name} (${message.guild.id}), #${message.channel.name} (${message.channel.id}).`,
            },
          }).catch(O_o=>{})
        )
    }
    if (message.channel.id != "402559003785297931" && message.channel.id != "715265229407125534" && message.channel.id != "723075096234950667" && message.channel.id != "459421264545579024") {
        if (command == "help") {
            var help = "**" + conf.prefix + "help** - Displays this message\n\**" + conf.prefix + "report** - Reports a user, ensure to add proof in your reasoning\n\**" + conf.prefix + "request** - Requests a bot to be added to this server\n\**" + conf.prefix + "role** - Assigns, lists and remove self-assignable roles (AKA SARs) (toggle, run " + conf.prefix + "role list to see all SARs)"
            if (message.member.roles.cache.has('459420363428986900')) {
                var help = help + "\n\**" + conf.prefix + "announce** - If used in <#459421264545579024>, sends an announcement to <#402562324122304512>"
            }
            if (message.member.roles.cache.has('402560627547308032')) {
                var help = help + "\n\**" + conf.prefix + "reply** - Replies to specified user in modmail\n\**" + conf.prefix + "reachout** Reaches out to specified user using modmail"
            }
            if (message.author.id == conf.OwnerID) {
                var help = help + "\n\**" + conf.prefix + "stop** - Stops the bot\n\**" + conf.prefix + "restart** - Restarts the bot"
            }
            message.channel.send({
                embed: {
                    color: 0x9b59b6,
                    title: "Help",
                    description: help
                }
            })
        }
        if (command == "stop") {
            if (message.author.id == conf.OwnerID) {
                message.channel.send({
                    embed: {
                        color: 0x9b59b6,
                        title: "Stopping...",
                        description: "STOP ---- HA- I mean BTSBot was stopped."
                    }
                })
                await client.channels.fetch(conf.logchannelID)
                .then(channel => channel.send({
                    embed: {
                        color: 0x9b59b6,
                        description: `${new Date()} - INFO: ${projname} was stopped.`,
                    },
                }))
                await client.destroy()
                console.log(`${colours.cyan(`${new Date()}`)} - ${'INFO:'.green} ${projname} was stopped.`)
                process.exit()
            }
            else {
                message.channel.send({
                    embed: {
                      color: 0xff0000,
                      title: 'Error',
                      description: `You do not have sufficient permissions to run this command. You need the \`Owner of ${projname}\` permission.`,
                    },
                  });
            }
        }
        if (command == "restart") {
            if (message.author.id == conf.OwnerID) {
                message.channel.send({
                    embed: {
                      color: 0x9b59b6,
                      title: 'Success! <:PHBlowTestSuccessful:409711288504287233>',
                      description: 'Restarting...',
                    },
                  });
                await client.channels.fetch(conf.logchannelID)
                .then(channel => channel.send({
                    embed: {
                        color: 0x9b59b6,
                        description: `${new Date()} - INFO: Restarting...`,
                    },
                })).catch(O_o=>{});
                client.destroy();
                await client.login(conf.token);
                console.log(`${colours.cyan(`${new Date()}`)} - ${'INFO:'.green} Restarting...`);
                client.emit('ready')
            }
            else {
                message.channel.send({
                    embed: {
                      color: 0xff0000,
                      title: 'Error',
                      description: `You do not have sufficient permissions to run this command. You need the \`Owner of ${projname}\` permission.`,
                    },
                  });
            }
        }
    if (command == "report" && message.channel.id != "402559003785297931" && message.channel.id != "459421264545579024" && message.channel.id != "721813750566486046" && message.channel.id != "723075096234950667") {
        let userid = args[0];
        let reason = args.slice(1).join(" ");
        message.delete()
        if (client.users.cache.some(user => user.id === userid) && reason && message.author.id != userid && !message.member.roles.cache.has('402560627547308032')) {
            client.channels.fetch("721813750566486046")
            .then(channel => channel.send({embed: {
                color: 0xe74c3c,
                author: {
                  name: message.author.tag,
                  icon_url: message.author.avatarURL()
                },
                title: "A new report has been made: YOUR ATTENTION IS REQUIRED",
                description: "You can deal with this report in <#408348525630324736>",
                fields: [{
                    name: "Server",
                    value: message.guild.name
                  },
                  {
                    name: "Reporting user (and their ID)",
                    value: message.author.tag + " (" + message.author.id + ")"
                  },
                  {
                    name: "User and their ID being reported",
                    value: userid + " - <@" + userid + ">"
                  },
                  {
                    name: "Reason",
                    value: reason
                  }
                ],
                timestamp: new Date(),
                footer: {
                  icon_url: client.user.avatarURL(),
                  text: "This report is confidential. Unauthorised disclosure may result in sanctions including warnings and potentially revocation of privileges."
                }
              }
            }));
            client.users.fetch(message.author.id)
            .then(user => user.send({embed: {
                color: 0x9b59b6,
                title: "Thank you",
                description: "Thank you for reporting <@" + userid + ">. Our staff team will review it as soon as possible. Thank you for your contributions to keep Bot Testing Server the way it should be - decent, friendly and intuitive.\n\Please do not reply to this message."
            }}))
        }
        if (message.member.roles.cache.has('402560627547308032')) {
            message.channel.send({
                embed: {
                  color: 0xff0000,
                  title: 'Error',
                  description: `You do not have sufficient permissions to run this command. You have the \`Moderators\` permission.`,
                },
              });
        }
        if (!client.users.cache.some(user => user.id === userid) && !message.member.roles.cache.has('402560627547308032')) {
            message.channel.send({
                embed: {
                  color: 0xff0000,
                  title: 'Error',
                  description: `This user could not be found. Are they in this server? Are you ensuring that you do not mention them (which attracts their attention) when running the command?`,
                },
              });
        }
        if (!reason && !message.member.roles.cache.has('402560627547308032')) {
            message.channel.send({
                embed: {
                  color: 0xff0000,
                  title: 'Error',
                  description: `You are missing arguments.\n\Usage: ${conf.prefix}report <user ID> <reason>\n\Example: ${conf.prefix}report 224606298673512458 Advertising`,
                },
              });
        }
        if (userid == message.author.id && !message.member.roles.cache.has('402560627547308032')) {
            message.channel.send({
                embed: {
                  color: 0xff0000,
                  title: 'Error',
                  description: `You cannot report yourself!`,
                },
              });
        }
    }
    if (command == "role") {
        let role = args.slice(0).join(" ");
        var lowercaserole = role.toLowerCase()
        if (message.guild.id == "361233849847644160") {
            if (role && rolenames[lowercaserole] == null && role.toLowerCase() != "tbmping" && role.toLowerCase() != "list") {
                message.channel.send({
                    embed: {
                      color: 0xff0000,
                      title: 'Error',
                      description: `You cannot assign that role to yourself.`,
                    },
                  });
            if (role == "tbmping" && !message.member.roles.cache.has('402929603792076811')) {
                message.channel.send({
                    embed: {
                      color: 0xff0000,
                      title: 'Error',
                      description: `You cannot assign that role to yourself.`,
                    },
                  });
            }
        }
            if (role == "list") {
                var rolelist = "Bot Owners\nred\nbrown\norange\nyellow\ngreen\nsky blue\nlight blue\nblue\npurple\nmagenta\npeach\ngrey\nblack\nwhite"
                if (message.member.roles.cache.has('402929603792076811')) {
                    var rolelist = rolelist + "\ntbmping"
                }
                message.channel.send({
                    embed: {
                        color: 0x9b59b6,
                        title: "Self-assignable role list",
                        description: rolelist
                    }
                })
            }
            if (rolenames[lowercaserole] != null) {
                if (!message.member.roles.cache.has(rolenames[lowercaserole])) {
                message.guild.members.fetch(message.author.id).then(gm => gm.roles.add(rolenames[lowercaserole]))
                message.channel.send({
                    embed: {
                        color: 0x9b59b6,
                        title: "Success!",
                        description: "You have successfully self-assigned that role"
                    }
                })
                }
                if (message.member.roles.cache.has(rolenames[lowercaserole])) {
                    message.guild.members.fetch(message.author.id).then(gm => gm.roles.remove(rolenames[lowercaserole]))
                    message.channel.send({
                        embed: {
                            color: 0x9b59b6,
                            title: "Success!",
                            description: "You have successfully removed that role"
                        }
                    })
                    }
            }
            if (role.toLowerCase() == "tbmping" && message.member.roles.cache.has('402929603792076811')) {
                if (!message.member.roles.cache.has('723280789319712848')) {
                    message.guild.members.fetch(message.author.id).then(gm => gm.roles.add("723280789319712848"))
                    message.channel.send({
                        embed: {
                            color: 0x9b59b6,
                            title: "Success!",
                            description: "You have successfully self-assigned that role"
                        }
                    })
                    }
                    if (message.member.roles.cache.has('723280789319712848')) {
                        message.guild.members.fetch(message.author.id).then(gm => gm.roles.remove("723280789319712848"))
                        message.channel.send({
                            embed: {
                                color: 0x9b59b6,
                                title: "Success!",
                                description: "You have successfully removed that role"
                            }
                        })
                        }
            }
        }
        if (message.guild.id == "714538145512685648") {
            if (role && role.toLowerCase() != "bot owners" && role.toLowerCase() != "list") {
                message.channel.send({
                    embed: {
                      color: 0xff0000,
                      title: 'Error',
                      description: `You cannot assign that role to yourself.`,
                    },
                  });
            }
            if (role == "list") {
                var rolelist = "Bot Owners"
                message.channel.send({
                    embed: {
                        color: 0x9b59b6,
                        title: "Self-assignable role list",
                        description: rolelist
                    }
                })
            }
            if (role.toLowerCase() == "bot owners") {
                if (!message.member.roles.cache.has('714549457944838264')) {
                message.guild.members.fetch(message.author.id).then(gm => gm.roles.add("714549457944838264"))
                message.channel.send({
                    embed: {
                        color: 0x9b59b6,
                        title: "Success!",
                        description: "You have successfully self-assigned that role"
                    }
                })
                }
                if (message.member.roles.cache.has('714549457944838264')) {
                    message.guild.members.fetch(message.author.id).then(gm => gm.roles.remove("714549457944838264"))
                    message.channel.send({
                        embed: {
                            color: 0x9b59b6,
                            title: "Success!",
                            description: "You have successfully removed that role"
                        }
                    })
                    }
            }
        }
    }
}
if (command == "request") {
    if (message.channel.id == "402559003785297931" || message.channel.id == "714558755202793483") {
        let clientid = args[0];
        if (!clientid) {
            message.channel.send({
                embed: {
                    color: 0xff0000,
                    title: 'Error',
                    description: `You are missing arguments.\n\Usage: ${conf.prefix}${command} <clientid ID>\n\Example: ${conf.prefix}${command} 397489174791585795`,
                },
            });
        }
        if (client.users.cache.some(user => user.id === clientid)) {
            message.channel.send({
                embed: {
                    color: 0xff0000,
                    title: 'Error',
                    description: `The bot you are requesting to add is already in this server!`,
                },
            });
        }
        if (!client.users.cache.some(user => user.id === clientid) && clientid) {
            client.channels.fetch("456560760542199829")
            .then(channel => channel.send("<@&723280789319712848>", {embed: {
                color: 0x2ecc71,
                author: {
                  name: message.author.tag,
                  icon_url: message.author.avatarURL()
                },
                title: "A bot has been requested!",
                description: "Upon being added, it will be automatically assigned roles",
                fields: [{
                    name: "Server",
                    value: message.guild.name
                  },
                  {
                    name: "Requesting user (and their ID)",
                    value: message.author.tag + " (" + message.author.id + ")"
                  },
                  {
                    name: "OAuth2 link",
                    value: "[" + clientid + "](https://discord.com/oauth2/authorize?scope=bot&guild_id=" + message.guild.id + "&disable_guild_select=true&client_id=" + clientid + ")"
                  }
                ],
                timestamp: new Date(),
                footer: {
                  icon_url: client.user.avatarURL(),
                  text: projname
                }
              }
            }));
            message.channel.send({embed: {
                title: "Success!",
                description: "The bot you requested has been forwarded to our trusted bot managers",
                color: 0x9b59b6
            }})
        }
    }
}
if ((command == "reply" || command == "reachout") && message.channel.id == "723075096234950667") {
    let userid = args[0];
    let msg = args.slice(1).join(" ");
    if (command == "reply") {
        var title = "A moderator has replied to your message!"
    }
    else if (command == "reachout") {
        var title = "A moderator has sent you a message!"
    }
    if (userid == message.author.id) {
        message.channel.send({
            embed: {
              color: 0xff0000,
              title: 'Error',
              description: `You cannot reach out to yourself!`,
            },
          });
    }
    if (!client.users.cache.some(user => user.id === userid)) {
        message.channel.send({
            embed: {
              color: 0xff0000,
              title: 'Error',
              description: `This user could not be found. Are they in this server? Are you ensuring that you do not mention them when running the command?`,
            },
          });
    }
    if (!msg) {
        message.channel.send({
            embed: {
                color: 0xff0000,
                title: 'Error',
                description: `You are missing arguments.\n\Usage: ${conf.prefix}${command} <user ID> <message>\n\Example: ${conf.prefix}${command} 224606298673512458 Hello!`,
            },
        });
    } if (userid != message.author.id && msg && client.users.cache.some(user => user.id === userid)) {
        client.users.fetch(userid)
        .then(user => user.send({embed: {
            color: 0x9b59b6,
            author: {
              name: message.author.tag,
              icon_url: message.author.avatarURL()
            },
            title: title,
            description: "You can reply to this message",
            fields: [{
                name: "Moderator (and their ID)",
                value: message.author.tag + " (" + message.author.id + ")"
              },
              {
                name: "Message",
                value: msg
              }
            ],
            timestamp: new Date(),
            footer: {
              icon_url: client.user.avatarURL(),
              text: projname
            }
          }
        }))
        message.channel.send({embed: {
            color: 0x9b59b6,
            title: "Success!",
            description: "Successfully messaged <@" + userid + ">"
        }})
    }
}
    if (command == "announce" && message.channel.id == "459421264545579024") {
        let pingtype = args[0];
        let msg = args.slice(1).join(" ");
        if (!msg || (pingtype != "here" && pingtype != "everyone" && pingtype != "noping")) {
            message.channel.send({
                embed: {
                    color: 0xff0000,
                    title: 'Error',
                    description: `You are missing arguments.\n\Usage: ${conf.prefix}${command} <everyone/here/noping> <message>\n\Example: ${conf.prefix}${command} noping ily guys`,
                },
            });
        }
        if (pingtype == "here") {
            var pt = "@here"
        }
        if (pingtype == "everyone") {
            var pt = "@everyone"
        }
        if (pingtype == "noping") {
            var pt = ""
        }
        if (msg && (pingtype == "here" || pingtype == "everyone" || pingtype == "noping")) {
        client.channels.fetch("402562324122304512")
        .then(channel => channel.send(pt, {embed: {
            color: 0x9b59b6,
            author: {
              name: message.author.tag,
              icon_url: message.author.avatarURL()
            },
            title: "Announcement",
            fields: [{
                name: "Message",
                value: msg
              }
            ],
            timestamp: new Date(),
            footer: {
              icon_url: client.user.avatarURL(),
              text: projname
            }
          }
        }))
        message.channel.send({embed: {
            color: 0x9b59b6,
            title: "Success!",
            description: "Successfully posted announcement in <#402562324122304512>!"
          }
        })
        }
        }
})

client.login(conf.token)