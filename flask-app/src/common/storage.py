import os
import pickle
from pathlib import Path

from werkzeug.utils import secure_filename


class StorageManager:
    def __init__(self, app_root: Path):
        self._default_user = 'david'
        self._app_root = app_root
        self._storage_path = self._app_root.joinpath(os.getenv('STORAGE_BASE')).resolve()

    def create_storage_path(self) -> None:
        if not self._storage_path.exists():
            Path.mkdir(self._storage_path)

    def _get_user_path(self, username: str) -> Path:
        return self._storage_path.joinpath(username).resolve()

    def _get_user_data_path(self, username: str, file: str = 'data-dict.pickle'):
        return self._get_user_path(username).joinpath('data', file).resolve()

    def _get_user_file_path(self, username: str, s_filename: str) -> Path:
        return self._get_user_path(username).joinpath('files', s_filename).resolve()

    @staticmethod
    def _create_user_dirs(user_path: Path) -> None:
        data_dir = Path(user_path, 'data').resolve()
        files_dir = Path(user_path, 'files').resolve()

        for path in [user_path, data_dir, files_dir]:
            if not path.exists():
                Path.mkdir(path)

    @staticmethod
    def _create_user_default_data(data_path) -> None:
        with Path.open(data_path, 'wb') as f:
            pickle.dump(dict(), f, protocol=pickle.HIGHEST_PROTOCOL)

    def initialize_user_data(self, username: str) -> None:
        user_path = self._get_user_path(username)
        data_path = self._get_user_data_path(username)

        self._create_user_dirs(user_path)
        self._create_user_default_data(data_path)

    def get_user_data(self, username: str) -> dict:
        data_path = self._get_user_data_path(username)
        with Path.open(data_path, 'rb') as f:
            return pickle.load(f)

    def update_user_data(self, username: str, data: dict) -> None:
        data_path = self._get_user_data_path(username)
        with Path.open(data_path, 'wb') as f:
            pickle.dump(data, f, protocol=pickle.HIGHEST_PROTOCOL)

    def save_user_data_file(self, username: str, file) -> Path:
        s_filename = secure_filename(file.filename)
        file_path = self._get_user_file_path(username, s_filename)
        file.save(str(file_path))
        return file_path
