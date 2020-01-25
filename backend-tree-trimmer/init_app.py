import os
import pickle
from pathlib import Path

from flask import Flask
from flask_cors import CORS

from config import config_by_name, config
from src.api import tree_trimmer_api
from src.common.storage import StorageManager

base_dir = os.path.abspath(os.path.dirname(__file__))


def create_data_dict():
    storage_path: Path = config.get('storage_path')
    user_path: Path = Path(config.get('default_user'))
    data_dict_path = storage_path.joinpath(user_path, 'data-dict.pickle').resolve()

    # if not data_dict_path.exists():
    #     os.mknod(data_dict_path)

    if not storage_path.exists():
        print(storage_path)
        Path.mkdir(storage_path)

    # with Path.open(data_dict_path, 'wb') as f:
    #     pickle.dump(dict(), f, protocol=pickle.HIGHEST_PROTOCOL)


def create_app(config_name: str) -> Flask:
    # create_data_dict()

    app = Flask(__name__,
                # template_folder=os.path.join(base_dir, 'templates'),
                # static_folder=os.path.join(base_dir, 'static')
                )
    CORS(app)
    app.config.from_object(config_by_name[config_name])
    app.storage_manager = StorageManager(app_root=Path(__file__).parent.resolve())
    app.storage_manager.create_storage_path()
    tree_trimmer_api.init_app(app)

    return app
