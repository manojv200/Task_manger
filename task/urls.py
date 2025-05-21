from django.urls import path

from task.views import RegisterView, LoginView, DashBoardView, TaskListView, CreateTaskView, TaskUpdateView, \
    TaskDeleteView, change_password

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('dashboard/', DashBoardView.as_view(), name='dashboard'),
    path('create_task/', CreateTaskView.as_view(), name='create_task'),
    path('tasks/', TaskListView.as_view(), name='tasks'),
    path('update_task/<int:pk>', TaskUpdateView.as_view(), name='update_task'),
    path('delete_task/<int:pk>', TaskDeleteView.as_view(), name='delete_task'),
    path('change_password/', change_password, name='change_password'),
]