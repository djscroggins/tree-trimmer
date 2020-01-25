#!/usr/bin/env bash
container=$(docker run -d -p 3000:3000 ui-tree-trimmer:0.0.1) \
&& open http://localhost:3000/ \
&& docker logs -f $container
