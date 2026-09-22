from django.conf import settings
from django.db import models
from django.utils.timezone import now


class Instructor(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    full_time = models.BooleanField(default=True)
    total_learners = models.IntegerField(default=0)

    def __str__(self):
        return self.user.username


class Learner(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    STUDENT = "student"
    DEVELOPER = "developer"
    DATA_SCIENTIST = "data_scientist"
    DATABASE_ADMIN = "dba"
    OCCUPATION_CHOICES = [
        (STUDENT, "Student"),
        (DEVELOPER, "Developer"),
        (DATA_SCIENTIST, "Data Scientist"),
        (DATABASE_ADMIN, "Database Admin"),
    ]
    occupation = models.CharField(
        max_length=20, choices=OCCUPATION_CHOICES, default=STUDENT
    )
    social_link = models.URLField(max_length=200, blank=True, null=True)

    def __str__(self):
        return f"{self.user.username},{self.occupation}"


class Course(models.Model):
    name = models.CharField(max_length=30, default="Online Course")
    image = models.ImageField(upload_to="course_images/", blank=True, null=True)
    description = models.CharField(max_length=1000)
    pub_date = models.DateField(null=True, blank=True)
    instructors = models.ManyToManyField(Instructor, blank=True)
    users = models.ManyToManyField(
        settings.AUTH_USER_MODEL, through="Enrollment", blank=True
    )
    total_enrollment = models.IntegerField(default=0)
    is_enrolled = False

    def __str__(self):
        return self.name


class Lesson(models.Model):
    title = models.CharField(max_length=200, default="Lesson number X")
    order = models.IntegerField(default=0)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    content = models.TextField()

    def __str__(self):
        return self.title


class Enrollment(models.Model):
    AUDIT = "audit"
    HONOR = "honor"
    BETA = "BETA"
    COURSE_MODES = [
        (AUDIT, "Audit"),
        (HONOR, "Honor"),
        (BETA, "BETA"),
    ]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    date_enrolled = models.DateField(default=now)
    mode = models.CharField(max_length=5, choices=COURSE_MODES, default=AUDIT)
    rating = models.FloatField(default=5.0)

    def __str__(self):
        return f"Enrollment for user {self.user} for course {self.course}"


# New assessment model 1
class Question(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    question_text = models.CharField(max_length=200)
    grade = models.IntegerField(default=1)

    def is_get_score(self, selected_ids):
        correct_count = self.choice_set.filter(is_correct=True).count()
        selected_correct = self.choice_set.filter(
            is_correct=True, id__in=selected_ids
        ).count()
        return correct_count == selected_correct

    def __str__(self):
        return self.question_text


# New assessment model 2
class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    choice_text = models.CharField(max_length=200)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.choice_text


# New assessment model 3
class Submission(models.Model):
    enrollment = models.ForeignKey(Enrollment, on_delete=models.CASCADE)
    choices = models.ManyToManyField(Choice)
    date_submitted = models.DateField(default=now, editable=False)
    time = models.TimeField(default=now, editable=False)

    def __str__(self):
        return (
            f"Submission posted on {self.date_submitted} at {self.time} "
            f"for {self.enrollment}"
        )
