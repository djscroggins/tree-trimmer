from pathlib import Path

from flask import Flask
from flask_cors import CORS

from src.api import tree_trimmer_api
from src.common.storage import StorageManager


def create_app() -> Flask:
    app = Flask(__name__)
    CORS(app)
    app.storage_manager = StorageManager(app_root=Path(__file__).parent.resolve())
    app.storage_manager.create_storage_path()
    tree_trimmer_api.init_app(app)

    return app
