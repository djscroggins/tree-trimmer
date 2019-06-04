from json import loads
import os
import traceback

from flask import render_template, request, jsonify, Blueprint, current_app
from werkzeug.utils import secure_filename

from treeTrimmer.core.preprocessing import file_to_numpy
from treeTrimmer.core.decision_tree_wrapper import DecisionTreeWrapper

tree_trimmer = Blueprint('tree_trimmer_namespace', __name__)

# Just hold data in memory for demo
data_dict = dict()


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']


@tree_trimmer.route('/', defaults={'path': ''})
def index(path):
    return render_template('index.html')


@tree_trimmer.route('/load_data', methods=['POST'])
def load_data():
    UPLOAD_FOLDER = current_app.config['UPLOAD_FOLDER']

    file = request.files['file']
    target_index = loads((request.form['target_index']))

    if not os.path.isdir(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)

        (data_dict['target'], data_dict['features'], data_dict['feature_names']) = file_to_numpy(file_path,
                                                                                                 target_index)

        return jsonify(message='File successfully loaded'), 201

    else:
        return jsonify(message='Only .csv files currently accepted'), 403


@tree_trimmer.route('/decision_tree', methods=['POST'])
def decision_tree():
    parameters = loads(request.form['parameters'])

    try:
        dtw = DecisionTreeWrapper(data=data_dict, parameters=parameters).fit()
        result = dtw.get_decision_tree()
        return jsonify(ml_results=result), 200
    except AssertionError as e:
        print(e)
        print(traceback.print_exc())
        return jsonify(ml_results=str(e)), 500

