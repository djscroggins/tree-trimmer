#!/usr/bin/env bash
source .env-tree-trimmer/bin/activate
export FLASK_CONFIG=dev
python run.py
