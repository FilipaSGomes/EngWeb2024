import json

def read_json(file_):
    save = []
    try:
        with open(file_, 'r') as file:
            # Read the contents of the file
            json_data = file.readlines()
            json_data = ','.join(json_data)

            try:
                # Fix syntax errors here, for example, replacing single quotes with double quotes
                corrected_json = '{"movies":[' + json_data + ']}'
                data = json.loads(corrected_json)
                movies = data.get('movies', [])  # Retrieve the list of movies, if present, else empty list
                for entry in movies:
                    if "title" not in entry:
                        entry["title"] = None
                    if "year" not in entry:
                        entry["year"] = None
                    if "cast" not in entry:
                        entry["cast"] = None
                    if "genres" not in entry:
                        entry["genres"] = None
                print("Syntax errors in JSON file have been corrected.")
                return data
            except ValueError:
                print(f"Failed to correct syntax errors in JSON file.")
                return None
    
    except FileNotFoundError:
        print(f'File JSON not found!')
    except Exception as e:
        print(f'Error: {e}')

db = read_json('filmes.json')

f = open('filmes_new.json', 'w')
json.dump(db, f, indent=4)
f.close()