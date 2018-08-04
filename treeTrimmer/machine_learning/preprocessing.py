import pandas as pd
import numpy as np


def get_pandas_data(file_path, target_index):

    print("In get_pandas_data")
    # TODO: Change to specify header
    df = pd.read_csv(file_path, header=0)

    target = df.iloc[:, [target_index]]

    r, c = target.shape
    if c:
        target = target.values.reshape(r,)

    feature_indices = [x for x in range(df.shape[1]) if x != target_index]
    features = df.iloc[:, feature_indices]
    feature_names = features.columns.values
    features = features.values

    print("Results of get_pandas_data")
    print("Type of target", type(target))
    print("Type of features", type(features))
    print("Type of feature_names", type(feature_names))

    return target, features, feature_names
