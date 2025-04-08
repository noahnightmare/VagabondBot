# About
Vagabond Bot is a multipurpose Discord bot that creates individual profiles for users with a levelling system that is cross server compatible.

## Using The Bot
By inviting the bot to your server, the bot instantly starts tracking messages and awarding XP based on user activity. The more a user chats on your server, the more XP they will get - eventually leading them to level up!  
Users get coins by levelling up which they can spend in the ``/shop`` - which can then be ``/equip``ped to a user profile.  

## Commands

``/buy`` - buy an item from the shop using it's name.  
``/clear`` - clear your equipped badge/colour.  
``/editxp`` - administrator command to award xp to a user.  
``/equip`` - equip a specific badge/color to your profile.  
``/help`` - displays more information about each command.  
``/profile`` - displays information about a user (i.e. XP, level, coins, inventory)  
``/shop`` - displays the shop pop up, listing names and values of items.  
``/xp`` - allows a user to view their own xp.  

## Bot Setup

Install Node.js
https://nodejs.org/en

Navigate to the bot's directory
```
npm install discord.js
npm install dotenv
npm install mongodb
npm install mongoose
```

A private .env file is also required in order to run the bot.
Format it like so:
```env
TOKEN=<insert_token_here>
CHANNEL=<channel_id>
MONGO_DB=<insert_db_connection_link_here>
DEBUG=false
```


