from json import loads
import os
from http import HTTPStatus
from pathlib import Path
import pickle

from flask import current_app, request, jsonify
from flask_restplus import Namespace, Resource, fields, marshal, abort
from werkzeug.utils import secure_filename

from core.data_preprocessor import DataPreprocessor
# from api import data_dict

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
    @staticmethod
    def allowed_file(filename):
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']

    @files.response(HTTPStatus.CREATED, 'File successfully loaded', file_upload_response)
    @files.response(HTTPStatus.FORBIDDEN, 'Only .csv files currently accepted', file_upload_response)
    def post(self):
        UPLOAD_FOLDER = current_app.config['UPLOAD_FOLDER']

        app_path = Path(__file__).parents[1]

        with open(os.path.join(app_path, UPLOAD_FOLDER + 'data-dict.pickle'), 'rb') as f:
            data_dict = pickle.load(f)

        file = request.files['file']
        target_index = loads((request.form['target_index']))

        if not os.path.isdir(UPLOAD_FOLDER):
            os.makedirs(UPLOAD_FOLDER)

        if file and self.allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_path = os.path.join(UPLOAD_FOLDER, filename)
            file.save(file_path)

            dpp = DataPreprocessor()
            numpy_dict = dpp.file_to_numpy(file_path, target_index)
            data_dict.update(numpy_dict)

            with open(UPLOAD_FOLDER + 'data-dict.pickle', 'wb') as f:
                pickle.dump(data_dict, f, protocol=pickle.HIGHEST_PROTOCOL)

            return marshal(dict(message='File successfully loaded'), file_upload_response), HTTPStatus.CREATED

        else:
            abort(HTTPStatus.FORBIDDEN, 'Only .csv files currently accepted')
