from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS
import datetime

app = Flask(__name__)
CORS(app)

# MySQL configuration
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'Hadhi202@'
app.config['MYSQL_DB'] = 'job_tracker'

mysql = MySQL(app)

# Route to fetch all job applications
@app.route('/jobs', methods=['GET'])
def get_jobs():
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM jobs")
    rows = cur.fetchall()
    cur.close()

    jobs = []
    for row in rows:
        jobs.append({
            'id': row[0],
            'company_name': row[1],
            'role': row[2],
            'application_status': row[3],
            'follow_up_date': row[4],
            'created_at': row[5]
        })
    return jsonify(jobs)

# Route to add a new job
@app.route('/jobs', methods=['POST'])
def add_job():
    data = request.json
    company_name = data['company_name']
    role = data['role']
    status = data['application_status']
    follow_up_date = data['follow_up_date']

    cur = mysql.connection.cursor()
    cur.execute(
        "INSERT INTO jobs (company_name, role, application_status, follow_up_date) VALUES (%s, %s, %s, %s)",
        (company_name, role, status, follow_up_date))
    mysql.connection.commit()
    cur.close()

    return jsonify({'message': 'Job added successfully!'})

# Route to delete a job
@app.route('/jobs/<int:job_id>', methods=['DELETE'])
def delete_job(job_id):
    cur = mysql.connection.cursor()
    cur.execute("DELETE FROM jobs WHERE id = %s", [job_id])
    mysql.connection.commit()
    cur.close()

    return jsonify({'message': 'Job deleted successfully!'})

if __name__ == '__main__':
    app.run(debug=True)
