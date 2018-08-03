import pandas as pd


def get_pandas_data(file_path, target_index):

    # TODO: Change to specify header
    df = pd.read_csv(file_path, header=0)

    target = df.iloc[:, [target_index]]
    feature_indices = [x for x in range(df.shape[1]) if x != target_index]
    features = df.iloc[:, feature_indices]
    feature_names = list(features.columns.values)

    return target, features, feature_names
