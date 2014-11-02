#!/bin/bash

hexo generate
cd public
aws s3 sync . s3://drhayes.io --recursive --grants read=http://acs.amazonaws.com/groups/global/AllUsers

