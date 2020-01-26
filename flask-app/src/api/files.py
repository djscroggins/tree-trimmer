from json import loads
from http import HTTPStatus
from pathlib import Path

from flask import current_app, request
from flask_restplus import Namespace, Resource, fields, marshal, abort

from ..core.data_preprocessor import DataPreprocessor
from config import config
from ..common.storage import StorageManager

files = Namespace(
    name='Files',
    description='API for file management',
    path='/files'
)

file_upload_response = files.model('file_upload_response', {
    'message': fields.String
})


@files.route('')
class FileManager(Resource):

    def __init__(self, *args, **kwargs):
        self._storage_manager: StorageManager = current_app.storage_manager
        self._data_preprocessor = DataPreprocessor()
        self._logger = current_app.logger
        super().__init__(*args, **kwargs)

    @staticmethod
    def allowed_file(filename) -> bool:
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in config.get('ALLOWED_EXTENSIONS')

    @files.response(HTTPStatus.CREATED, 'File successfully loaded', file_upload_response)
    @files.response(HTTPStatus.FORBIDDEN, 'Only .csv files currently accepted', file_upload_response)
    def post(self):

        current_user = config.get('DEFAULT_USER')
        self._storage_manager.initialize_user_data(current_user)
        data_dict = self._storage_manager.get_user_data(current_user)

        file = request.files['file']

        target_index = loads((request.form['target_index']))

        if file and self.allowed_file(file.filename):

            file_path: Path = self._storage_manager.save_user_data_file(current_user, file)

            # TODO: Pass Path instance to this method
            numpy_dict = self._data_preprocessor.file_to_numpy(str(file_path), target_index)
            data_dict.update(numpy_dict)

            self._storage_manager.update_user_data(current_user, data_dict)

            return marshal(dict(message='File successfully loaded'), file_upload_response), HTTPStatus.CREATED

        else:
            abort(HTTPStatus.FORBIDDEN, 'Only .csv files currently accepted')
