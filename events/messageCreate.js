const prefix = '!';

module.exports = (client, message, commands) => {
  if (message.author.bot || !message.content.startsWith(prefix)) return;

  // removes the prefix
  const body = message.content.slice(prefix.length).trim();

  // obtain the name of the command 
  const cmdName = body.split(/ +/)[0].toLowerCase();
  const command = commands.get(cmdName);
  if (!command) return;

  // rest of the message without command
  const rawArgs = body.slice(cmdName.length).trim();

  // ===============================
  //   !carta
  // ===============================
  if (cmdName === 'carta') {
    // format: !carta Destinatario, mensaje aquí
    const split = rawArgs.split(',');

    if (split.length < 2) {
      return message.reply(
        '💛 **Uso correcto:** `!carta Destinatario, Tu mensaje (máx 300 caracteres)`'
      );
    }

    const addressee = split[0].trim();
    const letter = split.slice(1).join(',').trim(); // allows commas

    try {
      command.execute(message, { addressee, letter });
    } catch (error) {
      console.error(error);
      message.reply('⚠️ Error ejecutando el comando.');
    }

    return;
  }

  // ===============================
  //   normal commands
  // ===============================
  const args = rawArgs.split(/ +/);

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('⚠️ Error ejecutando el comando.');
  }
};
