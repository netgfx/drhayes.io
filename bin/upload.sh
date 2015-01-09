#!/bin/bash

hexo generate
s3cmd sync --delete-removed public/ s3://drhayes.io/ -c ~/.s3cfg
