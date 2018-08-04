import numpy as np
import pandas as pd
from sklearn.metrics import confusion_matrix
from sklearn.model_selection import cross_val_predict
from sklearn.tree import DecisionTreeClassifier


def filter_features(features_in, feature_names_in, filter_features_in):
    """
    Filters out features from dataset

    :param features_in: numpy.ndarray of features
    :param feature_names_in: numpy.ndarray of feature column names
    :param filter_features_in: list of features to be filtered
    :return: numpy.ndarray filtered_features with features in filter_features_in removed, numpy.ndarray
    filtered_feature_names with names of filtered features removed
    """

    indices = [feature_names_in.tolist().index(feature) for feature in filter_features_in]

    filtered_features = np.delete(features_in, indices, axis=1)

    filtered_feature_names = np.delete(feature_names_in, indices)

    return filtered_features, filtered_feature_names


def get_node_data(tree_in, features_in, labels_in, node_index_in, criterion_in, leaf=False):

    if not leaf:
        split_feature = features_in[tree_in.tree_.feature[node_index_in]]
        split_threshold = tree_in.tree_.threshold[node_index_in]
        split = [split_feature, round(split_threshold, 3)]

    impurity_score = tree_in.tree_.impurity[node_index_in]
    impurity = [criterion_in, round(impurity_score, 3)]

    n_node_samples = int(tree_in.tree_.n_node_samples[node_index_in])

    node_class_zip = zip(tree_in.tree_.value[node_index_in, 0], labels_in)
    node_class_counts = [[label, int(count)] for count, label in node_class_zip]

    if leaf:
        return impurity, n_node_samples, node_class_counts
    else:
        return split, impurity, n_node_samples, node_class_counts


def get_impurity_decrease_data(tree_in, node_index_in, left_index_in, right_index_in, total_samples_in,
                               origin_impurity_in):

    current_node_samples = tree_in.tree_.n_node_samples[node_index_in]

    node_impurity = tree_in.tree_.impurity[node_index_in]

    n_left_child_samples = tree_in.tree_.n_node_samples[left_index_in]
    left_child_impurity = tree_in.tree_.impurity[left_index_in]
    n_right_child_samples = tree_in.tree_.n_node_samples[right_index_in]
    right_child_impurity = tree_in.tree_.impurity[right_index_in]

    impurity_decrease = current_node_samples / total_samples_in * (
            node_impurity - n_right_child_samples / current_node_samples * right_child_impurity
            - n_left_child_samples / current_node_samples * left_child_impurity)

    percentage_decrease = round(impurity_decrease / origin_impurity_in * 100, 2)

    return impurity_decrease, percentage_decrease


tree_depth = set([])


def tree_to_dictionary(tree_in, features_in, labels_in, criterion_in, n_total_samples_in, node_index=0, depth=0,
                       origin_impurity_in=0):

    tree_dict = {}

    if tree_in.tree_.children_left[node_index] == -1:  # see source code: TREE_LEAF = -1

        tree_depth.add(depth)
        tree_dict['leaf'] = {}
        tree_dict['leaf']['node_depth'] = depth
        # Use tuple unpacking to load nested dictionary
        (tree_dict['leaf']['impurity'],
         tree_dict['leaf']['n_node_samples'],
         tree_dict['leaf']['node_class_counts']) = get_node_data(tree_in, features_in, labels_in,
                                                                 node_index, criterion_in, True)

    else:

        origin_impurity = tree_in.tree_.impurity[node_index] if node_index == 0 else origin_impurity_in

        left_index = tree_in.tree_.children_left[node_index]
        right_index = tree_in.tree_.children_right[node_index]

        tree_dict['node'] = {}
        tree_dict['node']['node_depth'] = depth
        # Use tuple unpacking to load nested dictionary
        (tree_dict['node']['split'],
         tree_dict['node']['impurity'],
         tree_dict['node']['n_node_samples'],
         tree_dict['node']['node_class_counts']) = get_node_data(tree_in, features_in, labels_in,
                                                                 node_index, criterion_in)

        (tree_dict['node']['weighted_impurity_decrease'],
         tree_dict['node']['percentage_impurity_decrease']) = get_impurity_decrease_data(tree_in, node_index,
                                                                                         left_index, right_index,
                                                                                         n_total_samples_in,
                                                                                         origin_impurity)

        tree_dict['children'] = [tree_to_dictionary(tree_in, features_in, labels_in, criterion_in, n_total_samples_in,
                                                    right_index, depth + 1, origin_impurity),
                                 tree_to_dictionary(tree_in, features_in, labels_in, criterion_in, n_total_samples_in,
                                                    left_index, depth + 1, origin_impurity)]

    return tree_dict


def get_decision_tree(features_in, feature_names_in, target_in, criterion_in, max_depth_in,
                      min_samples_split_in, min_samples_leaf_in, min_impurity_decrease_in, random_state_in,
                      filter_feature_in):

    tree_depth.clear()

    if filter_feature_in is not None:
        features_in, feature_names_in = filter_features(features_in, feature_names_in, filter_feature_in)

    # Will only prevent split if >= so increase slightly
    min_impurity_decrease = min_impurity_decrease_in if min_impurity_decrease_in == 0 else min_impurity_decrease_in + 0.0001

    clf = DecisionTreeClassifier(criterion=criterion_in, max_depth=max_depth_in, min_samples_split=min_samples_split_in,
                                 min_samples_leaf=min_samples_leaf_in, min_impurity_decrease=min_impurity_decrease,
                                 random_state=random_state_in)

    dt_clf = clf.fit(features_in, target_in)

    predicted = cross_val_predict(dt_clf, features_in, target_in)
    #
    importances = clf.feature_importances_
    # # returns (up to) 10 most important feature indices sorted by importance
    top_indices = np.argsort(importances)[::-1][:10]
    # # list of tuple(feature name, feature importance score [rounded to 4 decimal places])
    importance_list = [(feature_names_in[i], round(importances[i], 4)) for i in top_indices]
    #
    conf_matrix = confusion_matrix(target_in, predicted)

    # print(type(target_in))

    # Get unique list of label names
    labels = np.unique(target_in).tolist()

    # print("Class labels", labels)
    criterion = clf.criterion
    n_total_samples = target_in.size
    # print("total samples", n_total_samples)
    returned_tree = tree_to_dictionary(clf, feature_names_in, labels, criterion, n_total_samples)
    #
    tree_summary = {"total_depth": max(tree_depth), "total_nodes": clf.tree_.node_count}
    #
    tree_dict = {"class_labels": labels, "tree_json": returned_tree, "tree_summary": tree_summary,
                 "confusion_matrix": conf_matrix.tolist(), "important_features": importance_list}

    return tree_dict
