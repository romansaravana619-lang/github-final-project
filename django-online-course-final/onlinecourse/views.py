from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse
from django.views import generic

from .models import Choice, Course, Enrollment, Submission


def registration_request(request):
    context = {}
    if request.method == "GET":
        return render(request, "onlinecourse/user_registration_bootstrap.html", context)

    username = request.POST.get("username", "").strip()
    password = request.POST.get("psw", "")
    first_name = request.POST.get("firstname", "")
    last_name = request.POST.get("lastname", "")

    if User.objects.filter(username=username).exists():
        context["message"] = "User already exists."
        return render(request, "onlinecourse/user_registration_bootstrap.html", context)

    user = User.objects.create_user(
        username=username,
        first_name=first_name,
        last_name=last_name,
        password=password,
    )
    login(request, user)
    return redirect("onlinecourse:index")


def login_request(request):
    context = {}
    if request.method == "POST":
        username = request.POST.get("username", "")
        password = request.POST.get("psw", "")
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect("onlinecourse:index")
        context["message"] = "Invalid username or password."
    return render(request, "onlinecourse/user_login_bootstrap.html", context)


def logout_request(request):
    logout(request)
    return redirect("onlinecourse:index")


def check_if_enrolled(user, course):
    if not user.is_authenticated:
        return False
    return Enrollment.objects.filter(user=user, course=course).exists()


class CourseListView(generic.ListView):
    template_name = "onlinecourse/course_list_bootstrap.html"
    context_object_name = "course_list"

    def get_queryset(self):
        courses = Course.objects.order_by("-total_enrollment")[:10]
        for course in courses:
            course.is_enrolled = check_if_enrolled(self.request.user, course)
        return courses


class CourseDetailView(generic.DetailView):
    model = Course
    template_name = "onlinecourse/course_details_bootstrap.html"


def enroll(request, course_id):
    course = get_object_or_404(Course, pk=course_id)
    if request.user.is_authenticated and not check_if_enrolled(request.user, course):
        Enrollment.objects.create(user=request.user, course=course, mode="honor")
        course.total_enrollment += 1
        course.save()
    return HttpResponseRedirect(
        reverse("onlinecourse:course_details", args=(course.id,))
    )


def extract_answers(request):
    submitted_answers = []
    for key in request.POST:
        if key.startswith("choice"):
            submitted_answers.append(int(request.POST[key]))
    return submitted_answers


# Task 5: Submit exam
def submit(request, course_id):
    course = get_object_or_404(Course, pk=course_id)
    enrollment = get_object_or_404(
        Enrollment, user=request.user, course=course
    )
    submission = Submission.objects.create(enrollment=enrollment)
    selected_ids = extract_answers(request)
    submission.choices.set(Choice.objects.filter(id__in=selected_ids))
    return HttpResponseRedirect(
        reverse("onlinecourse:show_exam_result", args=(course_id, submission.id))
    )


# Task 5: Show evaluated exam result
def show_exam_result(request, course_id, submission_id):
    course = get_object_or_404(Course, pk=course_id)
    submission = get_object_or_404(Submission, pk=submission_id)

    selected_ids = list(submission.choices.values_list("id", flat=True))
    total_grade = 0
    earned_grade = 0

    for lesson in course.lesson_set.all():
        for question in lesson.question_set.all():
            total_grade += question.grade
            if question.is_get_score(selected_ids):
                earned_grade += question.grade

    grade = round((earned_grade / total_grade) * 100) if total_grade else 0

    return render(
        request,
        "onlinecourse/exam_result_bootstrap.html",
        {
            "course": course,
            "grade": grade,
            "choices": submission.choices.all(),
        },
    )
