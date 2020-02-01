from pathlib import Path
from logging import DEBUG, INFO
import os

from flask import Flask
from flask_cors import CORS

from src.api import tree_trimmer_api
from src.core.utilities.storage import StorageManager
from src.core.utilities.custom_logging import Logger


def create_app() -> Flask:
    app = Flask(__name__)
    CORS(app)
    app.storage_manager = StorageManager(app_root=Path(__file__).parent.resolve())
    app.storage_manager.create_storage_path()
    app.logger = Logger(logger_name='decision-trees',
                        log_level=DEBUG if os.getenv('FLASK_ENV') == 'development' else INFO).get_logger()
    tree_trimmer_api.init_app(app)

    return app
