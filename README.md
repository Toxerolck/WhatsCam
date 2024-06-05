# WhatsCam

[![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)](https://www.python.org/)
[![OpenCV](https://img.shields.io/badge/opencv-%23white.svg?style=for-the-badge&logo=opencv&logoColor=blue)](https://opencv.org/)
[![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![WhatsApp Web JS](https://img.shields.io/badge/whatsapp--web.js-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://github.com/pedroslopez/whatsapp-web.js/)
[![NumPy](https://img.shields.io/badge/numpy-%23013243.svg?style=for-the-badge&logo=numpy&logoColor=white)](https://numpy.org/)
[![CMake](https://img.shields.io/badge/cmake-%23064F8C.svg?style=for-the-badge&logo=cmake&logoColor=white)](https://cmake.org/)

WhatsCam es una aplicación innovadora que combina el poder de la visión por computadora con la comodidad de WhatsApp.

## Características principales

- **Captura de imágenes y video:** Utiliza tu cámara web para tomar fotos WhatsApp.
- **Procesamiento de imágenes:** Aplica filtros, efectos y transformaciones a tus imágenes en tiempo real.
- **Reconocimiento de objetos:** Detecta y clasifica personas en tiempo real.
- **Integración con WhatsApp:** Comparte tus creaciones directamente en tus chats de WhatsApp.

## Cómo funciona

WhatsCam utiliza una combinación de Python, OpenCV y Node.js para capturar, procesar y enviar imágenes y videos a través de la API de WhatsApp Web. NumPy se utiliza para el procesamiento numérico de imágenes, y CMake para la gestión del proyecto.

## Archivos principales

## app.py: Reconocimiento Facial y Validación en Tiempo Real

Este script es el núcleo del sistema de reconocimiento facial de WhatsCam.

### Funcionalidades

- **Carga de datos de entrenamiento**:

  - Lee codificaciones faciales (embeddings) y nombres desde `userData.json`.
  - Maneja errores si no se encuentran los archivos de codificación.

- **Captura de video en tiempo real**:

  - Inicia la captura desde la cámara web predeterminada.

- **Preprocesamiento de cuadros**:

  - Procesa cuadros alternos para eficiencia.
  - Reduce el tamaño de los cuadros.
  - Convierte de BGR (OpenCV) a RGB (face_recognition).

- **Detección y reconocimiento**:

  - Localiza rostros en los cuadros usando `face_recognition`.
  - Calcula embeddings para cada rostro.
  - Compara embeddings detectados con los conocidos, usando tolerancia.

- **Validación de identidad**:

  - Inicia temporizador si hay coincidencia.
  - Valida identidad tras `validation_time_limit` segundos.
  - Registra nombre y marca de tiempo en `userData.json`.

- **Manejo de desconocidos**:

  - Considera rostros sin coincidencia como desconocidos.
  - Captura y guarda imagen tras `validation_time_limit` segundos.

- **Visualización**:

  - Dibuja rectángulos y nombres en la transmisión de video.

- **Finalización**:
  - Libera la cámara y cierra ventanas al presionar 'q'.

### Configuración

- Archivo `userData.json` con embeddings y nombres de caras conocidas.
- Directorio `unknown_faces` para guardar imágenes de desconocidos.

### Uso

1. Asegúrate de tener las dependencias instaladas y el archivo `userData.json` configurado.
2. Ejecuta `app.py`.
3. La aplicación mostrará la transmisión de video con los rostros detectados y sus nombres.
4. Presiona 'q' para salir.

## delete_users.py: Eliminación de Usuarios y Archivos Asociados

Este script es una herramienta de administración para eliminar usuarios y sus datos de entrenamiento del archivo `userData.json` utilizado en el proyecto WhatsCam.

### Funcionalidades

- **Carga de datos del usuario**:

  - Lee el archivo `userData.json`, que almacena información sobre los usuarios registrados.
  - Lee el nombre del usuario a eliminar desde el archivo `eliminar.txt`.

- **Búsqueda y eliminación del usuario**:

  - Recorre la lista de usuarios en el archivo JSON.
  - Compara el nombre proporcionado con el nombre de cada usuario en el JSON.
  - Si se encuentra una coincidencia, se elimina el usuario del JSON.
  - Si no se encuentra el usuario, se muestra un mensaje de error.

- **Eliminación de archivos asociados**:

  - Intenta eliminar archivos de fotos y codificación (embeddings) asociados al usuario si existen.
  - Maneja posibles errores durante la eliminación de archivos.

- **Actualización del archivo JSON**:
  - Sobrescribe el archivo `userData.json` con los datos actualizados (sin el usuario eliminado).

### Uso

1. Asegúrate de tener instalado Python y la biblioteca `json`.
2. Ejecuta el script `delete_users.py`.
3. El script leerá el nombre del usuario a eliminar desde `eliminar.txt` y lo borrará de `userData.json`.
4. Los archivos de fotos y codificación asociados (si existen) también se eliminarán.

### Precauciones

- **Respaldo**: Es recomendable crear una copia de seguridad del archivo `userData.json` antes de ejecutar este script, ya que la eliminación de datos es permanente.
- **Dependencias**: Este script asume que el archivo `userData.json` tiene una estructura específica con una lista de usuarios y campos como `name`, `photoFile` y `encoding`. Si la estructura es diferente, es posible que debas modificar el script.

## main.js: Núcleo del Bot de WhatsApp para WhatsCam

Este script Node.js actúa como el cerebro de la aplicación WhatsCam. Controla la interacción con WhatsApp, gestiona el almacenamiento de datos de usuarios y coordina la ejecución de scripts Python para el reconocimiento facial.

### Funcionalidades Principales

- **Gestión de Archivos y Configuración**:

  - Importación de módulos: Importa las bibliotecas necesarias (`fs`, `qrcode-terminal`, `whatsapp-web.js`, `path`, `child_process`).
  - Configuración de rutas: Define rutas a archivos y scripts importantes (JSON de usuarios, scripts Python, directorio de imágenes).
  - Variables de estado: Inicializa variables para controlar el flujo de la conversación y alertas.
  - Lectura y escritura de datos JSON: Lee y actualiza un archivo JSON (`userData.json`) para almacenar información de los usuarios.

- **Envío de Imágenes**:

  - `sendImage(imageUnknownPath)`: Función asincrónica para enviar una imagen a través de WhatsApp.

- **Monitoreo de Directorio**:

  - `fs.watch(watchFolder, ...)`: Monitorea el directorio `unknown_faces` en busca de nuevos archivos de imagen. Cuando se detecta una nueva imagen, la envía por WhatsApp.

- **Configuración del Cliente de WhatsApp**:

  - `new Client(...)`: Inicializa un cliente de WhatsApp con autenticación local y caché de versión web.

- **Funciones de Interacción**:

  - `enviarMensajeInicial(chatId)`: Envía un mensaje de bienvenida inicial solicitando el nombre del usuario.
  - `guardarNombre(nombreRecibido)`: Almacena el nombre proporcionado por el usuario.
  - `solicitarFoto(chatId)`: Pide al usuario que envíe una foto de su rostro.
  - `eliminar(chatId, nombreRecibido)`: Elimina a un usuario y sus datos asociados (llama al script Python `delete_users.py`).
  - `guardarFoto(nombreFoto, media, chatId)`: Guarda la foto enviada por el usuario y llama al script Python `saveFace.py` para generar su codificación facial (embedding).
  - `mostrar_historial(chatId, selectedUser)`: Muestra el historial de entradas del usuario en el chat.

- **Manejo de Eventos**:
  - `client.once('ready', ...)`: Evento que se dispara cuando el cliente de WhatsApp está listo.
  - `client.on('qr', ...)`: Muestra un código QR para la autenticación en WhatsApp Web.
  - `client.on('message_create', ...)`: Maneja los mensajes entrantes, controlando el flujo de la conversación y llamando a las funciones de interacción correspondientes.

### Uso

1. **Configuración**: Asegúrate de tener Node.js y las dependencias instaladas (`npm install`).
2. **Ejecución**: Inicia el script con `node main.js`.
3. **Interacción**: Sigue las instrucciones en WhatsApp para registrar nuevos usuarios, eliminar usuarios, ver historiales y enviar fotos para reconocimiento facial.

### Flujo de trabajo

1. El usuario envía un comando ("!crear", "!historial", "!eliminar").
2. El bot responde con instrucciones o información relevante.
3. El usuario proporciona la información solicitada (nombre, foto, etc.).
4. El bot guarda los datos, ejecuta los scripts Python necesarios y proporciona retroalimentación al usuario.

## saveFace.py: Guardar y Actualizar Codificaciones Faciales

Este script Python es una parte esencial del sistema de registro de usuarios de WhatsCam. Su función principal es procesar nuevas imágenes de rostros, calcular sus codificaciones faciales (embeddings) y actualizar el archivo de datos `userData.json` con esta información.

### Funcionalidades

- **Carga de datos**:

  - Lee el archivo `userData.json`, que contiene información sobre los usuarios registrados, incluyendo sus nombres y (opcionalmente) rutas a fotos y codificaciones faciales.

- **Procesamiento de la última imagen**:

  - Obtiene la ruta de la última foto agregada al JSON.
  - Carga la imagen utilizando la biblioteca `face_recognition`.
  - Calcula la codificación facial (embedding) de la imagen.

- **Guardado de la codificación**:

  - Crea un archivo de texto (.txt) en el directorio `encodings` para almacenar la codificación facial.
  - El nombre del archivo se basa en el nombre del usuario, que se extrae del nombre de la foto.

- **Actualización del JSON**:
  - Actualiza el registro del usuario correspondiente en `userData.json` para incluir la ruta al archivo de codificación recién creado.
  - Utiliza un bloqueo (`threading.Lock()`) para garantizar la integridad de los datos al escribir en el archivo JSON desde múltiples hilos.

### Integración con WhatsCam

Este script está diseñado para ser ejecutado por el script principal (`main.js`) después de que un usuario envía una nueva foto de su rostro a través de WhatsApp. El flujo de trabajo es el siguiente:

1. `main.js` recibe la foto del usuario y la guarda en el sistema de archivos.
2. `main.js` llama a `saveFace.py` para procesar la foto.
3. `saveFace.py` calcula la codificación facial y actualiza `userData.json`.
4. Ahora, el sistema WhatsCam puede reconocer al usuario en futuras interacciones.

### Consideraciones

- **Estructura del JSON**: El script asume una estructura específica para `userData.json`, con una lista de usuarios que tienen campos `name`, `photoFile` y `encoding`.
- **Directorio `encodings`**: Asegúrate de tener un directorio llamado `encodings` en la misma ubicación que el script para almacenar los archivos de codificación.

## Instalación y uso

1. **Clona este repositorio:**
   ```bash
   git clone https://github.com/Toxerolck/WhatsCam
   ```
2. **Instala las dependencias de NodeJS:**
   ```bash
   npm install
   ```
3. **Crea el entorno virtual de Python:**
   ```bash
   python -m venv .venv
   ```
4. **Activa el entorno virtual de Python:**
   ```bash
   .venv\Scripts\activate
   ```
5. **Instala las dependencias de Python:**
   ```bash
   pip install -r requirements.txt
   ```

## Contribuir

¡Contribuciones son bienvenidas! Si tienes alguna idea, encuentra un error o quieres mejorar el proyecto, por favor sigue estos pasos:

1. Haz un fork del proyecto.
2. Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz commit (`git commit -m 'Agrega nueva funcionalidad'`).
4. Envía tus cambios (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para obtener más información.

## Contacto

Para cualquier consulta o sugerencia, puedes contactar al autor a través de:

- [Email](unnamedprofiletox@gmail.com)

---
