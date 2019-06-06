import os
import pickle

from flask import Flask

from config import config_by_name
from api import tree_trimmer_api

base_dir = os.path.abspath(os.path.dirname(__file__))


def create_data_dict():
    with open('file_storage/data-dict.pickle', 'wb') as f:
        pickle.dump(dict(), f, protocol=pickle.HIGHEST_PROTOCOL)


def create_app(config_name: str) -> Flask:

    create_data_dict()

    app = Flask(__name__,
                # template_folder=os.path.join(base_dir, 'templates'),
                # static_folder=os.path.join(base_dir, 'static')
                )
    app.config.from_object(config_by_name[config_name])
    tree_trimmer_api.init_app(app)

    return app
