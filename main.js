const fs = require('fs');
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const path = require('path');
const { exec } = require('child_process'); // Usar cmd  
const venvPath = path.join(__dirname, '.venv', 'Scripts', 'python.exe'); //Es para ejecutar con determinado venv
const scriptPath = path.join(__dirname, 'saveFace.py');
const scriptPatheliminate = path.join(__dirname, 'delete_users.py');
const command = `${venvPath} ${scriptPath}`;
const command_delete = `${venvPath} ${scriptPatheliminate}`;
const directoryPath = './unknown_faces';
const number = "3002091849";
const usuario_number = `57${number}@c.us`;
const watchFolder = 'unknown_faces'; // Ruta de la carpeta a observar
var status_alert = false;
// 2. Manejar los datos JSON
var jsonFilePath = path.resolve(__dirname, 'userData.json');
// Leer datos existentes o inicializar si el archivo no existe
var userData = { users: [] };
if (fs.existsSync(jsonFilePath)) {
    userData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));
}
if (fs.existsSync(directoryPath)) {
    // Get the list of files in the directory
    const files = fs.readdirSync(directoryPath);
  
    // Delete each file in the directory
    for (const file of files) {
      const filePath = `${directoryPath}/${file}`;
      fs.unlinkSync(filePath);
      console.log(`Archivo eliminado: ${filePath}`);
    }}
    async function sendImage(imageUnknownPath) {
        const imageMedia = MessageMedia.fromFilePath(imageUnknownPath);
        try {
            await client.sendMessage(usuario_number, imageMedia);
            console.log('Image sent successfully!');
        } catch (error) {
            console.error('Error sending image:', error);
        }
    }
    
    fs.watch(watchFolder, (eventType, filename) => {
        if (eventType === 'rename' && filename) {
            status_alert = true;
            var imageUnknownPath = `./${watchFolder}/${filename}`;
            console.log(status_alert);
            console.log(imageUnknownPath);
    
            // Usar setTimeout para retrasar la ejecución de sendImage
            setTimeout(() => {
                sendImage(imageUnknownPath)
                    .then(() => {
                        console.log('Image sent successfully!');
                        status_alert = false;
                    })
                    .catch(err => {
                        console.error('Error sending image:', err);
                    });
            }, 500); // 500ms delay
        }
    });
    
register_names = userData.users;
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
function mostrar_historial(chatId,selectedUser){
    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo JSON:', err);
            return;
        }
    
        try {
            const userData = JSON.parse(data);
            let userFound = false; // Variable para indicar si se encontró al usuario
    
            for (let i = 0; i < userData.users.length; i++) {
                if (userData.users[i].name === selectedUser) {
                    client.sendMessage(chatId,`\nEntradas de ${selectedUser}:`);
                    for (let j = 0; j < userData.users[i].history.length; j++) {
                        const date = new Date(userData.users[i].history[j]);
                        const formattedDate = `- ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} a las ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
                        console.log(formattedDate);
                        client.sendMessage(chatId, formattedDate);
                    }
                    userFound = true; // Marcar que se encontró al usuario
                    break; // Salir del bucle una vez que se encuentra al usuario
                }
            }
    
            if (!userFound) {  // Comprobar si se encontró al usuario después del bucle
                client.searchMessages(chatId,`No se encontró el usuario "${selectedUser}"`);
            }
        } catch (parseError) {
            console.error('Error al analizar el JSON:', parseError);
        }
    });
    
}
function solicitarFoto(chatId) {
    client.sendMessage(chatId, '¡Ahora envíame una foto de tu cara!');
}
function eliminar(chatId, nombreRecibido){
    console.log("Eliminar    ", nombreRecibido);
    fs.writeFile('eliminar.txt', nombreRecibido, (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log('Archivo creado exitosamente!');
        }
    });
    exec(command_delete, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error al ejecutar el script de Python: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`Error en el script de Python: ${stderr}`);
          return;
        }
        console.log(`Salida del script de Python: ${stdout}`);
      });
}
function guardarFoto(nombreFoto, media, chatId) {
    if (media) {
        try {
            // 1. Guardar la imagen en el sistema de archivos
            var base64Image = media.data;
            nombreFoto.replace(" ", "_"); // No sirve
            console.log(nombreFoto);
            var fileName = nombreFoto + '.jpg';
            var imagePath = path.resolve(__dirname, 'fotos', fileName);
            fs.writeFileSync(imagePath, base64Image, 'base64');
                userData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));
            // Agregar nuevos datos de usuario
            var newUserData = {
                name: nombreFoto,
                photoFile: imagePath,
                history: [],
                encoding : null,
            };
            userData.users.push(newUserData);

            // Escribir datos actualizados de vuelta al archivo JSON
            fs.writeFileSync(jsonFilePath, JSON.stringify(userData, null, 2));
            console.log('Foto y datos guardados:', fileName);
            client.sendMessage(chatId,'¡Foto guardada correctamente!');
            exec(command, (error, stdout, stderr) => {
                if (error) {
                  console.error(`Error al ejecutar el script de Python: ${error.message}`);
                  return;
                }
                if (stderr) {
                  console.error(`Error en el script de Python: ${stderr}`);
                  return;
                }
                console.log(`Salida del script de Python: ${stdout}`);
              });
        } catch (error) {
            console.error('Error al guardar la foto o los datos:', error);
            client.sendMessage(chatId, '¡Hubo un error al procesar tu foto! Por favor, intenta de nuevo.');
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
let status_delete = false;
let status_history = false;
let estaEsperandoFoto = false;
let estaEsperandoNombre = true;
// Event listeners
client.once('ready', () => {
    console.log('Client is ready!');
    
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});
// write print
client.on('message_create', async (message) => {
    const chatId = message.from;
    if (chatId == usuario_number) { // Exclude your own number
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
                    await message.reply('¡Este es un bot de ayuda! Puedes pedir ayuda sobre diferentes temas.\nEscribe "!" Para iniciar un comando\nComandos Disponibles: \nayuda\ncrear\nhistorial\neliminar');
                    break;
                case 'historial':
                    client.sendMessage(chatId, "Cual de los siguientes ver su historial de entrada?");
                    status_history = true;
                    register_names = userData.users;
                    register_names.forEach(user => {
                        client.sendMessage(chatId, user.name);
                        });
                    break;
                case 'eliminar':
                    client.sendMessage(chatId, "Cual de los siguientes usuarios quiere eliminar?");
                    status_delete = true;
                    register_names = userData.users;
                    register_names.forEach(user => {
                        client.sendMessage(chatId, user.name);
                        });
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
        if (status_delete == true && message.body.startsWith('!') == false){
            eliminar(chatId, message.body);
            status_delete == false;
        }
        if (status_history == true && message.body.startsWith('!') == false){
            mostrar_historial(chatId, message.body);
            status_delete == false;
        }
    } else {
        console.log('Client: ', message.body);
    }
    
});

  
// Initialize the client
client.initialize();
