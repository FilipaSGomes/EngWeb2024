import json

def trade_id_cc_bi(data):
    i = 0
    for item in data:
        if "CC" in item and item["CC"] != "":
            item["_id"] = item["CC"]
            del item["CC"]
        elif "BI" in item and item["BI"] != "":
            item["_id"] = item["BI"]
            del item["BI"]
        elif "_id" in item and item["_id"] != "":
            pass            
        else:
            i += 1
            item["_id"] = str(i)
        
    return data

def read_json_file(file_path):
    with open(file_path, 'r', encoding="utf-8") as file:
        data = json.load(file)
    return data

def corrected_json_file(file_path):
    r_data = read_json_file(file_path)
    if "pessoas" in r_data:
        data = r_data["pessoas"]
    else:
        data = r_data
    if "__v" in data:
        del data["__v"]
    new_data = trade_id_cc_bi(data)
    with open(file_path, 'w', encoding="utf-8") as file:
        json.dump(new_data, file, ensure_ascii=False, indent=4)


def group_people_by_sport(data):
    people_by_sport = {}
    
    for person in data:
        person_id = person['_id']
        person_name = person['nome']
        sports = person['desportos']
        
        for sport in sports:
            # Capitalize each word in the sport name
            words = sport.split()
            capitalized_words = [word.capitalize() for word in words]
            result = ' '.join(capitalized_words)
            
            # Use the modified sport name as the key
            if result not in people_by_sport:
                people_by_sport[result] = []
            people_by_sport[result].append({'_id': person_id, 'nome': person_name})
        
    # Sort sports alphabetically
    sorted_sports = sorted(people_by_sport.keys())
    
    # Return the result as a list of dictionaries
    return [{'nome': sport, 'atletas': people_by_sport[sport]} for sport in sorted_sports]



def desportos_json_file(file_path):
    data = read_json_file(file_path)
    new_data = group_people_by_sport(data)
    with open("modalidades.json", 'w', encoding="utf-8") as file:
        json.dump(new_data, file, ensure_ascii=False, indent=4)

# Correct JSON files
corrected_json_file("dataset.json")
corrected_json_file("dataset-extra1.json")
corrected_json_file("dataset-extra2.json")
corrected_json_file("dataset-extra3.json")

# Generate modalidades.json
desportos_json_file("dataset.json")
