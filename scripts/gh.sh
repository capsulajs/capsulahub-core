#!/usr/bin/env bash
SERVICE=$1
URL=$2

comment(){

    COMMENT_TEXT="""
    **Travis-CI**
    <table>
        <TR>
            <TD><h2>$SERVICE</h2><br />deployed on $URL</TD>
        </TR>
    </TABLE>"""

    echo "$COMMENT_TEXT"
    curl -d '{"body":"'"$COMMENT_TEXT"'"}' -u "$GH_USER:$GT_ACCESS_TOKEN" -X POST https://api.github.com/repos/$TRAVIS_REPO_SLUG/issues/$TRAVIS_PULL_REQUEST/comments
    echo "done."
}

comment
