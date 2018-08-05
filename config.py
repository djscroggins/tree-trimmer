import os
basedir = os.path.abspath(os.path.dirname(__file__))


class Config(object):
    UPLOAD_FOLDER = os.path.join(basedir, 'treeTrimmer/file_storage')
    ALLOWED_EXTENSIONS = set(['csv'])

