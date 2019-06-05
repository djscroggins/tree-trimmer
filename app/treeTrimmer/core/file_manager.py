from typing import Tuple

import pandas as pd
import numpy as np
from pytypes import typechecked


class DataPreprocessor:

    @typechecked
    @staticmethod
    def file_to_numpy(file_path: str, target_index: int) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
        # TODO: Add labels?
        """
        Converts file to numpy arrays

        Args:
            file_path (str):
            target_index (int):

        Returns:
            tuple(target, features, feature_names)

        """
        df = pd.read_csv(file_path, header=0)

        target = df.iloc[:, [target_index]]

        r, c = target.shape
        if c:
            target = target.values.reshape(r, )

        feature_indices = [x for x in range(df.shape[1]) if x != target_index]
        features = df.iloc[:, feature_indices]
        feature_names = features.columns.values
        features = features.values

        return target, features, feature_names
