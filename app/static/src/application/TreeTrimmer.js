const accuracyReport = AccuracyReport();
const decisionTree = DecisionTree();
const paramsTable = ParamsTable();
const treeSummary = TreeSummary();
const confusionMatrix = ConfusionMatrix();
const featureTable = FeatureTable();

const TreeTrimmer = function () {
    const newTreeTrimmer = {

        renderApp: function (ml_results, parameters, updateInteractionParameters, retrainTree) {
        accuracyReport.renderAccuracyReport({
            container: '#accuracy-report',
            matrix: ml_results.confusion_matrix
        });

        paramsTable.renderParamsTable({
            container: '#parameter-table',
            parameters: parameters
        });


        treeSummary.renderTreeSummary({
            container: "#tree-summary",
            summary: ml_results.tree_summary
        });

        // console.log("Tree JSON");
        // console.log(ml_results.tree_json);

        // TODO: Update this function to take object style parameters, correct display issues
        // draw_decision_tree(ml_results.tree_json);
        decisionTree.renderDecisionTree({
            data: ml_results.tree_json,
            container: '#tree-container',
            updateInteractionParameters: updateInteractionParameters,
            retrainTree: retrainTree
        });

        confusionMatrix.renderConfusionMatrix({
            container: '#matrix',
            matrix: ml_results.confusion_matrix,
            labels: ml_results.class_labels,
            start_color: '#ffffff',
            end_color: '#042E8D'
        });

        featureTable.renderFeatureTable({
            container: '#important-features',
            features: ml_results.important_features,
            currentParameters: parameters,
            updateInteractionParameters: updateInteractionParameters,
            retrainTree: retrainTree
        });
        }

    };
    return newTreeTrimmer;
};
