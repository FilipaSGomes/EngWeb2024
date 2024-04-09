# Criar script que faça POST de dados para a API
import correct_json
import requests
import json

def read_json_file(file_path):
    with open(file_path, 'r', encoding="utf-8") as file:
        data = json.load(file)
    return data

def load_data(data):
    
    api = 'http://localhost:3200/pessoas'
    headers = {"Content-Type": "application/json"}
    
    try:
        for item in data:
            
            # Check if the item already exists
            resp = requests.get(f"{api}/{item['_id']}", headers=headers)
            
            if resp.status_code == 200:
                # If it exists, update it
                resp = requests.put(f"{api}/{item['_id']}", json=item, headers=headers)
                if resp.status_code != 200:
                    print("Error updating item")
            else:
                # If it doesn't exist, create it
                resp = requests.post(api, json=item, headers=headers)
                if resp.status_code != 201:
                    print("Error creating item")

        print("Data loaded successfully")
            
    except requests.exceptions.HTTPError as err:
        print("Error: ", err)
    

def main():
    data = read_json_file("dataset-extra1.json")
    load_data(data)
    
    data_2 = read_json_file("dataset-extra2.json")
    load_data(data_2)
    
    data_3 = read_json_file("dataset-extra3.json")
    load_data(data_3)


if __name__ == "__main__":
    main()# Criar script que faça POST de dados para a API
