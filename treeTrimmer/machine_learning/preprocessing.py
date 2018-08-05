import pandas as pd
import numpy as np


def file_to_numpy(file_path, target_index):
    """
    Converts file to numpy arrays
    :param file_path: path to file to be processed
    :param target_index: index of class
    :return: numpy.ndarray target (class), numpy.ndarray features, numpy.ndarray feature_names
    """

    # print("In file_to_numpy, type of file_path: ", type(file_path))
    #
    # if not file_path.lower().endswith('.csv'):
    #     raise TypeError
    # else:
    #     pass

    df = pd.read_csv(file_path, header=0)

    target = df.iloc[:, [target_index]]

    r, c = target.shape
    if c:
        target = target.values.reshape(r,)

    feature_indices = [x for x in range(df.shape[1]) if x != target_index]
    features = df.iloc[:, feature_indices]
    feature_names = features.columns.values
    features = features.values

    print('In file_to_numpy, feature_names: ', feature_names)

    return target, features, feature_names
