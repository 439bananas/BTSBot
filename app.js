const projname = "BTS Bot"
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
        if (member.guild.id == conf.btsid) {
            member.guild.members.fetch(member.id).then(gm => gm.roles.add(conf.btsbotsroleid, "Member is a bot"))
        }
        if (member.guild.id == conf.btst3id) {
            member.guild.members.fetch(member.id).then(gm => gm.roles.add(conf.btst3botsroleid, "Member is a bot"))
        }
    }
    if (!member.user.bot) {
        console.log(`${colours.cyan(`${new Date()}`)} - ${'INFO:'.green} ${member.user.tag} (${member.id}) joined ${member.guild.name} (${member.guild.id}). The provision of the "Bots" role was suppressed`);
        client.channels.fetch(conf.logchannelID)
        .then(channel => channel.send({
            embed: {
              color: 0x9b59b6,
              description: `${colours.cyan(`${new Date()}`)} - INFO: ${member.user.tag} (${member.id}) joined ${member.guild.name} (${member.guild.id}). The provision of the "Bots" role was suppressed`,
            },
          }).catch(O_o=>{})
        )
        client.users.fetch(member.id)
        .then(user => user.send({
            embed: {
              color: 0x9b59b6,
              description: `Welcome to Bot Testing Server! Should you find yourself banned, you can appeal this decision [here](${conf.appeallink})`,
            },
          }))
    }
})

client.on("message", async (message) => {
    if (!message.author.bot && message.channel.type == "dm") {
        var attach = (message.attachments.array())
        let files = []
        if (message.content == "") {
          var msgcontent = "(empty)"
        } else var msgcontent = message.content
        if (attach) {
          for (let file of attach) {
            files.push(file.url)
          }
        }
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
              description: `Thank you for your message! We will reply as soon as possible.`,
            },
          })
        client.channels.fetch(conf.modmailid)
        .then(channel => channel.send({files: files, embed: {
            color: 0xE67E22,
            author: {
                name: message.author.tag,
                icon_url: message.author.avatarURL()
            },
            title: "A user has sent a modmail message",
            description: `To reply to this message, use ${conf.prefix}reply ${message.author.id} <message>`,
            fields: [
            {
                name: "User (and their ID)",
                value: message.author.tag + " (" + message.author.id + ")"
            },
            {
                name: "Message",
                value: msgcontent
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
    if (command == "help" || command == "report" || command == "request" || command == "role" || command == "announce" || command == "stop" || command == "restart" || command == "reply" || command == "reachout" || command == "fixstatus") {
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
    if (message.channel.id != conf.btsbotrequestsid && message.channel.id != conf.btst3botrequestsid && message.channel.id != conf.modmailid && message.channel.id != conf.announcementfactoryid) {
        if (command == "help") {
            var help = "**" + conf.prefix + "help** - Displays this message\n\**" + conf.prefix + "report** - Reports a user, ensure to add proof in your reasoning\n\**" + conf.prefix + "request** - Requests a bot to be added to this server\n\**" + conf.prefix + "role** - Assigns, lists and remove self-assignable roles (AKA SARs) (toggle, run " + conf.prefix + "role list to see all SARs)"
            if (message.member.roles.cache.has(conf.announcersroleid)) {
                var help = help + "\n\**" + conf.prefix + "announce** - If used in <#" + conf.announcementfactoryid + ">, sends an announcement to <#" + conf.announcementsid + ">"
            }
            if (message.member.roles.cache.has(conf.moderatorsroleid)) {
                var help = help + "\n\**" + conf.prefix + "reply** - Replies to specified user in modmail\n\**" + conf.prefix + "reachout** Reaches out to specified user using modmail"
            }
            if (message.member.hasPermission("MANAGE_GUILD")) {
              var help = help + "\n\**" + conf.prefix + "construct** - Constructs an OAuth2 URL from the given ID. If the user is in the server, constructs generic URL, else consructs URL specific to this server"
            }
            if (message.author.id == conf.OwnerID) {
                var help = help + "\n\**" + conf.prefix + "stop** - Stops the bot\n\**" + conf.prefix + "restart** - Restarts the bot\n\**" + conf.prefix + "fixstatus** - Fixes the status in the case that SOMEONE ever breaks it"
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
                if (client.user.id == "456855204340563999") {
                  var emoji = "<:PHBlowTestSuccessful:409711288504287233>"
                } else {
                  var emoji = ""
                }
                message.channel.send({
                    embed: {
                      color: 0x9b59b6,
                      title: 'Success! ' + emoji,
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
        if (command == "fixstatus") {
            if (message.author.id == conf.OwnerID) {
                if (client.user.id == "456855204340563999") {
                  var emoji = "<:PHBlowTestSuccessful:409711288504287233>"
                } else {
                  var emoji = ""
                }
                message.channel.send({
                    embed: {
                      color: 0x9b59b6,
                      title: 'Success! ' + emoji,
                      description: 'Fixing status...',
                    },
                  });
                client.emit('ready')
            }
            else {
                message.author.send({
                    embed: {
                      color: 0xff0000,
                      title: 'Error',
                      description: `You do not have sufficient permissions to run this command. You need the \`Owner of ${projname}\` permission.`,
                    },
                  });
            }
        }
    if (command == "report" && message.channel.id != conf.btsbotrequestsid && message.channel.id != conf.announcementfactoryid && message.channel.id != conf.reportschannelid && message.channel.id != conf.modmailid) {
        let userid = args[0];
        let reason = args.slice(1).join(" ");
        var attach = (message.attachments.array())
        let files = []
        if (attach) {
          for (let file of attach) {
            files.push(file.url)
          }
        }
        if (client.users.cache.some(user => user.id === userid) && reason && message.author.id != userid && !message.member.roles.cache.has(conf.moderatorsroleid)) {
            client.channels.fetch(conf.reportschannelid)
            .then(channel => channel.send({files: files, embed: {
                color: 0xe74c3c,
                author: {
                  name: message.author.tag,
                  icon_url: message.author.avatarURL()
                },
                title: "A new report has been made: YOUR ATTENTION IS REQUIRED",
                description: "You can deal with this report in <#" + conf.privcmdschannelid + ">\n\Upon dealing with this report, please react to it with ✅ so we all know it's been dealt with",
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
            }))
            await message.delete({ timeout: 500 })
            client.users.fetch(message.author.id)
            .then(user => user.send({embed: {
                color: 0x9b59b6,
                title: "Thank you",
                description: "Thank you for reporting <@" + userid + ">. Our staff team will review it as soon as possible. Thank you for your contributions to keep Bot Testing Server the way it should be - decent, friendly and intuitive.\n\Please do not reply to this message."
            }}))
        }
        if (message.member.roles.cache.has(conf.moderatorsroleid)) {
          client.users.fetch(message.author.id)
            .then(user => user.send({
              embed: {
                color: 0xff0000,
                title: 'Error',
                description: `You do not have sufficient permissions to run this command. You have the \`Moderators\` permission.`,
              },
            }));
        }
        if (!guild.member(userid)) {
          client.users.fetch(message.author.id)
            .then(user => user.send({
                embed: {
                  color: 0xff0000,
                  title: 'Error',
                  description: `This user could not be found. Are they in this server? Are you ensuring that you do not mention them (which attracts their attention) when running the command?`,
                },
              }));
        }
        if (!reason && !message.member.roles.cache.has(conf.moderatorsroleid)) {
          client.users.fetch(message.author.id)
            .then(user => user.send({
              embed: {
                color: 0xff0000,
                title: 'Error',
                description: `You are missing arguments.\n\Usage: ${conf.prefix}${command} <user ID> <reason>\n\Example: ${conf.prefix}${command} 224606298673512458 Advertising`,
              },
            }));
        }
        if (userid == message.author.id && !message.member.roles.cache.has(conf.moderatorsroleid)) {
          client.users.fetch(message.author.id)
          .then(user => user.send({
            embed: {
              color: 0xff0000,
              title: 'Error',
              description: `You cannot report yourself!`,
            },
          }));
        }
    }
    if (command == "role") {
        let role = args.slice(0).join(" ");
        var lowercaserole = role.toLowerCase()
        if (!role) {
          message.channel.send({
            embed: {
              color: 0xff0000,
                title: 'Error',
                description: `You are missing arguments.\n\Usage: ${conf.prefix}${command} <role name>\n\Example: ${conf.prefix}${command} bot owners`,
              },
          });
        }
        if (message.guild.id == conf.btsid) {
            if (role && rolenames[lowercaserole] == null && role.toLowerCase() != "tbmping" && role.toLowerCase() != "list") {
                message.channel.send({
                    embed: {
                      color: 0xff0000,
                      title: 'Error',
                      description: `You cannot assign that role to yourself.`,
                    },
                  });
            if (role == "tbmping" && !message.member.roles.cache.has(conf.tbmroleid)) {
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
                if (message.member.roles.cache.has(conf.tbmroleid)) {
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
                message.guild.members.fetch(message.author.id).then(gm => gm.roles.add(rolenames[lowercaserole], "User self-assigned role"))
                message.channel.send({
                    embed: {
                        color: 0x9b59b6,
                        title: "Success!",
                        description: "You have successfully self-assigned that role"
                    }
                })
                }
                if (message.member.roles.cache.has(rolenames[lowercaserole])) {
                    message.guild.members.fetch(message.author.id).then(gm => gm.roles.remove(rolenames[lowercaserole], "User self-removed role"))
                    message.channel.send({
                        embed: {
                            color: 0x9b59b6,
                            title: "Success!",
                            description: "You have successfully removed that role"
                        }
                    })
                    }
            }
            if (role.toLowerCase() == "tbmping" && message.member.roles.cache.has(conf.tbmroleid)) {
                if (!message.member.roles.cache.has(conf.tbmpingroleid)) {
                    message.guild.members.fetch(message.author.id).then(gm => gm.roles.add(conf.tbmpingroleid, "User self-assigned role"))
                    message.channel.send({
                        embed: {
                            color: 0x9b59b6,
                            title: "Success!",
                            description: "You have successfully self-assigned that role"
                        }
                    })
                    }
                    if (message.member.roles.cache.has(conf.tbmpingroleid)) {
                        message.guild.members.fetch(message.author.id).then(gm => gm.roles.remove(conf.tbmpingroleid, "User self-removed role"))
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
        if (message.guild.id == conf.btst3id) {
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
                if (!message.member.roles.cache.has(conf.btst3botownersroleid)) {
                message.guild.members.fetch(message.author.id).then(gm => gm.roles.add(conf.btst3botownersroleid, "User self-assigned role"))
                message.channel.send({
                    embed: {
                        color: 0x9b59b6,
                        title: "Success!",
                        description: "You have successfully self-assigned that role"
                    }
                })
                }
                if (message.member.roles.cache.has(conf.btst3botownersroleid)) {
                    message.guild.members.fetch(message.author.id).then(gm => gm.roles.remove(conf.btst3botownersroleid, "User self-removed role"))
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
    if ((message.channel.id == conf.btsbotrequestsid || message.channel.id == conf.btst3botrequestsid)) {
        let clientid = args[0];
        let ignore = args.slice(1).join(" ")
        if (!clientid && !message.member.hasPermission('MANAGE_GUILD')) {
            message.channel.send({
                embed: {
                    color: 0xff0000,
                    title: 'Error',
                    description: `You are missing arguments.\n\Usage: ${conf.prefix}${command} <client ID>\n\Example: ${conf.prefix}${command} 397489174791585795`,
                },
            });
        }
        if (client.users.cache.some(user => user.id === clientid) && !message.member.hasPermission('MANAGE_GUILD')) {
            message.channel.send({
                embed: {
                    color: 0xff0000,
                    title: 'Error',
                    description: `The bot you are requesting to add is already in this server!`,
                },
            });
        }
        if (message.member.hasPermission('MANAGE_GUILD')) {
                message.channel.send({
                    embed: {
                      color: 0xff0000,
                      title: 'Error',
                      description: `You do not have sufficient permissions to run this command. You have the \`MANAGE_GUILD\` permission.`,
                    },
                  });
        }
        if (!client.users.cache.some(user => user.id === clientid) && clientid && !message.member.hasPermission('MANAGE_GUILD')) {
            client.channels.fetch(conf.botaddingid)
            .then(channel => channel.send("<@&" + conf.tbmpingroleid +">", {embed: {
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
if (command == "construct") {
  if ((message.channel.id == conf.btsbotrequestsid || message.channel.id == conf.btst3botrequestsid)) {
      let clientid = args[0];
      let ignore = args.slice(1).join(" ")
      if (!clientid && message.member.hasPermission('MANAGE_GUILD')) {
          message.channel.send({
              embed: {
                  color: 0xff0000,
                  title: 'Error',
                  description: `You are missing arguments.\n\Usage: ${conf.prefix}${command} <client ID>\n\Example: ${conf.prefix}${command} 397489174791585795`,
              },
          });
      }
      if (client.users.cache.some(user => user.id === clientid) && message.member.hasPermission('MANAGE_GUILD')) {
        var url = "https://discord.com/oauth2/authorize?scope=bot&client_id=" + clientid
      } else var url = "https://discord.com/oauth2/authorize?scope=bot&guild_id=" + message.guild.id + "&disable_guild_select=true&client_id=" + clientid
      if (!message.member.hasPermission('MANAGE_GUILD')) {
              message.channel.send({
                  embed: {
                    color: 0xff0000,
                    title: 'Error',
                    description: `You do not have sufficient permissions to run this command. You need the \`MANAGE_GUILD\` permission.`,
                  },
                });
      }
      if (message.member.hasPermission('MANAGE_GUILD')) {
          message.channel.send({embed: {
              title: "Success!",
              description: `The link you requested can be found [here](${url})`,
              color: 0x9b59b6
          }})
      }
  }
}
if ((command == "reply" || command == "reachout") && message.channel.id == conf.modmailid) {
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
    if (!client.users.cache.some(user => user.id === userid) || client.users.cache.get(userid).bot) {
        message.channel.send({
            embed: {
              color: 0xff0000,
              title: 'Error',
              description: `This user could not be found. Are they in this server or BTSt3? Are you ensuring that you do not mention them when running the command? Is this user a human?`,
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
    } if (userid != message.author.id && msg && client.users.cache.some(user => user.id === userid && !client.users.cache.get(userid).bot)) {
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
    if (command == "announce" && message.channel.id == conf.announcementfactoryid) {
      var attach = (message.attachments.array())
      let files = []
      if (attach) {
        for (let file of attach) {
          files.push(file.url)
        }
      }
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
        client.channels.fetch(conf.announcementsid)
        .then(channel => channel.send(pt, {files: files, embed: {
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
            description: "Successfully posted announcement in <#" + conf.announcementsid + ">!"
          }
        })
        }
        }
})

client.login(conf.token)
