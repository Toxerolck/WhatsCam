const fs = require('fs');
const path = require('path');

// Helper functions
module.exports = {
    enviarMensajeInicial: function (chatId) {
        client.sendMessage(chatId, '¡Hola! Para empezar, dime tu nombre.');
    },

    guardarNombre: function (nombreRecibido) {
        nombre = nombreRecibido.trim();
        console.log('Nombre guardado:', nombre);
        return nombre;
    },

    solicitarFoto: function (chatId) {
        client.sendMessage(chatId, '¡Ahora envíame una foto de tu cara!');
    },

    guardarFoto: function (nombreFoto, media, chatId) {
        if (media) {
            try {
                // 1. Save the image to the filesystem
                const base64Image = media.data;
                const fileName = nombreFoto + '.jpg';
                const imagePath = path.resolve(__dirname, 'fotos', fileName);
                fs.writeFileSync(imagePath, base64Image, 'base64');

                // 2. Handle JSON data
                const jsonFilePath = path.resolve(__dirname, 'userData.json');

                // Read existing data or initialize if file doesn't exist
                let userData = { users: [] };
                if (fs.existsSync(jsonFilePath)) {
                    userData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));
                }

                // Add new user data
                const newUserData = {
                    name: nombreFoto,
                    photoFile: fileName,
                    history: [],
                };
                userData.users.push(newUserData);

                // Write updated data back to JSON file
                fs.writeFileSync(jsonFilePath, JSON.stringify(userData, null, 2));
                console.log('Foto y datos guardados:', fileName);

                // Reset conversation state for the next user

            } catch (error) {
                console.error('Error al guardar la foto o los datos:', error);
                client.sendMessage(chatId, '¡Hubo un error al procesar tu foto! Por favor, intenta de nuevo.');
                
                // Reset conversation state in case of error
                
            }
        } else {
            console.error('Error al guardar la foto: No se recibió media.');
            client.sendMessage(chatId, '¡No se recibió ninguna foto! Por favor, envía una foto de tu cara.');

            // Reset conversation state if no media is received
            estaEsperandoFoto = false;
            estaEsperandoNombre = true;
            status = false;
        }
    }
};
