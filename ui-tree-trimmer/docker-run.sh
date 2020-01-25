#!/usr/bin/env bash
source ../.env
container=$(docker run -d -p 3000:3000 ui-tree-trimmer:${UI_BUILD}) \
&& open http://localhost:3000/ \
&& docker logs -f $container
