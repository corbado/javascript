#!/bin/bash

set -e

VERSION=""

# Parse the command-line options
while getopts ":v:" opt; do
  case $opt in
    v)
      VERSION=$OPTARG
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      exit 1
      ;;
    :)
      echo "Option -$OPTARG requires an argument." >&2
      exit 1
      ;;
  esac
done

# Check if the version option was provided
if [ -z "$VERSION" ]; then
  echo "Version not provided. Usage: ./deploy_connect_web_js.sh -v <version>"
  exit 1
fi

BUILD_DIR="packages/connect-web-js/dist/bundle"
S3_BUCKET="s3://corbado-cdn/connect/dist"
AWS_PROFILE="corbado-vr-staging"
NPM_BUILD_CMD="lerna run build:bundler:local"

echo "Running npm build command: $NPM_BUILD_CMD"
$NPM_BUILD_CMD

# Check if the build was successful
if [ $? -ne 0 ]; then
  echo "Build failed. Exiting."
  exit 1
fi

# Check if the build directory exists
if [ ! -d "$BUILD_DIR" ]; then
  echo "Build directory $BUILD_DIR does not exist. Exiting."
  exit 1
fi

if [ -f "$BUILD_DIR/index.js" ]; then
  echo "Uploading index.js as web-js-$VERSION.min.js"
  aws s3 cp "$BUILD_DIR/index.js" "$S3_BUCKET/web-js-$VERSION.min.js" --profile "$AWS_PROFILE"
  
  if [ $? -eq 0 ]; then
    echo "Successfully uploaded web-js-$VERSION.min.js to S3."
  else
    echo "Failed to upload web-js-$VERSION.min.js to S3."
    exit 1
  fi
else
  echo "index.js not found in $BUILD_DIR. Exiting."
  exit 1
fi

if [ -f "$BUILD_DIR/index.css" ]; then
  echo "Uploading index.css as web-js-$VERSION.min.css"
  aws s3 cp "$BUILD_DIR/index.css" "$S3_BUCKET/web-js-$VERSION.min.css" --profile "$AWS_PROFILE"
  
  if [ $? -eq 0 ]; then
    echo "Successfully uploaded web-js-$VERSION.min.css to S3."
  else
    echo "Failed to upload web-js-$VERSION.min.css to S3."
    exit 1
  fi
else
  echo "index.css not found in $BUILD_DIR. Exiting."
  exit 1
fi

echo "All files successfully uploaded to S3."
