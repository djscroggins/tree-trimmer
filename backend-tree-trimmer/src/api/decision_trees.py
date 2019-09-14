import json
import copy
import traceback
from http import HTTPStatus
from pathlib import Path
import os
import pickle

from flask import request, current_app
from flask_restplus import Namespace, Resource, fields, marshal, abort

from ..core.data_preprocessor import DataPreprocessor
from ..core.decision_tree_wrapper import DecisionTreeWrapper
from ..core.decision_tree_parser import DecisionTreeParser

decision_trees = Namespace(
    name='Decision Trees',
    description='Namespace for decision tree creation',
    path='/decision-trees'
)

decision_trees_response = decision_trees.model('decision_trees_response', {
    'ml_results': fields.Raw
})

parameter_fields = decision_trees.model('parameter_fields', {
    "criterion": fields.String,
    "max_depth": fields.String,
    "min_samples_split": fields.String,
    "min_samples_leaf": fields.String,
    "random_state": fields.String,
    "filter_feature": fields.List(fields.String)
})

post_body = decision_trees.model('post_body', {
    'parameters': fields.Nested(parameter_fields)
})

results = {}
_parameters = {}


@decision_trees.route('')
class DecisionTreeManager(Resource):

    def __init__(self, *args, **kwargs):
        self.UPLOAD_FOLDER = current_app.config['UPLOAD_FOLDER']
        super().__init__(*args, **kwargs)

    def get_data_set(self):
        app_path = Path(__file__).parents[1]
        with open(os.path.join(app_path, self.UPLOAD_FOLDER + 'data-dict.pickle'), 'rb') as f:
            data_dict = pickle.load(f)

        return data_dict

    @decision_trees.expect(post_body)
    @decision_trees.response(HTTPStatus.CREATED, 'Success', decision_trees_response)
    @decision_trees.response(HTTPStatus.BAD_REQUEST, 'Bad Request', decision_trees_response)
    def post(self):

        parameters = request.get_json().get('parameters')

        data_dict = self.get_data_set()
        data = copy.deepcopy(data_dict)

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

            results['ml_results'] = result

            return marshal(dict(ml_results=result), decision_trees_response), HTTPStatus.CREATED
        except AssertionError as e:
            print(e)
            print(traceback.print_exc())
            abort(HTTPStatus.BAD_REQUEST, str(e))
