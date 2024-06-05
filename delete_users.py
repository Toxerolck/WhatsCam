import json
import os
# Load data from JSON file
with open('userData.json', 'r') as f:
    data = json.load(f)
with open('eliminar.txt', 'r') as f:
    name = f.read()
name = "Donald Trump"
def delete_user(name):
    # Access the 'users' list using a dictionary key
    users = data.get('users')  # Use .get() for safer access

    if users is None:  # Check if 'users' key exists
        print("Error: 'users' key not found in JSON data.")
        return

    for i, user in enumerate(users):
        if user['name'] == name:
            del users[i]
            print(f'User "{name}" deleted.')

            # Delete associated files (if paths exist)
            try:
                if user.get('photoFile'):
                    photo_path = user['photoFile']
                    if os.path.exists(photo_path):
                        os.remove(photo_path)
                        print(f'Photo file "{photo_path}" deleted.')

                if user.get('encoding'):
                    encoding_path = user['encoding']
                    if os.path.exists(encoding_path):
                        os.remove(encoding_path)
                        print(f'Encoding file "{encoding_path}" deleted.')
            except Exception as e:  # Handle potential file deletion errors
                print(f"Error deleting associated files: {e}")

            return  # Move the return statement here

    print(f'User "{name}" not found in JSON data.')


# Example usage

delete_user(name)
with open('userData.json', 'w') as f:
    json.dump(data, f, indent=4)  # Uncomment if needed
