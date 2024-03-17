import json
from math import e
import os

# Read the JSON file
def read_json(file_path):
    try:
        with open(file_path, 'r') as file:
            data = json.load(file)
            if isinstance(data, list):  # Check if the top-level object is a list
                composers = data
            elif isinstance(data, dict) and 'compositores' in data:  # Check if the top-level object is a dictionary containing a 'compositores' key
                composers = data['compositores']
            else:
                print("Invalid JSON structure: No 'compositores' key or invalid format")
                return []
            
            valid_entries = []
            for entry in composers:
                if all(key in entry for key in ["id", "nome", "bio", "dataNasc", "dataObito", "periodo"]):
                    valid_entries.append(entry)
                else:
                    print("Invalid entry:", entry)  # Print invalid entries
            return valid_entries
    except FileNotFoundError:
        print("File not found")
        return []
    except json.JSONDecodeError:
        print("Invalid JSON file")
        return []

# Group composers by period
def group_composers_by_period(composers):
    composers_by_period = {}
    for entry in composers:
        comp = {entry["id"]: entry["nome"]}
        period = entry["periodo"]
        if period not in composers_by_period:
            composers_by_period[period] = []
        composers_by_period[period].append(comp)
    return composers_by_period

def period_name(composers):
    a = group_composers_by_period(composers)
    gs = []
    id_ = 0
    for i in a:
        b = []
        id_ += 1
        n_id_ = "P" + str(id_)
        for c in a[i]:
            b.append(c)
        gs.append({"id" : n_id_, "nome" : i, "compositores": b})
    return gs

# Write the output data to the file
def write_json(composers, directory):
    output_data = {
        "periodos": period_name(composers),
        "compositores": composers
    }
    output_file = os.path.join(directory, 'periodos_compositores.json')

    # Write the output data to the file
    with open(output_file, 'w') as f:
        json.dump(output_data, f, indent=4)

# Read composers from the file
composers = read_json('compositores.json')


# Specify the directory for the output file (relative to the script directory)
script_dir = os.path.dirname(os.path.abspath(__file__))
output_directory = os.path.join(script_dir, '')
print(output_directory)
# Write data to JSON file in the specified directory
write_json(composers, output_directory)
