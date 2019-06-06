from flask_restplus import Api
from .files import files
from .root import root
from .decision_trees import decision_trees
from .cats import api as cats

# data_dict = dict()

tree_trimmer_api = Api(title='TreeTrimmer', version='1', description='API for Tree Trimmer')

# tree_trimmer_api.add_namespace(cats)
tree_trimmer_api.add_namespace(root)
tree_trimmer_api.add_namespace(files)
tree_trimmer_api.add_namespace(decision_trees)

