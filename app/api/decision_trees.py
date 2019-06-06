import json
import copy
import traceback
from http import HTTPStatus
from pathlib import Path
import os
import pickle

from flask import request, current_app
from flask_restplus import Namespace, Resource, fields, marshal, abort

# from . import data_dict
from core.data_preprocessor import DataPreprocessor
from core.decision_tree_wrapper import DecisionTreeWrapper
from core.decision_tree_parser import DecisionTreeParser

decision_trees = Namespace(
    name='Decision Trees',
    description='Namespace for decision tree creation',
    path='/decision-trees'
)

# decision_trees = Namespace('decision-trees', description='Cats related operations')

decision_trees_response = decision_trees.model('decision_trees_response', {
    'ml_results': fields.Raw
})

# decision_trees_response = {'ml_results': fields.Raw}


@decision_trees.route('')
class DecisionTreeManager(Resource):

    @decision_trees.response(HTTPStatus.CREATED, 'Success', decision_trees_response)
    @decision_trees.response(HTTPStatus.BAD_REQUEST, 'Bad Request', decision_trees_response)
    def post(self):
        parameters = json.loads(request.form['parameters'])

        app_path = Path(__file__).parents[1]
        UPLOAD_FOLDER = current_app.config['UPLOAD_FOLDER']

        with open(os.path.join(app_path, UPLOAD_FOLDER + 'data-dict.pickle'), 'rb') as f:
            data_dict = pickle.load(f)

        data = copy.deepcopy(data_dict)

        print(data)

        feature_filter = parameters.get('filter_feature')

        if feature_filter:
            dpp = DataPreprocessor()
            filtered_feat_dict = dpp.filter_features(data=data, feature_filter=feature_filter)
            data.update(filtered_feat_dict)

        try:
            dtw = DecisionTreeWrapper(data=data, parameters=parameters).fit()
            clf = dtw.get_classifier()
            result = dtw.get_summary()

            dtp = DecisionTreeParser(clf=clf, data=data, parameters=parameters)
            parsed_tree = dtp.parse()

            result.update(parsed_tree)

            with open('file_storage/data-dict.pickle', 'wb') as f:
                pickle.dump(data_dict, f, protocol=pickle.HIGHEST_PROTOCOL)

            # return jsonify(ml_results=result), 201
            return marshal(dict(ml_results=result), decision_trees_response), HTTPStatus.CREATED
        except AssertionError as e:
            print(e)
            print(traceback.print_exc())
            abort(HTTPStatus.BAD_REQUEST, str(e))
            # return jsonify(ml_results=str(e)), 500
