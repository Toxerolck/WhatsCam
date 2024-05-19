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


// Global variables
let nombre;
let estaEsperandoNombre = true;
let estaEsperandoFoto = false;

// Function to send the initial message
function enviarMensajeInicial() {
  client.sendMessage('¡Hola! Para empezar, dime tu nombre.');
}

// Function to save the user's name
function guardarNombre(nombreRecibido) {
  nombre = nombreRecibido.trim();
  console.log('Nombre guardado:', nombre);
  estaEsperandoNombre = false;
  solicitarFoto();
}

// Function to request a photo from the user
function solicitarFoto() {
  client.sendMessage('¡Ahora envíame una foto!');
  estaEsperandoFoto = true;
}

// Function to save the photo
function guardarFoto(media, nombreFoto) {
  if (media) {
    const base64Image = media.data;
    const fileName = nombreFoto + '.jpg';
    const rutaArchivo = path.resolve(__dirname, 'fotos', fileName);

    fs.writeFileSync(rutaArchivo, base64Image, 'base64');
    console.log('Foto guardada como:', nombreFoto + '.jpg');
    estaEsperandoFoto = false;
  } else {
    console.error('Error al guardar la foto: Media is undefined.');
    client.sendMessage('[Nombre del grupo o usuario]', '¡No se recibió ninguna foto!');
    estaEsperandoFoto = false;
  }
}

// Event listener for when the client is ready
client.once('ready', () => {
  console.log('Client is ready!');
});

// Event listener for when the client receives a QR code
client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

// Event listener for incoming messages
client.on('message_create', async (message) => {
  // Log the message content
  console.log(message.body);

  // Check if the message starts with a command prefix (e.g., "!")
  if (message.body.startsWith('!')) {
    // Extract the command from the message
    const comando = message.body.slice(1).trim().split(/ +/).shift().toLowerCase();

    // Execute actions based on the received command
    switch (comando) {
      case 'crear':
        enviarMensajeInicial();

        if (message.type !== 'media') {
          client.sendMessage('[Nombre del grupo o usuario]', 'Formato erronio, envía una foto.');
        } else {
          guardarNombre(message.body);
          solicitarFoto();

          const media = await message.downloadMedia();
          guardarFoto(media, nombre);
        }

        break;
      case 'ayuda':
        await message.reply('¡Este es un bot de ayuda! Puedes pedir ayuda sobre diferentes temas.');
        break;
      default:
        await message.reply('Lo siento, no reconozco ese comando. Intenta con "!ayuda" para obtener ayuda.');
    }
  }
});

// Start the client
client.initialize();
