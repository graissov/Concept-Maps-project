from flask import Flask, request, render_template, jsonify
import json
from flask_cors import CORS
from flask_mysqldb import MySQL
import mysql.connector


app = Flask(__name__)

#Creating a connection cursor
CORS(app)

@app.route('/areas', methods=['GET', 'POST'])
def get_areas():
    # connect to the database
    cnx = mysql.connector.connect(user='root', password='',
                                  host='127.0.0.1', database='concept_maps')
    cursor = cnx.cursor()

    # execute the SQL query to retrieve the list of areas
    query = ("SELECT DISTINCT area FROM objects")
    cursor.execute(query)

    # retrieve the results and create a list of areas
    areas = [area[0] for area in cursor]

    # close the database connection
    cursor.close()
    cnx.close()

@app.route('/objects', methods=['GET', 'POST'])
def get_objects():

    # connect to the database
    cnx = mysql.connector.connect(user='root', password='',
                                  host='127.0.0.1', database='concept_maps')
    cursor = cnx.cursor()


    # execute the SQL query to retrieve the list of objects for the selected area
    query = ("SELECT * FROM objects")
    cursor.execute(query)
    print("here is the curosr:")
    print(cursor)

    # retrieve the results and create a list of objects
    objects = []
    for (id, parent_id, title, areas, related_concepts) in cursor:
        related_concepts = related_concepts.split(",")
        obj = {"id": id, "parent_id": parent_id, "title": title, "info": "some info", "related_concepts":related_concepts}
        objects.append(obj)

    # close the database connection
    cursor.close()
    cnx.close()

    # return the list of objects as JSON
    return jsonify(objects)


@app.route('/submit', methods=['POST'])
def submit():
    # ADD uniqueness check
    input1 = request.form['input1']
    input2 = request.form['input2']
    input3 = request.form.getlist('selected_options[]')
        

    print("hello",",".join(input3))

    # connect to the database
    cnx = mysql.connector.connect(user='root', password='',
                                  host='127.0.0.1', database='concept_maps')
    cursor = cnx.cursor()
    for concept in input3:
        # Execute the select query
        select_query = "SELECT related_concepts FROM objects WHERE title = '"+concept+"'"
        cursor.execute(select_query)

        # Retrieve the result
        result = cursor.fetchone()

        # Extract the related_concepts value
        related_concepts = result[0] if result else None
        print("Related Concepts:", related_concepts)
        if related_concepts == "":
            related_concepts = input1
        else:
            related_concepts = related_concepts + "," + input1

        # Execute the update query
        update_query = "UPDATE objects SET related_concepts = '"+related_concepts +"' WHERE title = '"+concept+"'"
        cursor.execute(update_query)
        cnx.commit()




    insert_query = "INSERT INTO objects (title, related_concepts) VALUES (%s, %s)"
    values = (input1,",".join(input3),)
    cursor.execute(insert_query, values)
    cnx.commit()
    cnx.close()

    return 'Form submitted successfully!'


# Function to retrieve unique titles from the objects table
def get_unique_titles():
    cnx = mysql.connector.connect(user='root', password='',
                                  host='127.0.0.1', database='concept_maps')
    cursor = cnx.cursor()

    query = "SELECT DISTINCT title FROM objects"
    cursor.execute(query)
    result = [title[0] for title in cursor.fetchall()]

    cnx.close()

    return result

@app.route('/titles', methods=['GET'])
def titles():
    unique_titles = get_unique_titles()
    return jsonify(unique_titles)

if __name__ == '__main__':
    app.run()

#running the app
if __name__ == '__main__':
    app.run(debug=True)

    