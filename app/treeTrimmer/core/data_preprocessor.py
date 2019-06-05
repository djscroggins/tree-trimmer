from typing import List

import numpy as np
import pandas as pd
from pandas.core.frame import DataFrame
from pytypes import typechecked


class DataPreprocessor:

    @typechecked
    def _get_target(self, df: DataFrame, target_index: int) -> np.ndarray:
        target = df.iloc[:, [target_index]]

        r, c = target.shape
        if c:
            target = target.values.reshape(r, )

        return target

    @typechecked
    def _get_features(self, df: DataFrame, target_index: int) -> DataFrame:
        print(type(df))
        feature_indices = [x for x in range(df.shape[1]) if x != target_index]
        return df.iloc[:, feature_indices]

    @typechecked
    @staticmethod
    def _get_feature_names(features: DataFrame) -> np.ndarray:
        return features.columns.values

    @typechecked
    @staticmethod
    def _get_feature_values(features: DataFrame) -> np.ndarray:
        return features.values

    @typechecked
    @staticmethod
    def _get_labels(target: np.ndarray) -> np.ndarray:
        return np.unique(target)

    @typechecked
    def file_to_numpy(self, file_path: str, target_index: int) -> dict:
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

        target = self._get_target(df, target_index)
        features = self._get_features(df, target_index)
        feature_names = self._get_feature_names(features)
        features = self._get_feature_values(features)
        labels = self._get_labels(target)

        return dict(target=target, features=features, feature_names=feature_names, labels=labels)

    @staticmethod
    def filter_features(data: dict, feature_filter: List[str]):
        feature_data = data.get('features')
        feature_names = data.get('feature_names')

        indices = [feature_names.tolist().index(feature) for feature in feature_filter]
        filtered_feature_data = np.delete(feature_data, indices, axis=1)
        filtered_feature_names = np.delete(feature_names, indices)

        return dict(features=filtered_feature_data, feature_names=filtered_feature_names)
