import numpy as np
import pandas as pd
from pytypes import typechecked


class DataPreprocessor:

    @typechecked
    @staticmethod
    def file_to_numpy(file_path: str, target_index: int) -> dict:
        # TODO: Add labels?
        """
        Converts file to numpy arrays

        Args:
            file_path (str):
            target_index (int):

        Returns:
            dict with numpy arrays containing target, features, feature names

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
        labels = np.unique(target)

        return dict(target=target, features=features, feature_names=feature_names, labels=labels)
