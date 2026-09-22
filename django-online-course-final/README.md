# IBM Django Final Project — Online Course Assessment

This folder contains a complete Django implementation for the IBM final project
"Add a New Assessment Feature to an Online Course App".

## Grading files
- `onlinecourse/models.py` — Question, Choice, Submission
- `onlinecourse/admin.py` — seven imported model classes + required inline/admin classes
- `onlinecourse/templates/onlinecourse/course_details_bootstrap.html` — Bootstrap course details and lessons
- `onlinecourse/views.py` — submit and show_exam_result
- `onlinecourse/urls.py` — submit and show_exam_result routes

Tasks 3 and 7 require screenshots from a real running Django application.


## Run locally
```bash
python -m pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python seed_demo.py
python manage.py runserver
```

Demo login: `demo` / `demo123`

For Task 3, open `/admin/` and capture the admin home page showing both "Authentication and Authorization" and "OnlineCourse". For Task 7, log in as demo, open the course, start the exam, select the correct choices, submit, and capture the result page showing "Congratulations", the score, and "Exam results".
