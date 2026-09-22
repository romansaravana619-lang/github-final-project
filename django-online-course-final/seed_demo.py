import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "myproject.settings")
django.setup()

from django.contrib.auth.models import User
from onlinecourse.models import Course, Enrollment, Instructor, Learner, Lesson, Question, Choice

user, _ = User.objects.get_or_create(username="demo")
user.set_password("demo123")
user.first_name = "Demo"
user.is_staff = True
user.is_superuser = True
user.save()

instructor, _ = Instructor.objects.get_or_create(user=user, defaults={"full_time": True, "total_learners": 1})
course, _ = Course.objects.get_or_create(
    name="Django Online Course",
    defaults={
        "description": "Django assessment and online course demonstration.",
        "pub_date": "2026-09-22",
        "total_enrollment": 1,
    },
)
course.instructors.add(instructor)

enrollment, _ = Enrollment.objects.get_or_create(user=user, course=course, defaults={"mode": "honor"})
lesson, _ = Lesson.objects.get_or_create(
    course=course,
    order=0,
    defaults={"title": "Django Basics", "content": "Introduction to Django models, views, templates, and admin."},
)

q1, _ = Question.objects.get_or_create(
    lesson=lesson,
    question_text="Which language is Django primarily written in?",
    defaults={"grade": 1},
)
Choice.objects.get_or_create(question=q1, choice_text="Python", defaults={"is_correct": True})
Choice.objects.get_or_create(question=q1, choice_text="Java", defaults={"is_correct": False})
Choice.objects.get_or_create(question=q1, choice_text="C++", defaults={"is_correct": False})

q2, _ = Question.objects.get_or_create(
    lesson=lesson,
    question_text="Which Django component maps Python classes to database tables?",
    defaults={"grade": 1},
)
Choice.objects.get_or_create(question=q2, choice_text="ORM", defaults={"is_correct": True})
Choice.objects.get_or_create(question=q2, choice_text="CSS", defaults={"is_correct": False})
Choice.objects.get_or_create(question=q2, choice_text="Bootstrap", defaults={"is_correct": False})

print("Demo data ready: username=demo password=demo123")
