import face_recognition
import cv2
import numpy as np
import json
# Ruta al archivo JSON
json_file_path = 'userData.json'

# Cargar el archivo JSON
with open(json_file_path, 'r') as file:
    data = json.load(file)

# Función para encontrar y devolver el encoding de un usuario específico


def get_user_encoding(data, user_name):
    for user in data['users']:
        if user['name'] == user_name:
            return user['encoding']
    return None

# Función para modificar el encoding de un usuario específico


def set_user_encoding(data, user_name, new_encoding):
    for user in data['users']:
        if user['name'] == user_name:
            user['encoding'] = new_encoding
            return True
    return False


print("El archivo JSON ha sido actualizado.")
image = face_recognition.load_load_image_file(f"./fotos/{path}")
image_face_encoding = face_recognition.face_encodings(image)[0]
archivo = path.replace(".jpg", "")
encoding_path = f'./encodings/{archivo}.txt'
with open(encoding_path, 'a') as archivo:
    # Añadir el contenido adicional en el archivo
    archivo.write(image_face_encoding)
# Modificar el encoding de Camilo
set_user_encoding(data, archivo, encoding_path)

# Verificar el cambio
encoding_camilo = get_user_encoding(data, "Camilo")
print(f"Nuevo encoding de Camilo: {encoding_camilo}")

# Guardar los cambios en el archivo JSON
with open(json_file_path, 'w') as file:
    json.dump(data, file, indent=4)
