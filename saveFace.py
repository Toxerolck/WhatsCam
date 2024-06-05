import face_recognition
import cv2
import numpy as np
import json
import threading  # Para usar bloqueos
# Ruta al archivo JSON
json_file_path = 'userData.json'

# Cargar el archivo JSON
with open(json_file_path, 'r') as file:
    data = json.load(file)

# Función para encontrar y devolver el encoding de un usuario específico
lock = threading.Lock()


def get_user_encoding(data, user_name):
    for user in data['users']:
        if user['name'] == user_name:
            # Convertir de lista a numpy array
            return np.array(user['encoding'])
    return None

# Función para modificar el encoding de un usuario específico


def set_user_encoding(data, user_name, new_encoding):
    for user in data['users']:
        if user['name'] == user_name:
            user['encoding'] = new_encoding
            return True
    return False


path = data['users'][-1]['photoFile']  # El ultimo
image = face_recognition.load_image_file(path)
image_face_encoding = face_recognition.face_encodings(image)[0]
# Divide la ruta por '\' y toma el último elemento
nombre_archivo = path.split("\\")[-1]

# Usar el mismo nombre del archivo sin extensión para el nombre del usuario
archivo = nombre_archivo.replace(".jpg", "")
encoding_path = f'./encodings/{archivo}.txt'
with open(encoding_path, 'w') as file:
    np.savetxt(file, image_face_encoding)
print("Codigo ejecutado correctamente.")
# Guardar el encoding directamente en el JSON
set_user_encoding(data, archivo, encoding_path)

# Verificar el cambio (convertir de nuevo a numpy array para compararlo)
encoding_archivo = np.array(get_user_encoding(data, archivo))
print(f"Nuevo encoding de {archivo}: {encoding_archivo}")

# Guardar los cambios en el archivo JSON
with lock:  # Adquirir el bloqueo antes de modificar el JSON
    with open(json_file_path, 'r') as file:
        data = json.load(file)

    set_user_encoding(data, archivo, encoding_path)

    with open(json_file_path, 'w') as file:
        json.dump(data, file, indent=4)
print("Codigo ejecutado correctamente.")
