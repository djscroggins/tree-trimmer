const treeTrimmer = function () {
    const newTreeTrimmer = {

        renderApp: function (ml_results, parameters, updateInteractionParameters) {
        draw_accuracy_report({
            container: '#accuracy-report',
            matrix: ml_results.confusion_matrix
        });

        draw_params_table({
            container: '#parameter-table',
            parameters: parameters
        });


        draw_tree_summary({
            container: "#tree-summary",
            summary: ml_results.tree_summary
        });

        // console.log("Tree JSON");
        // console.log(ml_results.tree_json);

        // TODO: Update this function to take object style parameters, correct display issues
        // draw_decision_tree(ml_results.tree_json);
        draw_decision_tree({
            data: ml_results.tree_json,
            container: '#tree-container'
        });

        draw_confusion_matrix({
            container: '#matrix',
            matrix: ml_results.confusion_matrix,
            labels: ml_results.class_labels,
            start_color: '#ffffff',
            end_color: '#042E8D'
        });

        draw_feature_table({
            container: '#important-features',
            features: ml_results.important_features,
            current_parameters: parameters,
            updateInteractionParameters: updateInteractionParameters
        });
        }

    };
    return newTreeTrimmer;
};
