from flask_restplus import Api
from src.api.files import files
from src.api.decision_trees import decision_trees

tree_trimmer_api = Api(title='TreeTrimmer', version='1', description='API for Tree Trimmer', doc='/api/v1')

tree_trimmer_api.add_namespace(files)
tree_trimmer_api.add_namespace(decision_trees)
