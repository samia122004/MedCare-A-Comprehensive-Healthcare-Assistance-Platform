from flask import Flask, render_template, request, redirect, url_for
from werkzeug.security import generate_password_hash
import pymongo

app = Flask(__name__)

client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client['userDB']
users = db['users']

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        # Get the form data
        name = request.form['name']
        email = request.form['email']
        password = request.form['password']

        # Hash the password before storing it
        hashed_password = generate_password_hash(password)

        # Create the user document
        user = {
            'name': name,
            'email': email,
            'password': hashed_password
        }

        if users.find_one({'email': email}):
            return "User already exists!"


        # Insert the user into the database
        users.insert_one(user)
        return redirect(url_for('success'))
    return render_template('register.html')

@app.route('/success')
def success():
    return 'Registration successful!'

if __name__ == '__main__':
    app.run(debug=True)
