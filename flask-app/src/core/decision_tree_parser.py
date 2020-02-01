from typing import List, Dict, Union

from flask import current_app
import numpy as np
from sklearn.tree import DecisionTreeClassifier
from pytypes import typechecked


class DecisionTreeParser:
    """
    Class for parsing scikit-learn DecisionTreeClassifier tree data structure.
    """

    # @typechecked
    def __init__(self, clf: DecisionTreeClassifier, **kwargs: dict) -> None:
        assert ('data' and 'parameters' in kwargs)
        data, parameters = kwargs.get('data'), kwargs.get('parameters')
        self.classifier = clf
        self.tree_depth = set([])
        self.feature_values = data.get('feature_values')
        self.feature_names = data.get('feature_names')
        self.target_data = data.get('target')
        self.criterion = parameters.get('criterion')
        self.labels = data.get('labels').tolist()
        self._logger = current_app.logger

    # @typechecked
    def _get_node_data(self, node_index: int, leaf: bool = False) \
            -> Dict[str, Union[List[List[int]], List[Union[np.float64, str]], int]]:
        """
        Gets summary data for tree node

        Args:
            node_index (int): current node index
            leaf (bool): leaf or not

        Returns:
            dict of summary data

        """
        impurity_score = self.classifier.tree_.impurity[node_index]
        impurity = [self.criterion, round(impurity_score, 3)]

        n_node_samples = int(self.classifier.tree_.n_node_samples[node_index])

        node_class_zip = zip(self.classifier.tree_.value[node_index, 0], self.labels)
        node_class_counts = [[label, int(count)] for count, label in node_class_zip]

        if leaf:
            return dict(impurity=impurity, n_node_samples=n_node_samples, node_class_counts=node_class_counts)
        else:
            split_feature = self.feature_names[self.classifier.tree_.feature[node_index]]
            split_threshold = self.classifier.tree_.threshold[node_index]
            split = [split_feature, round(split_threshold, 3)]
            return dict(split=split, impurity=impurity, n_node_samples=n_node_samples,
                        node_class_counts=node_class_counts)

    # @typechecked
    def _get_impurity_decrease_data(self, node_index: int, left_index: np.int64, right_index: np.int64,
                                    origin_impurity: float) -> Dict[str, np.float64]:
        """
        Gets node impurity change summary data

        Args:
            node_index (np.int64):
            left_index (np.int64):
            right_index (np.int64):
            origin_impurity (float): impurity at original split

        Returns:
            dict with weighted impurity decrease and % impurity decrease
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

        return dict(weighted_impurity_decrease=impurity_decrease, percentage_impurity_decrease=percentage_decrease)

    # @typechecked
    def _parse_to_dictionary(self, node_index: int = 0, depth: int = 0, origin_impurity_in: float = 0.0) -> dict:
        """
        Parses DecisionTreeClassifier tree structure to Python dict in D3.js hierarchical format

        Args:
            node_index (int):
            depth (int):
            origin_impurity_in (float):

        Returns:
            dict
        """
        test_dict = {}

        if self.classifier.tree_.children_left[node_index] == -1:  # see source code: TREE_LEAF = -1

            self.tree_depth.add(depth)
            test_dict['leaf'] = {}

            test_dict['leaf']['node_depth'] = depth

            node_data = self._get_node_data(node_index, True)
            test_dict['leaf'].update(node_data)

        else:

            origin_impurity = self.classifier.tree_.impurity[
                node_index].item() if node_index == 0 else origin_impurity_in

            left_index = self.classifier.tree_.children_left[node_index]
            right_index = self.classifier.tree_.children_right[node_index]

            test_dict['node'] = {}

            test_dict['node']['node_depth'] = depth

            node_data = self._get_node_data(node_index)
            test_dict['node'].update(node_data)

            impurity_data = self._get_impurity_decrease_data(node_index, left_index, right_index, origin_impurity)
            test_dict['node'].update(impurity_data)

            test_dict['children'] = [
                self._parse_to_dictionary(node_index=right_index.item(), depth=depth + 1,
                                          origin_impurity_in=origin_impurity),
                self._parse_to_dictionary(node_index=left_index.item(), depth=depth + 1,
                                          origin_impurity_in=origin_impurity)]

        return test_dict

    # @typechecked
    def parse(self) -> dict:
        tree_dict = self._parse_to_dictionary()
        tree_summary = dict(total_depth=max(self.tree_depth), total_nodes=self.classifier.tree_.node_count)
        return dict(tree_json=tree_dict, tree_summary=tree_summary)
