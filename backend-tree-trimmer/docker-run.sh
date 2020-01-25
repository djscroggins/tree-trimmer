#!/usr/bin/env bash
container=$(docker run -d -p 5000:80 api-tree-trimmer:0.0.2) \
&& sleep 5 \
&& open http://localhost:5000/api/v1 \
&& docker logs -f $container
