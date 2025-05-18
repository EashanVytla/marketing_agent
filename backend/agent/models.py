from django.db import models
from django.db.models import JSONField
from pgvector.django import VectorField
from tasks.models import Task
from events.models import Event

class ChatMsg(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    role = models.CharField(max_length=10)     # "system" | "user" | "assistant"
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    
class Job(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    description = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)

class ContextItem(models.Model):
    """A single piece of context tied to a Job."""
    job         = models.ForeignKey(Job, on_delete=models.CASCADE, related_name="items")
    role        = models.CharField(max_length=10, choices=[("user","user"),("assistant","assistant"),("system","system")])
    content     = models.TextField(blank=True)           # for text
    media       = models.FileField(upload_to="job_media/")  # for images, videos, docs
    metadata    = JSONField(default=dict)                # e.g. { "page": 3, "format": "pdf" }
    embedding = VectorField(
        dimensions=768,
        help_text="Vector embeddings (clip-vit-large-patch14) of the file content",
        null=True,
        blank=True,
    )
    created_at  = models.DateTimeField(auto_now_add=True)