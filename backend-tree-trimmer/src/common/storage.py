import os
import pickle
from pathlib import Path
from typing import Union

from werkzeug.utils import secure_filename


class StorageManager:
    def __init__(self, app_root: Path):
        self._default_user = 'david'
        self._app_root = app_root
        self._storage_path = self._app_root.joinpath(os.getenv('STORAGE_BASE')).resolve()

    def create_storage_path(self):
        if not self._storage_path.exists():
            Path.mkdir(self._storage_path)

    def _get_user_path(self, username: str) -> Path:
        return self._storage_path.joinpath(username).resolve()

    @staticmethod
    def _create_user_path(user_path: Path):
        if not user_path.exists():
            Path.mkdir(user_path)

    @staticmethod
    def _create_user_default_data(data_path):
        with Path.open(data_path, 'wb') as f:
            pickle.dump(dict(), f, protocol=pickle.HIGHEST_PROTOCOL)

    def initialize_user_data(self, username: str):
        user_path = self._get_user_path(username)
        data_path = user_path.joinpath(user_path, 'data-dict.pickle').resolve()

        self._create_user_path(user_path)
        self._create_user_default_data(data_path)

    def get_user_data(self, username: str):
        user_path = self._storage_path.joinpath(username).resolve()
        data_path = user_path.joinpath(user_path, 'data-dict.pickle').resolve()
        with Path.open(data_path, 'rb') as f:
            return pickle.load(f)

    def update_user_data(self, username: str, data: dict):
        user_path = self._get_user_path(username)
        data_path = user_path.joinpath(user_path, 'data-dict.pickle').resolve()
        with Path.open(data_path, 'wb') as f:
            pickle.dump(data, f, protocol=pickle.HIGHEST_PROTOCOL)

    def save_user_data_file(self, username: str, file) -> Union[bytes, str]:
        s_filename = secure_filename(file.filename)
        user_path = self._get_user_path(username)
        file_path = os.path.join(str(user_path), s_filename)
        file.save(file_path)
        return file_path
