import os

from flask import Flask

from config import config_by_name
from treeTrimmer.routes import tree_trimmer

base_dir = os.path.abspath(os.path.dirname(__file__))


def create_app(config_name: str) -> Flask:
    app = Flask(__name__
                # ,
                # template_folder=os.path.join(base_dir, 'treeTrimmer/templates'),
                # static_folder=os.path.join(base_dir, 'treeTrimmer/static')
                )
    app.config.from_object(config_by_name[config_name])
    app.register_blueprint(tree_trimmer)

    return app
