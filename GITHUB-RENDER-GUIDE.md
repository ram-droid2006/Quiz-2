# GitHub and Render Guide

This project should be in a **private GitHub repository** because the answer keys
are inside the JavaScript question-bank files.

## What Goes on GitHub

Upload these files for the website to work:

```text
package.json
server.js

index.html
homework-1.html
homework-2.html

styles.css
homework.css

app.js
homework-app.js
homework-report.js
icons.js
diagrams.js

exam-engine.js
adaptive-bank.js
questions.js

homework-engine.js
homework-bank.js
homework-passages.json

homework-2-engine.js
homework-2-bank.js
homework-2-passages.json

vendor/pdf-lib.min.js
vendor/LICENSE.md
```

Helpful documents you can also upload:

```text
README.md
DEPLOYMENT.md
HOMEWORK-1.md
HOMEWORK-2.md
GITHUB-RENDER-GUIDE.md
```

If GitHub does not let you make a folder, type the folder name in the file name
box. For example, to add the PDF library, name the file:

```text
vendor/pdf-lib.min.js
```

GitHub will create the `vendor` folder automatically.

## What Not to Put on GitHub

Do not upload these:

```text
data/
attempts.sqlite
attempts.sqlite-wal
attempts.sqlite-shm
node_modules/
.env
.DS_Store
screenshots
downloaded student result PDFs
raw student files
temporary test folders
```

You also do not need these files for Render:

```text
test-adaptive.cjs
test-homework.cjs
test-homework-2.cjs
test-browser.cjs
test-adaptive-browser.cjs
test-homework-browser.cjs
test-homework-2-browser.cjs
extract-homework-passages.py
build.js
form-builder.js
Diagnostic50.gs
```

They are useful locally, but the hosted student website does not need them.

## Render Settings

Create or open your Render **Web Service** connected to the GitHub repository.

Use these settings:

```text
Runtime / Language: Node
Build Command: npm install
Start Command: node server.js
```

Root Directory depends on how GitHub is organized:

```text
If package.json is at the top of the GitHub repo:
Root Directory: leave blank

If package.json is inside a folder named diagnostic-50:
Root Directory: diagnostic-50
```

Render environment variables:

```text
HOST=0.0.0.0
BRCDC_SECURE_COOKIE=1
```

Optional timer settings:

```text
BRCDC_EXAM_MINUTES=90
BRCDC_HOMEWORK_MINUTES=60
BRCDC_HOMEWORK_2_MINUTES=60
```

Do not set this unless you actually added a Render persistent disk:

```text
BRCDC_DATA_DIR=/var/data
```

If you cannot add a persistent disk, that is okay for a pilot. Leave
`BRCDC_DATA_DIR` blank. Students should download their results PDF at the end and
attach it to Google Classroom.

## Render Links to Use

After Render deploys, use your public HTTPS link, not `127.0.0.1`.

```text
Diagnostic exam:
https://YOUR-RENDER-SITE.onrender.com/index.html

Homework Quiz #1:
https://YOUR-RENDER-SITE.onrender.com/homework-1/

Homework Quiz #2:
https://YOUR-RENDER-SITE.onrender.com/homework-2/
```

Post the correct Render link in Google Classroom. Do not post a local link such
as `http://127.0.0.1:4318`, because that only works on your own computer.

## Quick Check Before Giving Students the Link

1. Open the Render link yourself.
2. Start a test attempt with a fake student name.
3. Answer a few questions.
4. Refresh the page and make sure the attempt is still there.
5. Finish or let the timer end.
6. Download the results PDF.
7. Open the PDF and make sure the questions, answers, and passages appear.

If those checks pass, the link is ready for Google Classroom.
