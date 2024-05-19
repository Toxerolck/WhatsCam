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
const path = require('path');
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
let nombre,media;
let status = false;
let estaEsperandoFoto = false;
let estaEsperandoNombre = true;
// Function to send the initial message
function enviarMensajeInicial(chatId) {
  client.sendMessage(chatId,'¡Hola! Para empezar, dime tu nombre.');
}

// Function to save the user's name
function guardarNombre(nombreRecibido) {
  nombre = nombreRecibido.trim();
  console.log('Nombre guardado:', nombre);
  return nombre;
}

// Function to request a photo from the user
function solicitarFoto(chatId) {
  client.sendMessage(chatId,'¡Ahora envíame una foto!');
  estaEsperandoFoto = true;
  estaEsperandoNombre = false;
}

// Function to save the photo
function guardarFoto(nombreFoto,media,chatId) {
  
  if (media) {
    const base64Image = media.data;
    const fileName = nombreFoto + '.jpg';
    const rutaArchivo = path.resolve(__dirname, 'fotos', fileName);

    fs.writeFileSync(rutaArchivo, base64Image, 'base64');
    console.log('Foto guardada como:', nombreFoto + '.jpg');
    estaEsperandoFoto = false;
    estaEsperandoNombre = true;
  } else {
    console.error('Error al guardar la foto: Media is undefined.');
    client.sendMessage(chatId,'¡No se recibió ninguna foto!');
    estaEsperandoFoto = false;
    estaEsperandoNombre = true;
    
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
  const chatId = message.from;
  if(chatId !== '573013252282@c.us'){
  // Log the message content
  console.log(message.body);

  // Check if the message starts with a command prefix (e.g., "!")
  if (message.body.startsWith('!')) {
    // Extract the command from the message
    const comando = message.body.slice(1).trim().split(/ +/).shift().toLowerCase();

    // Execute actions based on the received command
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
  if (status == true && message.body.startsWith('!') == false){
    console.log(23,estaEsperandoFoto,estaEsperandoNombre);
    if(estaEsperandoNombre == true){
      nombre = guardarNombre(message.body);
      console.log(3);
      solicitarFoto(chatId);
    }else if(estaEsperandoFoto == false && message.type == 'media'){
      console.log(2);
      client.sendMessage(chatId,'Formato erronio, envía una foto.');
    }
    else if (estaEsperandoFoto == true){
      media = await message.downloadMedia();
      solicitarFoto(chatId)
      guardarFoto(nombre,media,chatId)
      console.log(1);
      status = false;
    }
  }}
});

// Start the client
client.initialize();
