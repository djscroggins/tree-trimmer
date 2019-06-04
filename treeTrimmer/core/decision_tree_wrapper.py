from typing import Union, Tuple, List

import numpy as np
import sklearn as skl
from sklearn.tree import DecisionTreeClassifier


class DecisionTreeWrapper:
    def __init__(self, **kwargs):
        assert ('data' and 'parameters' in kwargs)
        data, parameters = kwargs.get('data'), kwargs.get('parameters')
        self.tree_depth = set([])
        self.feature_data = data.get('features')
        self.feature_names = data.get('feature_names')
        self.target_data = data.get('target')
        self.criterion = parameters.get('criterion')
        self.max_depth = int(parameters.get('max_depth'))
        self.min_samples_split = int(parameters.get('min_samples_split'))
        self.min_samples_leaf = int(parameters.get('min_samples_leaf'))
        min_impurity_decrease = float(parameters.get('min_impurity_decrease', 0))
        # Will only prevent split if >= so increase slightly
        self.min_impurity_decrease = min_impurity_decrease \
            if min_impurity_decrease == 0 \
            else min_impurity_decrease + 0.0001
        self.random_state = 7 if parameters.get('random_state') else None
        self.feature_filter = parameters.get('filter_feature', None)
        if self.feature_filter:
            self.filter_features(self.feature_filter)
        self.labels = np.unique(self.target_data).tolist()
        self.classifier = None

    def filter_features(self, filter_features_in: list) -> None:
        """

        Args:
            filter_features_in (list): list of features to be filtered

        Returns:
            None
        """
        indices = [self.feature_names.tolist().index(feature) for feature in filter_features_in]
        self.feature_data = np.delete(self.feature_data, indices, axis=1)
        self.feature_names = np.delete(self.feature_names, indices)

    def get_node_data(self, node_index, leaf=False):
        if not leaf:
            split_feature = self.feature_names[self.classifier.tree_.feature[node_index]]
            split_threshold = self.classifier.tree_.threshold[node_index]
            split = [split_feature, round(split_threshold, 3)]

        impurity_score = self.classifier.tree_.impurity[node_index]
        impurity = [self.criterion, round(impurity_score, 3)]

        n_node_samples = int(self.classifier.tree_.n_node_samples[node_index])

        node_class_zip = zip(self.classifier.tree_.value[node_index, 0], self.labels)
        node_class_counts = [[label, int(count)] for count, label in node_class_zip]

        if leaf:
            return impurity, n_node_samples, node_class_counts
        else:
            return split, impurity, n_node_samples, node_class_counts

    def get_impurity_decrease_data(self, node_index, left_index, right_index, origin_impurity):
        """

        Args:
            tree_in ():
            node_index ():
            left_index ():
            right_index ():
            total_samples ():
            origin_impurity ():

        Returns:

        """
        current_node_samples = self.classifier.tree_.n_node_samples[node_index]

        node_impurity = self.classifier.tree_.impurity[node_index]

        n_left_child_samples = self.classifier.tree_.n_node_samples[left_index]
        left_child_impurity = self.classifier.tree_.impurity[left_index]
        n_right_child_samples = self.classifier.tree_.n_node_samples[right_index]
        right_child_impurity = self.classifier.tree_.impurity[right_index]

        impurity_decrease = current_node_samples / self.target_data.size * (
                node_impurity - n_right_child_samples / current_node_samples * right_child_impurity
                - n_left_child_samples / current_node_samples * left_child_impurity)

        percentage_decrease = round(impurity_decrease / origin_impurity * 100, 2)

        return impurity_decrease, percentage_decrease

    def tree_to_dictionary(self, node_index=0, depth=0, origin_impurity_in=0):
        """

        Args:
            clf ():
            feature_names ():
            labels ():
            criterion ():
            total_samples ():
            node_index ():
            depth ():
            origin_impurity_in ():

        Returns:

        """
        tree_dict = {}
        # criterion = self.classifier.criterion

        if self.classifier.tree_.children_left[node_index] == -1:  # see source code: TREE_LEAF = -1

            self.tree_depth.add(depth)
            tree_dict['leaf'] = {}
            tree_dict['leaf']['node_depth'] = depth
            # Use tuple unpacking to load nested dictionary
            (tree_dict['leaf']['impurity'],
             tree_dict['leaf']['n_node_samples'],
             tree_dict['leaf']['node_class_counts']) = self.get_node_data(node_index, True)

        else:

            origin_impurity = self.classifier.tree_.impurity[node_index] if node_index == 0 else origin_impurity_in

            left_index = self.classifier.tree_.children_left[node_index]
            right_index = self.classifier.tree_.children_right[node_index]

            tree_dict['node'] = {}
            tree_dict['node']['node_depth'] = depth
            # Use tuple unpacking to load nested dictionary
            (tree_dict['node']['split'],
             tree_dict['node']['impurity'],
             tree_dict['node']['n_node_samples'],
             tree_dict['node']['node_class_counts']) = self.get_node_data(node_index)

            (tree_dict['node']['weighted_impurity_decrease'],
             tree_dict['node']['percentage_impurity_decrease']) = self.get_impurity_decrease_data(node_index,
                                                                                                  left_index,
                                                                                                  right_index,
                                                                                                  origin_impurity)

            tree_dict['children'] = [
                self.tree_to_dictionary(node_index=right_index, depth=depth + 1, origin_impurity_in=origin_impurity),
                self.tree_to_dictionary(node_index=left_index, depth=depth + 1, origin_impurity_in=origin_impurity)]

        return tree_dict

    def _get_top_features(self, limit=10) -> List[tuple]:
        """
        Returns (up to) 10 most important feature indices sorted by importance

        Args:
            clf (DecisionTreeClassifier): trained DT classifier
            feat_names (np.ndarray): feature names
            limit (int): limit of important features to return

        Returns:
            List of tuple(feature name, feature importance score)

        """
        top_indices = np.argsort(self.classifier.feature_importances_)[::-1][:limit]
        print('TOP INDICES', top_indices)
        return [(self.feature_names[i], round(self.classifier.feature_importances_[i], 4)) for i in top_indices]

    def _get_cross_val_predict(self):
        return skl.model_selection.cross_val_predict(self.classifier, self.feature_data, self.target_data)

    def _get_cross_val_confusion_matrix(self) -> list:
        predicted = self._get_cross_val_predict()
        return skl.metrics.confusion_matrix(self.target_data, predicted).tolist()

    def fit(self):
        clf = skl.tree.DecisionTreeClassifier(criterion=self.criterion, max_depth=self.max_depth,
                                              min_samples_split=self.min_samples_split,
                                              min_samples_leaf=self.min_samples_leaf,
                                              min_impurity_decrease=self.min_impurity_decrease,
                                              random_state=self.random_state)

        clf.fit(self.feature_data, self.target_data)

        self.classifier = clf

        return self

    def get_decision_tree(self) -> dict:

        important_features = self._get_top_features()

        conf_matrix = self._get_cross_val_confusion_matrix()

        returned_tree = self.tree_to_dictionary()

        tree_summary = {"total_depth": max(self.tree_depth), "total_nodes": self.classifier.tree_.node_count}

        tree_dict = {"class_labels": self.labels, "tree_json": returned_tree, "tree_summary": tree_summary,
                     "confusion_matrix": conf_matrix, "important_features": important_features}

        return tree_dict
