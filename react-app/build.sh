#!/usr/bin/env bash
source ../.env
docker build -t ui-tree-trimmer:${UI_BUILD} .
