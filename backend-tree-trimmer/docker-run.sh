#!/usr/bin/env bash
source ../.env.build
container=$(docker run -d -p 5000:80 api-tree-trimmer:${API_BUILD}) \
&& sleep 5 \
&& open http://localhost:5000/api/v1 \
&& docker logs -f $container
