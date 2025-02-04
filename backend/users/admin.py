from django.contrib import admin
from .models import Task, Event

# Register your models here.
admin.site.register(Task)
admin.site.register(Event)