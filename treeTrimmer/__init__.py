from flask import Flask, render_template

app = Flask(__name__)

from treeTrimmer import routes
