/*const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: "sessions",
    }),
    webVersionCache: {
        type: 'remote',
        remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
    }
});*/
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
// Create a new client instance
const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: "sessions",
    }),
    //Tiene que ser esa version
    webVersionCache: {
        type: 'remote',
        remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
    }
})


// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log('Client is ready!');
});

// When the client received QR-Code
client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
});
// Escuchar mensajes entrantes para detectar comandos
client.on('message_create', async (message) => {
    console.log( message.body);
    // Verificar si el mensaje comienza con un prefijo de comando, por ejemplo, "!"
    if (message.body.startsWith('!')) {
        // Extraer el comando del mensaje
        const comando = message.body.slice(1).trim().split(/ +/).shift().toLowerCase();
        // Ejecutar acciones según el comando recibido
        switch (comando) {
            case 'ayuda':
                await message.reply('¡Este es un bot de ayuda! Puedes pedir ayuda sobre diferentes temas.');
                break;
            case 'saludo':
                await message.reply('¡Hola! ¿Cómo estás Inge?');
                break;
            case 'comando':
                await message.reply('Tienes los siguientes comandos disponibles \n!Ayuda \n!Saludo\n!Comando');
                break;
            default:
                await message.reply('Lo siento, no reconozco ese comando. Intenta con "!ayuda" para obtener ayuda.');
        }
    }
});

// Start your client
client.initialize();
