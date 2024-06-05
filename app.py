import face_recognition
import cv2
import numpy as np
import json
import dlib
import os
import time
from datetime import datetime
# Define validation time limit (in seconds)
validation_time_limit = 5

# Ruta al archivo JSON (replace with your actual path)
json_file_path = 'userData.json'

# Load known encodings from the JSON
known_face_encodings = []
known_face_names = []

with open(json_file_path, 'r') as file:
    data = json.load(file)
    for user in data['users']:
        known_face_names.append(user['name'])
        encoding_path = user['encoding']
        try:
            encoding = np.loadtxt(encoding_path)
        except FileNotFoundError:
            print(
                f"Error: No se encontró el archivo de encoding para {user['name']}: {encoding_path}")
        else:
            known_face_encodings.append(encoding)

# Initialize video capture
video_capture = cv2.VideoCapture(0)

# Variables for processing frames
face_locations = []
face_encodings = []
face_names = []
process_this_frame = True
start_time = None  # Initialize start time for validation
unknown_count = 0  # Counter for unknown faces
start_time_unknown = None
# Define directory to save unknown face images
unknown_face_dir = 'unknown_faces'
if not os.path.exists(unknown_face_dir):
    os.makedirs(unknown_face_dir)

while True:
    # Grab a single frame of video
    ret, frame = video_capture.read()

    # Only process every other frame of video to save time
    if process_this_frame:
        # Resize frame to 1/4 size for faster processing
        small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)

        # Convert BGR to RGB color
        rgb_small_frame = np.ascontiguousarray(small_frame[:, :, ::-1])

        # Find faces and encodings in the frame
        face_locations = face_recognition.face_locations(rgb_small_frame)
        face_encodings = face_recognition.face_encodings(
            rgb_small_frame, face_locations)

        face_names = []
        for face_encoding in face_encodings:
            # Check for known faces with some tolerance for distance
            matches = face_recognition.compare_faces(
                known_face_encodings, face_encoding, tolerance=0.6)
            name = "Unknown"

            if True in matches:
                start_time_unknown = None
                # Check validation time
                if start_time is None:
                    start_time = time.time()  # Start timer on first match

                # Check if validation time limit is reached
                elapsed_time = time.time() - start_time
                if elapsed_time >= validation_time_limit:
                    name = known_face_names[matches.index(True)]  
                    print("Face successfully validated!")

                    # Update JSON with validation timestamp
                    with open(json_file_path, 'r') as file:
                        data = json.load(file)
                    for user in data['users']:
                        if user['name'] == name:
                            user['history'].append(datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
                            break
                    with open(json_file_path, 'w') as file:
                        json.dump(data, file, indent=4)
                    print(f"Timestamp added to history for {name}")
                    start_time = None  # Reset timer for next validation
                else:
                    # Update name with the first matched person (consider confidence levels for multiple matches)
                    first_match_index = matches.index(True)
                    name = known_face_names[first_match_index]
                    face_names.append(name)

            else:
                start_time = None
                if start_time_unknown is None:
                    start_time_unknown = time.time()  # Start timer on first match
                elapsed_time_unknown = time.time() - start_time_unknown
                # Capture and save photo of unknown face
                if elapsed_time_unknown >= validation_time_limit:
                    unknown_count += 1
                    filename = f"unknown_{unknown_count}.jpg"
                    cv2.imwrite(os.path.join(unknown_face_dir, filename), frame)
                    print(f"Unknown face captured and saved as {filename}")
                    start_time_unknown = None

            face_names.append(name)

    process_this_frame = not process_this_frame

    # Display results
    for (top, right, bottom, left), name in zip(face_locations, face_names):
        # Scale back up face locations
        top *= 4
        right *= 4
        bottom *= 4
        left *= 4

        # Draw face rectangle and label
        cv2.rectangle(frame, (left, top), (right, bottom), (0, 0, 255), 2)
        cv2.rectangle(frame, (left, bottom - 35),
                      (right, bottom), (0, 0, 255), cv2.FILLED)
        font = cv2.FONT_HERSHEY_DUPLEX
        cv2.putText(frame, name, (left + 6, bottom - 6),
                    font, 1.0, (255, 255, 255), 1)

    # Display the frame
    cv2.imshow('Video', frame)

    # Quit on 'q' key press
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release resources
video_capture.release()
cv2.destroyAllWindows()