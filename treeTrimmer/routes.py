from treeTrimmer import app
from flask import render_template, request
from json import loads
import os

from treeTrimmer.machine_learning.preprocessing import get_pandas_data

# Just hold data in memory for demo
data_dict = dict()


@app.route('/', defaults={'path': ''})
def index(path):
    return render_template('treeTrimmer.html')


@app.route('/load_data', methods=['POST'])
def load_data():

    print('Made it to post')

    file = request.files['file']
    target_index = loads((request.form['target_index']))

    # print("File type", type(file))
    # print("Target index", type(target_index))
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

    print('Made it to decision tree')

    kwargs = loads(request.form['parameters'])
    # target_index = loads((request.form['target_index']))

    # print(type(target_index))
    # print(target_index)



    return 'DT Success'
