#!/usr/bin/env bash
source ./.env-tree-trimmer/bin/activate
export $(cat .env | xargs)
python run.py
