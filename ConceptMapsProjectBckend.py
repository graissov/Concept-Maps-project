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

    # return the list of areas as JSON
    return jsonify(areas)

@app.route('/objects', methods=['GET', 'POST'])
def get_objects():
    area = request.args.get('area')

    # connect to the database
    cnx = mysql.connector.connect(user='root', password='',
                                  host='127.0.0.1', database='concept_maps')
    cursor = cnx.cursor()


    # execute the SQL query to retrieve the list of objects for the selected area
    query = ("SELECT * FROM objects WHERE area = %s")
    cursor.execute(query, (area,))
    print("here is the curosr:")
    print(cursor)

    # retrieve the results and create a list of objects
    objects = []
    for (id, parent_id, title, areas, related_concepts) in cursor:
        obj = {"id": id, "parent_id": parent_id, "title": title, "info": "some info"}
        objects.append(obj)

    # close the database connection
    cursor.close()
    cnx.close()

    # return the list of objects as JSON
    return jsonify(objects)


#running the app
if __name__ == '__main__':
    app.run(debug=True)

    