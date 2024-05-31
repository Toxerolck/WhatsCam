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
            return np.array(user['encoding']) # Convertir de lista a numpy array
    return None

# Función para modificar el encoding de un usuario específico
def set_user_encoding(data, user_name, new_encoding):
    for user in data['users']:
        if user['name'] == user_name:
            user['encoding'] = new_encoding.tolist() # Convertir a lista
            return True
    return False

print("El archivo JSON ha sido actualizado.")
image = face_recognition.load_image_file(f"./fotos/{path}")
image_face_encoding = face_recognition.face_encodings(image)[0]

# Usar el mismo nombre del archivo sin extensión para el nombre del usuario
archivo = path.replace(".jpg", "")  

# Guardar el encoding directamente en el JSON
set_user_encoding(data, archivo, image_face_encoding)

# Verificar el cambio (convertir de nuevo a numpy array para compararlo)
encoding_archivo = np.array(get_user_encoding(data, archivo)) 
print(f"Nuevo encoding de {archivo}: {encoding_archivo}")

# Guardar los cambios en el archivo JSON
with open(json_file_path, 'w') as file:
    json.dump(data, file, indent=4)
print("Codigo ejecutado correctamente.")
