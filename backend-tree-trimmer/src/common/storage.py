import os
import pickle
from pathlib import Path


class StorageManager:
    def __init__(self, app_root: Path):
        self._default_user = 'david'
        self._app_root = app_root
        self._storage_path = self._app_root.joinpath(os.getenv('STORAGE_BASE')).resolve()

    def create_storage_path(self):
        if not self._storage_path.exists():
            Path.mkdir(self._storage_path)

    def initialize_user_data(self, username: str):
        user_path = self._storage_path.joinpath(username).resolve()
        data_path = user_path.joinpath(user_path, 'data-dict.pickle').resolve()

        if not user_path.exists():
            Path.mkdir(user_path)

        with Path.open(data_path, 'wb') as f:
            pickle.dump(dict(), f, protocol=pickle.HIGHEST_PROTOCOL)

    def get_user_data(self, username: str):
        user_path = self._storage_path.joinpath(username).resolve()
        data_path = user_path.joinpath(user_path, 'data-dict.pickle').resolve()
        with Path.open(data_path, 'rb') as f:
            return pickle.load(f)


