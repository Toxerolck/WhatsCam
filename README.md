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

### `main.js`
El archivo central del bot de WhatsApp. Sus funciones incluyen:
- Crear y eliminar usuarios en un archivo `.JSON`.
- Leer el historial de entrada de cada persona.
- Emular un navegador accediendo a [WhatsApp Web](https://web.whatsapp.com/).
- Generar un código QR que se muestra en la terminal.
- Guardar la sesión para evitar escaneos repetidos del código QR.

### `saveFace.py`
Este script:
- Lee el archivo JSON y crea un archivo `.txt` con información útil para el reconocimiento facial.
- Modifica el archivo JSON para guardar la ruta del encoding de la cara.

### `app.py`
El archivo principal para el reconocimiento facial. Sus tareas incluyen:
- Usar OpenCV para abrir una ventana que utiliza la cámara del sistema.
- Leer los encodings creados por `saveFace.py` y compararlos con los frames de la cámara.
- Verificar la identidad de la persona.

## Instalación y uso

1. **Clona este repositorio:**
   ```bash
   git clone https://github.com/Toxerolck/wb.git
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

- [Email](unnamedprofiletox@example.com)

---
