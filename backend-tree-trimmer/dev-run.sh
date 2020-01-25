#!/usr/bin/env bash
export $(cat .env | xargs)
source ./.env-tree-trimmer/bin/activate
python run.py
