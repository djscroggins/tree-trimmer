from treeTrimmer import app
from flask import render_template, request, jsonify
from json import loads
import os

from treeTrimmer.machine_learning.preprocessing import get_pandas_data
from treeTrimmer.machine_learning.decision_tree import get_decision_tree

# Just hold data in memory for demo
data_dict = dict()


@app.route('/', defaults={'path': ''})
def index(path):
    return render_template('treeTrimmer.html')


@app.route('/load_data', methods=['POST'])
def load_data():

    file = request.files['file']
    target_index = loads((request.form['target_index']))

    root_path = os.path.dirname(os.path.abspath(__file__))
    save_path = os.path.join(root_path, 'file_storage/')

    file_name = file.filename
    full_path = '/'.join([save_path, file_name])

    file.save(full_path)

    target, features, feature_names = get_pandas_data(full_path, target_index)
    data_dict['target'] = target
    data_dict['features'] = features
    data_dict['feature_names'] = feature_names

    return 'Success'


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

    ml_results = get_decision_tree(data_dict['features'], data_dict['feature_names'], data_dict['target'], criterion, max_depth, min_samples_split, min_samples_leaf, min_impurity_decrease, random_state, filter_feature)
    # target_index = loads((request.form['target_index']))

    # print(type(target_index))
    # print(target_index)

    return jsonify(ml_results)
