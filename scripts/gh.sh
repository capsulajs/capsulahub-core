#!/usr/bin/env bash
SERVICE=$1
URL=$2
COMMENTS_URL="https://api.github.com/repos/$TRAVIS_REPO_SLUG/issues/$TRAVIS_PULL_REQUEST/comments"

link="[**S3**](${URL}index.js)"

commentAlreadyExists() {
    comments=$(curl -s -u "$GH_USER:$GH_ACCESS_TOKEN" "$COMMENTS_URL" | jq -r '.[].body')
    [[ "$comments" == *"$1"* ]]
    return $?
}

comment(){
    COMMENT_TEXT="""
**Travis-CI**
<table>
    <tr>
        <td><h2>$SERVICE</h2><br />deployed on $link</td>
    </tr>
</table>
"""

    echo "$COMMENT_TEXT"
    # Post comment about service if it's not posted yet
    commentAlreadyExists "$COMMENT_TEXT" && echo "Comment already posted" || \
    curl -d '{"body":"'"$COMMENT_TEXT"'"}' -u "$GH_USER:$GH_ACCESS_TOKEN" -X POST "$COMMENTS_URL"
    echo "done."
}

comment

