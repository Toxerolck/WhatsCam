const fs = require('fs');
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const path = require('path');
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
//Functions
function enviarMensajeInicial(chatId) {
    client.sendMessage(chatId, '¡Hola! Para empezar, dime tu nombre.');
}

function guardarNombre(nombreRecibido) {
    var nombre = nombreRecibido.trim();
    console.log('Nombre guardado:', nombre);
    return nombre;
}

function solicitarFoto(chatId) {
    client.sendMessage(chatId, '¡Ahora envíame una foto de tu cara!');
}

function guardarFoto(nombreFoto, media, chatId) {
    if (media) {
        try {
            // 1. Guardar la imagen en el sistema de archivos
            var base64Image = media.data;
            var fileName = nombreFoto + '.jpg';
            var imagePath = path.resolve(__dirname, 'fotos', fileName);
            fs.writeFileSync(imagePath, base64Image, 'base64');

            // 2. Manejar los datos JSON
            var jsonFilePath = path.resolve(__dirname, 'userData.json');

            // Leer datos existentes o inicializar si el archivo no existe
            var userData = { users: [] };
            if (fs.existsSync(jsonFilePath)) {
                userData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));
            }

            // Agregar nuevos datos de usuario
            var newUserData = {
                name: nombreFoto,
                photoFile: fileName,
                history: [],
            };
            userData.users.push(newUserData);

            // Escribir datos actualizados de vuelta al archivo JSON
            fs.writeFileSync(jsonFilePath, JSON.stringify(userData, null, 2));
            console.log('Foto y datos guardados:', fileName);
            client.sendMessage(chatId,'¡Foto guardada correctamente!');

            // Restablecer el estado de la conversación para el próximo usuario

        } catch (error) {
            console.error('Error al guardar la foto o los datos:', error);
            client.sendMessage(chatId, '¡Hubo un error al procesar tu foto! Por favor, intenta de nuevo.');

            // Restablecer el estado de la conversación en caso de error

        }
    } else {
        console.error('Error al guardar la foto: No se recibió media.');
        client.sendMessage(chatId, '¡No se recibió ninguna foto! Por favor, envía una foto de tu cara.');

        // Restablecer el estado de la conversación si no se recibe media
        estaEsperandoFoto = false;
        estaEsperandoNombre = true;
        status = false;
    }
}

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
    if (chatId !== '573115340656@c.us') { // Exclude your own number
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
                estaEsperandoFoto = false;
                estaEsperandoNombre = true;
                status = false;
                media = await message.downloadMedia();
                guardarFoto(nombre, media, chatId);
                
                console.log(1,estaEsperandoFoto,estaEsperandoNombre);
            }
        }
    } else {
        console.log('Client: ', message.body);
    }
});

// Initialize the client
client.initialize();
