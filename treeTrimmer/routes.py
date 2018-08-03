from treeTrimmer import app
from flask import render_template, request
from json import loads
import os


@app.route('/', defaults={'path': ''})
def index(path):
    return render_template('treeTrimmer.html')


@app.route('/load_data', methods=['POST'])
def load_data():

    print('Made it to post')

    file = request.files['file']

    root_path = os.path.dirname(os.path.abspath(__file__))
    save_path = os.path.join(root_path, 'file_storage/')

    file_name = file.filename

    file.save('/'.join([save_path, file_name]))

    return 'Success'

@app.route('/decision_tree', methods=['GET'])
def decision_tree():

    return 'Success'
