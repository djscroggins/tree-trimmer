#!/usr/bin/env bash
source ../.env
docker build -t api-tree-trimmer:${API_BUILD} .
