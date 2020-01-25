#!/usr/bin/env bash
source ../.env.build
docker build -t api-tree-trimmer:${API_BUILD} .
