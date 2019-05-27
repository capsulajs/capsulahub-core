#!/usr/bin/env bash
SERVICE=$1
URL=$2

comment(){

    COMMENT_TEXT="""
**Travis-CI**
<table>
    <tr>
        <td><h2>$SERVICE</h2><br />deployed on $URL</td>
    </tr>
</table>
"""

    REQUEST='{"body": "$(echo $COMMENT_TEXT)"'
    echo $REQUEST
    curl -d $REQUEST -u "$GH_USER:$GH_ACCESS_TOKEN" -X POST https://api.github.com/repos/$TRAVIS_REPO_SLUG/issues/$TRAVIS_PULL_REQUEST/comments
    echo "done."
}

comment
