from treeTrimmer import app
from treeTrimmer.machine_learning.preprocessing import file_to_numpy
from treeTrimmer.machine_learning.decision_tree import get_decision_tree

from flask import render_template, request, jsonify
from json import loads
import os
from werkzeug.utils import secure_filename

import numpy as np

# Just hold data in memory for demo
data_dict = dict()


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']


@app.route('/', defaults={'path': ''})
def index(path):
    return render_template('index.html')


@app.route('/load_data', methods=['POST'])
def load_data():

    UPLOAD_FOLDER = app.config['UPLOAD_FOLDER']

    file = request.files['file']
    target_index = loads((request.form['target_index']))

    if not os.path.isdir(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)

        (data_dict['target'], data_dict['features'], data_dict['feature_names']) = file_to_numpy(file_path, target_index)

        return jsonify(message='File succesfully loaded'), 201

    else:
        return jsonify(message='Only .csv files currently accepted'), 403


@app.route('/decision_tree', methods=['POST'])
def decision_tree():

    parameters = loads(request.form['parameters'])

    criterion = parameters.pop('criterion')
    max_depth = int(parameters.pop('max_depth'))
    min_samples_split = int(parameters.pop('min_samples_split'))
    min_samples_leaf = int(parameters.pop('min_samples_leaf'))
    min_impurity_decrease = float(parameters.pop('min_impurity_decrease', 0))
    random_state = 7 if parameters['random_state'] is True else None
    filter_feature = parameters.pop('filter_feature', None)

    dt_results = get_decision_tree(data_dict['features'], data_dict['feature_names'], data_dict['target'], criterion,
                                   max_depth, min_samples_split, min_samples_leaf, min_impurity_decrease, random_state,
                                   filter_feature)

    return jsonify(ml_results=dt_results)
