from pathlib import Path
import os

from flask_restplus import Namespace, Resource
from flask import render_template, send_from_directory, make_response

root = Namespace(
    name='Root',
    description='Static root for Tree Trimmer',
    path='/'
)

# root = Namespace(name='root', description='Cats related operations', path='/')


@root.route('/tree-trimmer')
class Index(Resource):
    def get(self):
        return make_response(render_template('index.html'))


@root.route('/favicon.ico')
class Favicon(Resource):
    def get(self):
        app_path = Path(__file__).parents[1]
        return send_from_directory(os.path.join(app_path, 'static'), 'favicon.ico')
