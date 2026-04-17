export const commandCategories = [
  {
    "name": "Economy",
    "description": "Turtle economy commands — earn, spend, and gamble your turtles",
    "commands": [
      { "name": "bet", "description": "Double your turtles. (or lose them?)", "usage": "#bet (turtles) (blue/red)" },
      { "name": "cooldownreset", "description": "Reset #turtle command cooldown.", "usage": "#cooldownreset" },
      { "name": "duel", "description": "Duel with someone for your precious turtles.\\\nYour opponent has to accept the duel with `#duel accept`, they can also `#duel deny`.\\\nYou can cancel your duel with `#duel cancel`", "usage": "#duel (username) (turtles)" },
      { "name": "gift", "description": "Gift someone a random number of turtles!", "usage": "#gift (username)" },
      { "name": "gifts", "description": "Check your or someone else gifts!", "usage": "#gifts (username)" },
      { "name": "give", "description": "Share your turtles with others! (25% tax)", "usage": "#give (username) (turtles)" },
      { "name": "leaderboard", "description": "Shows top 5 users with most turtles", "usage": "#leaderboard" },
      { "name": "loserboard", "description": "Shows top 5 users with least turtles", "usage": "#loserboard" },
      { "name": "redeem", "description": "Redeem a custom turtle code.", "usage": "#redeem (code)" },
      { "name": "rob", "description": "Steal turtles from someone — after all, sharing is caring... right?", "usage": "#rob (username)" },
      { "name": "topgifters", "description": "Shows top 5 users with most gifted gifts!", "usage": "#topgifters" },
      { "name": "turtle", "description": "Collect your turtles! or lose some of them...", "usage": "#turtle" },
      { "name": "turtles", "description": "Check your economy profile.", "usage": "#turtles" }
    ]
  },
  {
    "name": "Broadcaster",
    "description": "Commands for channel owners to configure and manage the bot",
    "commands": [
      { "name": "command", "description": "Create custom commands! Available arguments: {chatters}, {chatters.random}, {random.percent}, {sender.username}, {sender.displayname}, {rngphrase}, {arg (number)}", "usage": "#command add/remove/modify/raw (command) [content]" },
      { "name": "config", "description": "Customize bot behaviour", "usage": "#config (get/set) (option) [value]" },
      { "name": "dinkdonk", "description": "Ping everyone in chat", "usage": "#dinkdonk [message]" },
      { "name": "disable", "description": "Disable commands in your chat room!", "usage": "#disable (command)" },
      { "name": "enable", "description": "Enable disabled commands in your chat room!", "usage": "#enable (command)" },
      { "name": "fill", "description": "Fill chat with specified text!", "usage": "#fill (text: string)" },
      { "name": "ignorecmd", "description": "Make bot ignore specific commands. Useful for bot command clashes.", "usage": "#ignorecmd (command)" },
      { "name": "join", "description": "Add bot to your channel!", "usage": "#join" },
      { "name": "language", "description": "Change CHAT ROOM language (not only for you)", "usage": "#lang (language code)" },
      { "name": "part", "description": "Remove the bot from your channel. Goodbye!", "usage": "#part" },
      { "name": "prefix", "description": "Change prefix in current chat room", "usage": "#prefix (prefix)" },
      { "name": "pyramid", "description": "Make a pyramid out of text!", "usage": "#pyramid (size: integer) (text: string)" },
      { "name": "setgame", "description": "Change your current stream game", "usage": "#setgame (game)" },
      { "name": "settitle", "description": "Change your stream title", "usage": "#settitle (title)" },
      { "name": "spam", "description": "Spam a specified text!", "usage": "#spam (size: integer) (text: string)" },
      { "name": "unignorecmd", "description": "Undo the ignorecmd command", "usage": "#unignorecmd (command)" }
    ]
  },
  {
    "name": "Moderation",
    "description": "Tools to help moderators manage your chat",
    "commands": [
      { "name": "ban", "description": "Bans specified user in your Twitch chat. Handy for moderators on phone. No duration specified = permanent", "usage": "#ban (user) [duration]" },
      { "name": "block", "description": "Block specific user from interacting with you. Currently affects fuckmarrykill and remind commands", "usage": "#block (username)" },
      { "name": "mod", "description": "Mod specific user (optionally for specific time)", "usage": "#mod (username) [for (time)]" },
      { "name": "setpower", "description": "Set channel power of specific user. 5 = moderation commands, 10 = broadcaster commands, 3 = bypasses offlinemode", "usage": "#setpower (username) (power)" },
      { "name": "unban", "description": "Unbans specified user in your Twitch chat. Handy for moderators on phone.", "usage": "#unban (user)" },
      { "name": "vip", "description": "VIP specific user (optionally for specific time)", "usage": "#vip (username) [for (time)]" }
    ]
  },
  {
    "name": "7TV",
    "description": "Manage and explore 7TV emotes and cosmetics",
    "commands": [
      { "name": "7tvcreatetagset", "description": "Creates a tag-based variant of the active or specified 7TV emote set.", "usage": "#7tvcreatetagset [emote set url] #(tag)" },
      { "name": "7tveditorof", "description": "Show for how many channels and where the target user is a 7TV Editor", "usage": "#7tveditorof (username)" },
      { "name": "7tvemotes", "description": "Sends all 7TV Emotes to the chat.", "usage": "#7tvemotes" },
      { "name": "7tvsa", "description": "Check if and for how long specified user is subscribed to 7TV", "usage": "#7tvsa [username]" },
      { "name": "add", "description": "Bulk searches and adds emotes from the specified, case-sensitive texts. You have to add \"turtegbot\" as a 7TV editor.", "usage": "#add (emote) [emote] [...] [Search Filters]" },
      { "name": "alias", "description": "Aliases an emote from the specified, case-sensitive text. You have to add \"turtegbot\" as a 7TV editor.", "usage": "#alias (emote) (newName)" },
      { "name": "cosmetics", "description": "Shows all of the specified user 7TV cosmetics.", "usage": "#cosmetics (username)" },
      { "name": "editor", "description": "Adds or removes someone as a 7TV editor.", "usage": "#editor (add/modify/remove) (username) [permissions mask]" },
      { "name": "previewcosmetic", "description": "Returns JSON that can be imported to 7TV \"Paint Tool\".", "usage": "#previewcosmetic (cosmetic HEX)" },
      { "name": "remove", "description": "Bulk removes emotes from the specified, case-sensitive text. You have to add \"turtegbot\" as a 7TV editor.", "usage": "#remove (emote) [emote] [...]" },
      { "name": "search-", "description": "Searches and displays 10 first emotes from the specified parameters.", "usage": "#search (emote name) [Search Filters]" },
      { "name": "yoink", "description": "Adds specified emotes from another channel. '#noalias' won't automatically alias emotes", "usage": "#yoink (emote) [emote] [...] #(channel) [#noalias]" }
    ]
  },
  {
    "name": "Support",
    "description": "Get help, report issues, or suggest features",
    "commands": [
      { "name": "ping", "description": "Check if the bot is working.", "usage": "#ping" },
      { "name": "report", "description": "This command can be used to report various issues with Turtegbot. Don't hesitate to use it!", "usage": "#report (message)" },
      { "name": "join", "description": "Lets the bot join your channel", "usage": "#join" },
      { "name": "part", "description": "Lets the bot leave your channel", "usage": "#part" },
      { "name": "suggest", "description": "Suggest anything you would like to see in Turtegbot. A better way to receive feedback is to use the suggestions channel on Discord.", "usage": "#suggest (message)" }
    ]
  },
  {
    "name": "Data Commands",
    "description": "Look up Twitch data, logs, and channel info",
    "commands": [
      { "name": "accountage", "description": "Check for how long your/specified account is created.", "usage": "#accountage [user]" },
      { "name": "chatters", "description": "Displays current chatters count", "usage": "#chatters" },
      { "name": "emotes", "description": "Returns URL to emotes.raccatta.cc", "usage": "#emotes (user)" },
      { "name": "firstline", "description": "Sends the first message from logs provided by florian_2807", "usage": "#firstline [username] [#(channel)]" },
      { "name": "followage", "description": "Show for how long you/someone is following this/specified channel!", "usage": "#followage [user] [#(channel)]" },
      { "name": "follows", "description": "Check channel follows", "usage": "#follows [channel]" },
      { "name": "founders", "description": "Check channel founders", "usage": "#founders [channel]" },
      { "name": "mods", "description": "Check channel mods", "usage": "#mods [channel]" },
      { "name": "randomline", "description": "Sends a random message from logs provided by florian_2807", "usage": "#randomline [username] [#(channel)] [#(argument)]" },
      { "name": "recover", "description": "Recovers Twitch VOD from specified TwitchTracker URL", "usage": "#recover [TwitchTracker URL]" },
      { "name": "sa", "description": "Check for how long a user is subscribed to specific channel on Twitch", "usage": "#sa [username] [#(channel)]" },
      { "name": "title", "description": "Returns user/current stream title", "usage": "#title [user]" },
      { "name": "user", "description": "Display Twitch Data about specified user", "usage": "#user (username)" },
      { "name": "vips", "description": "Check channel vips", "usage": "#vips [channel]" }
    ]
  },
  {
    "name": "Bot Staff",
    "description": "Internal commands restricted to bot staff",
    "commands": [
      { "name": "gannounce", "description": "Send a message to all channels where TurtegBot is joined.", "usage": "#gannounce (text)" },
      { "name": "gblock", "description": "Globally add the username to the blocklist. Users added to the blocklist will be ignored by TurtegBot.", "usage": "#gblock (username)" },
      { "name": "join", "description": "Join to specified chat room", "usage": "#join (username)" },
      { "name": "part", "description": "Part a specified chat room", "usage": "#part (username)" },
      { "name": "reload", "description": "Reload specific bot module", "usage": "#reload (module)" },
      { "name": "setrole", "description": "Sets the role for a user", "usage": "#setrole enki_speed 1" },
      { "name": "setturtles", "description": "Sets the amount of turtles for a user", "usage": "#setturtles enki_speed 48" }
    ]
  }
];
