#!/bin/bash

directory="test-states"

function iterate() {
    local dir="test-states"

    for file in "$dir"/*; do
        if [ -f "$file" ]; then
            PROJECT_ID=`cat "$file" | xargs`
            curl --location --request DELETE 'https://app.corbado-dev.com/v1/projects' \
                --header 'Content-Type: text/plain' \
                --header 'Cookie: cbo_short_session='"$PLAYWRIGHT_JWT_TOKEN"'' \
                --data '{ "id": "'"$PROJECT_ID"'" }'
            rm "$file"
        fi
    done
}

iterate "$directory"
