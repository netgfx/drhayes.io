#!/bin/bash

hexo generate
s3cmd sync --delete-removed build/ s3://drhayes.io/ -c ~/.s3cfg
