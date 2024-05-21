/*const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: "sessions",
    }),
    webVersionCache: {
        type: 'remote',
        remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
    }
});*/

  
const fs = require('fs');
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const { enviarMensajeInicial, guardarNombre, solicitarFoto, guardarFoto } = require('./function');
// WhatsApp client setup

const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: "sessions",
    }),
    webVersionCache: {
        type: 'remote',
        remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
    }
    
});

// Global variables
let nombre, media;
let status = false;
let estaEsperandoFoto = false;
let estaEsperandoNombre = true;

// Event listeners
client.once('ready', () => {
    console.log('Client is ready!');
    
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('message_create', async (message) => {
    const chatId = message.from;
    if (chatId !== '573013252282@c.us') { // Exclude your own number
        console.log(message.body);

        // Command handling
        if (message.body.startsWith('!')) {
            const comando = message.body.slice(1).trim().split(/ +/).shift().toLowerCase();
            switch (comando) {
                case 'crear':
                    enviarMensajeInicial(chatId);
                    status = true;
                    break;
                case 'ayuda':
                    await message.reply('¡Este es un bot de ayuda! Puedes pedir ayuda sobre diferentes temas.');
                    break;
                default:
                    await message.reply('Lo siento, no reconozco ese comando. Intenta con "!ayuda" para obtener ayuda.');
            }
        }

        // Conversation flow (using imported functions)
        if (status == true && message.body.startsWith('!') == false) {
            if (estaEsperandoNombre == true) {
                nombre = guardarNombre(message.body);
                solicitarFoto(chatId);
                estaEsperandoNombre = false;
                estaEsperandoFoto = true;
                console.log(1,estaEsperandoFoto,estaEsperandoNombre);
            } else if (estaEsperandoFoto == false && message.type == 'media') {
                client.sendMessage(chatId, 'Formato erronio, envía una foto.');
                console.log(2,estaEsperandoFoto,estaEsperandoNombre);
            } else if (estaEsperandoFoto == true) {
                media = await message.downloadMedia();
                solicitarFoto(chatId);
                guardarFoto(nombre, media, chatId);
                estaEsperandoFoto = false;
                estaEsperandoNombre = true;
                status = false;
                console.log(1,estaEsperandoFoto,estaEsperandoNombre);
            }
        }
    } else {
        console.log('Client: ', message.body);
    }
});

// Initialize the client
client.initialize();
