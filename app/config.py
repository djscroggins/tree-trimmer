import os

basedir = os.path.abspath(os.path.dirname(__file__))


class Config(object):
    UPLOAD_FOLDER = os.path.join(basedir, 'treeTrimmer/file_storage')
    ALLOWED_EXTENSIONS = {'csv'}


class DevServer(Config):
    FLASK_HOST = '0.0.0.0'
    FLASK_PORT = 5000
    DEBUG = True


config_by_name = dict(
    dev=DevServer
)

