import face_recognition
import cv2
import numpy as np
path = "" # Debo leer el path de userData.json
image = face_recognition.load_load_image_file(f"./fotos/{path}")
image_face_encoding = face_recognition.face_encodings(image)[0]
archivo = path.replace(".jpg","")


with open(f'./encodings/{archivo}.txt', 'a') as archivo:
    # Añadir el contenido adicional en el archivo
    archivo.write(image_face_encoding)
