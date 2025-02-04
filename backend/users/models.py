from django.db import models
from django.contrib.auth.models import User

class Task(models.Model):
    title = models.CharField(max_length=50)
    description = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tasks")

    def __str__(self):
        return self.title
    
class Event(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField()
    date = models.DateTimeField()

    def __str__(self):
        return self.name