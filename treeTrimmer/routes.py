from treeTrimmer import app
from treeTrimmer.machine_learning.preprocessing import file_to_numpy
from treeTrimmer.machine_learning.decision_tree import get_decision_tree

from flask import render_template, request, jsonify
from json import loads
import os

from flask.json import JSONEncoder
import numpy as np

from pandas.errors import ParserError

# Just hold data in memory for demo
data_dict = dict()


@app.route('/', defaults={'path': ''})
def index(path):
    return render_template('index.html')


@app.route('/load_data', methods=['POST'])
def load_data():

    file = request.files['file']
    target_index = loads((request.form['target_index']))

    if file.filename.lower().endswith('.csv'):

        print('Instance path', os.path.dirname(app.instance_path))
        print('Root path', os.path.dirname(app.root_path))

        root_path = os.path.dirname(os.path.abspath(__file__))
        print('root_path', root_path)
        storage_path = os.path.join(root_path, 'file_storage')
        print('storage_path', storage_path)
        full_path = '/'.join([storage_path, file.filename])
        print('full_path: ', full_path)
        file.save(full_path)
        save_path = os.path.join(app.instance_path, file.filename)
        # print('save_path: ', save_path)

        if not os.path.isdir(os.path.join(app.instance_path)):
            print("Instance directory does not exist")
            os.makedirs(os.path.join(app.instance_path))
        else:
            print('Instance directory exists')

        # file.save(save_path)

        # if os.path.isfile(full_path):
        #     os.remove(full_path)
        # else:
        #     # TODO: Catch with logging later
        #     print('File could not be removed')

        (data_dict['target'], data_dict['features'], data_dict['feature_names']) = file_to_numpy(full_path, target_index)

        return jsonify(message='File succesfully loaded'), 201

    else:
        return jsonify(message='Only .csv files currently accepted'), 403



    # return 'Success'


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
