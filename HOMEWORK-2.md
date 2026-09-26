# Homework Quiz #2

Open `/homework-2/` on the running server. Quiz #1 remains at `/homework-1/`.
Each quiz has a separate saved attempt, so a student can complete both in the same browser.

## Assignment

- 33 new Form B questions: 17 Math and 16 English.
- Math source questions: 75-91.
- English source questions: 10-15 and 23-32.
- Reading: Moving through Mountains, an excerpt from Do Them No Harm!, and a short Invention of the Telegraph excerpt.
- The questions and answer choices are reworded, and choices are shuffled for every attempt.
- Box plots and circular plates have diagrams in the quiz and downloaded report.

## Behavior

Quiz #2 has the same adaptive order, 60-minute default active timer, pause button,
time warnings, locked answers, skill metrics, and complete results PDF as Quiz #1.
Set `BRCDC_HOMEWORK_2_MINUTES` to change Quiz #2's time allowance for new attempts;
otherwise it uses `BRCDC_HOMEWORK_MINUTES`, then 60 minutes.

The results PDF contains all 33 questions, including unanswered ones. It includes
the displayed choices, student answers, correct answers, explanations, diagrams,
and each reading passage beside its question. Students should download the PDF
and attach it to the Google Classroom assignment.

## Render

Add these new files to the same GitHub repository:

- `homework-2.html`
- `homework-2-bank.js`
- `homework-2-engine.js`
- `homework-2-passages.json`

Replace these existing files with the updated versions:

- `server.js`
- `homework-engine.js`
- `homework-app.js`
- `homework-report.js`
- `homework-1.html`
- `diagrams.js`
- `package.json`

Keep all Quiz #1 and diagnostic runtime files already on Render. The server still
loads them. `test-homework-2.cjs` and `test-homework-2-browser.cjs` are local tests
and are not needed for the website. Do not upload the `data/` directory or student
results.

After GitHub has the updated files, redeploy the existing Render Web Service.
Use the public HTTPS service address followed by `/homework-2/` for Classroom.
Do not post a `127.0.0.1` address to students.
