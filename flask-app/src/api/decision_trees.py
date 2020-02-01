import copy
import traceback
from http import HTTPStatus

from flask import request, current_app
from flask_restplus import Namespace, Resource, fields, marshal, abort

from ..core.data_preprocessor import DataPreprocessor
from ..core.decision_tree_wrapper import DecisionTreeWrapper
from ..core.decision_tree_parser import DecisionTreeParser
from config import config
from src.core.storage import StorageManager

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
DEFAULT_USER = 'david'


@decision_trees.route('')
class DecisionTreeManager(Resource):

    def __init__(self, *args, **kwargs):
        self._storage_manager: StorageManager = current_app.storage_manager
        self._data_preprocessor = DataPreprocessor()
        self._dt_wrapper = DecisionTreeWrapper
        self._dt_parser = DecisionTreeParser
        self._logger = current_app.logger
        super().__init__(*args, **kwargs)

    @decision_trees.expect(post_body)
    @decision_trees.response(HTTPStatus.CREATED, 'Success', decision_trees_response)
    @decision_trees.response(HTTPStatus.BAD_REQUEST, 'Bad Request', decision_trees_response)
    def post(self):

        parameters = request.get_json().get('parameters')
        current_user = config.get('DEFAULT_USER')
        data_dict = self._storage_manager.get_user_data(current_user)
        data = copy.deepcopy(data_dict)

        feature_filter = parameters.get('filter_feature')

        if feature_filter:
            filtered_feat_dict = self._data_preprocessor.filter_features(data=data, feature_filter=feature_filter)
            data.update(filtered_feat_dict)

        try:
            dtw = self._dt_wrapper(data=data, parameters=parameters).fit()
            clf = dtw.get_classifier()
            result = dtw.get_summary()

            dtp = self._dt_parser(clf=clf, data=data, parameters=parameters)
            parsed_tree = dtp.parse()

            result.update(parsed_tree)

            self._storage_manager.update_user_data(current_user, data)

            results['ml_results'] = result

            self._logger.info(result)

            return marshal(dict(ml_results=result), decision_trees_response), HTTPStatus.CREATED
        except AssertionError as e:
            self._logger.error(e)
            self._logger.error((traceback.print_exc()))
            abort(HTTPStatus.BAD_REQUEST, str(e))
