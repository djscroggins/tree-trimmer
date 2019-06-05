from json import loads
import os
import traceback
import copy

from flask import render_template, request, jsonify, Blueprint, current_app
from werkzeug.utils import secure_filename

from treeTrimmer.core.decision_tree_wrapper import DecisionTreeWrapper
from treeTrimmer.core.decision_tree_parser import DecisionTreeParser
from treeTrimmer.core.file_manager import DataPreprocessor

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

        dpp = DataPreprocessor()
        (data_dict['target'], data_dict['features'], data_dict['feature_names']) = dpp.file_to_numpy(file_path,
                                                                                                     target_index)

        return jsonify(message='File successfully loaded'), 201

    else:
        return jsonify(message='Only .csv files currently accepted'), 403


@tree_trimmer.route('/decision_tree', methods=['POST'])
def decision_tree():
    parameters = loads(request.form['parameters'])

    try:
        dtw = DecisionTreeWrapper(data=data_dict, parameters=parameters).fit()
        clf = dtw.get_classifier()
        result = dtw.get_summary()

        dtp = DecisionTreeParser(clf=clf, data=data_dict, parameters=parameters)
        parsed_tree = dtp.parse()

        result.update(parsed_tree)

        return jsonify(ml_results=result), 200
    except AssertionError as e:
        print(e)
        print(traceback.print_exc())
        return jsonify(ml_results=str(e)), 500
