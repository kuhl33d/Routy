#!/bin/bash

# Check if a directory is provided as an argument
if [ -z "$1" ]; then
  echo "Usage: $0 <directory>"
  exit 1
fi

# Check if the provided argument is a directory
if [ ! -d "$1" ]; then
  echo "Error: $1 is not a directory"
  exit 1
fi

# Assign the directory to a variable
DIR="$1"

# Iterate through each file in the directory
for file in "$DIR"/*; do
  # Check if it is a file
  if [ -f "$file" ]; then
    # Display the directory name
    echo "Directory: $DIR"
    # Display the file name
    echo "File: $(basename "$file")"
    # Display the contents of the file
    cat "$file"
    echo "------------------------------------"
  fi
done
