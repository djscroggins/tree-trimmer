import os
from pathlib import Path

basedir = os.path.abspath(os.path.dirname(__file__))


class Config:
    # UPLOAD_FOLDER = os.path.join(basedir, 'file_storage/')
    ALLOWED_EXTENSIONS = {'csv'}


class DevServer(Config):
    FLASK_HOST = 'localhost'
    FLASK_PORT = 5000
    DEBUG = True


config_by_name = dict(
    dev=DevServer
)


config = {
    'default_user': 'david',
    'app_root': Path(__file__).parent.resolve(),
    'storage_path': Path(__file__).parent.joinpath(os.getenv('STORAGE_BASE')).resolve()
}

