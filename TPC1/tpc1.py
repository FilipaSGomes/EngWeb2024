import os
import re
import xml.etree.ElementTree as ET
from os.path import isfile

from arrow import get

html = """
<!DOCTYPE html>
<html lang="pt-PT">
<head>
    <link rel="stylesheet" href="styles.css">
    <title>Ruas de Braga</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
"""

template = """
<!DOCTYPE html>
<html lang="pt-PT">
<head>
    <link rel="stylesheet" href="styles.css">
    <title>Ruas de Braga</title>
    <meta charset="utf-8">
</head>
<body>
"""

# Path to the directory containing the XML files
directory_path = "TPC1/MapaRuas-materialBase/texto"

# Initialize a set to store unique street names
street_names = []

html += "<h1>Ruas de Braga</h1>"

# File Names
f = []

def houses_to_html(houses):
    for casa in root.findall('.//casa'):
        house_number_element = casa.find('número')
        enfiteuta_element = casa.find('enfiteuta')
        foro_element = casa.find('foro')
        description = []
        for desc in casa.findall('desc'):
            paragraphs_to_html(description, desc)
        
        # Check if elements are found before accessing their .text attribute
        house_number = house_number_element.text if house_number_element is not None else ''
        enfiteuta = enfiteuta_element.text if enfiteuta_element is not None else ''
        foro = foro_element.text if foro_element is not None else ''
        
        houses.append((house_number, enfiteuta, foro, description))

def figures_to_html(figures):
    for figura in root.findall('.//figura'):
        image_path_element = figura.find('imagem')
        caption_element = figura.find('legenda')
        
        # Check if elements are found before accessing their attributes or text
        if image_path_element is not None: 
            image_path = ((image_path_element.attrib.get('path', '')).replace('..', '../MapaRuas-materialBase')) if image_path_element.attrib else ''
            temp = image_path.replace('../MapaRuas-materialBase', 'TPC1/MapaRuas-materialBase')
            if not isfile(temp):
                if image_path.endswith('.jpg') or image_path.endswith('.png'):
                    image_path = image_path.replace('.jpg', '.JPG')
                    image_path = image_path.replace('.png', '.PNG')
                else:
                    image_path = image_path.replace('.JPG', '.jpg')
                    image_path = image_path.replace('.PNG', '.png')          
        else: 
            image_path = ''
        
        if caption_element is not None:
            caption = caption_element.text.strip() if caption_element.text else ''
        else:
            caption = ''
        
        figures.append((image_path, caption))
        
def paragraphs_to_html(paragraphs, para):
    # Initialize a variable to store the concatenated text content
    para_text = ''
    
    # Iterate through all child elements of the 'para' element
    for elem in para.iter():
        # Check if the element has text content
        if elem.text:
            # Append the text content to the 'para_text' variable
            para_text += elem.text
        
        # Check if the element has tail content
        if elem.tail:
            # Append the tail content to the 'para_text' variable
            para_text += elem.tail
    
    # Append the concatenated text to the 'paragraphs' list
    paragraphs.append(para_text)
    

# Iterate through all files in the directory
for filename in os.listdir(directory_path):
    if filename.endswith(".xml"):
        html_file = open(f"TPC1/html/{filename.replace('.xml', '.html')}", "w", encoding="utf-8")
        f.append(filename.replace('.xml', '.html'))
        street_file = open(f"{directory_path}/{filename}", "r", encoding="utf-8")
        
        # Parse the XML file
        tree = ET.parse(street_file)
        root = tree.getroot()

        name_value = ""
        # Find the 'nome' field
        for meta in root.findall('.//meta'):
            name = meta.find('nome')
            if name is not None:
                name_value = name.text
                street_names.append(name_value)
        
        # Extract information from 'para' elements
        paragraphs = []
        for para in root.findall('corpo/para'):
            paragraphs_to_html(paragraphs, para)
        # Now 'paragraphs' list contains the entire content within each 'para' tag, preserving spaces between elements

        # Extract information from 'figura' elements
        figures = []
        figures_to_html(figures)
        
        # Extract information from 'casa' elements
        houses = []
        houses_to_html(houses)
        
        street_t = template
        
        # Name of the Street
        street_t += f"<h1>{name_value}</h1>\n"
        
        # Images
        for image_path, caption in figures:
            street_t += f'<figure class="figure"><img class="image" src="{image_path}" alt="{caption}"><figcaption>{caption}</figcaption></figure>\n'
        
        # Info about the street
        street_t += "<h2>Descrição</h2>\n"
        for paragraph in paragraphs:
            street_t += f"<p>{paragraph}</p>\n"
        
        # Houses (Table)
        street_t += "<h2>Casas</h2>\n"
        street_t += "<table>"
        street_t += "<tr><th>Número</th><th>Enfiteuta</th><th>Foro</th><th>Descrição</th></tr>\n"
        for house_number, enfiteuta, foro, description in houses:
            street_t += f"<tr><td>{house_number}</td><td>{enfiteuta}</td><td>{foro}</td><td>"
            for d in description:
                street_t += f"<p>{d}</p>"
            street_t += "</td></tr>\n"
        street_t += "</table>\n"

        
        street_t += '<h4><a href="streets.html">Voltar</a></h4>\n'
        
        html_file.write(street_t)
        html_file.close()
    

html += "<ul>"

for name, fs in zip(street_names, f):
    html += f'<li><a href="{fs}">{name}</a></li>\n'
    
html += "</ul>"

html += "</body>"

ficheiroHTML = open("TPC1/html/streets.html", "w", encoding="utf-8")
ficheiroHTML.write(html)
ficheiroHTML.close()

#To view in browser
    
    
