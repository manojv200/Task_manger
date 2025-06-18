from django.contrib.auth.models import AbstractUser, PermissionsMixin
from django.db import models

# Create your models here.

class TblUser(AbstractUser, PermissionsMixin):
    token_version = models.IntegerField(default=1)
    mobile_no = models.CharField(max_length=11, unique=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    class Meta:
        db_table = 'tbl_user'

class Task(models.Model):
    priorities= [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]
    status_choices = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    ]
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(TblUser, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description = models.TextField()
    due_date = models.IntegerField()
    priority = models.CharField(max_length=20, choices=priorities, default='low')
    status = models.CharField(max_length=20, choices=status_choices, default='pending')
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)
    class Meta:
        db_table = 'tbl_task'

class Report(models.Model):
    title = models.CharField(max_length=100)
