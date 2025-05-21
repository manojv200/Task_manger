import jwt
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView

from task.models import Task
from task.serializers import RegistrationSerializer, LoginSerializer, TaskSerializer


# Create your views here.

class AuthenticationCheck():
    def __init__(self, authentication_required=True):
        self.authentication_required = authentication_required

    def authenticate(self, request):
        if self.authentication_required and not request.user.is_authenticated:
            raise jwt.InvalidTokenError('Invalid token')
        return True


class RegisterView(APIView):
    def post(self, request):
        serializer = RegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()  # `user` contains tokens as attributes
            return Response({
                'user': RegistrationSerializer(user).data,
                'access_token': user.access_token,
                'refresh_token': user.refresh_token
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        access_token = user.access_token
        refresh_token = user.refresh_token
        return Response({
            'message': 'Successfully logged in',
            'user': LoginSerializer(user).data,
            'access_token': access_token,
            'refresh_token': refresh_token
        })


class DashBoardView(APIView):
    def post(self, request):
        AuthenticationCheck().authenticate(request)
        return Response({
            'message': 'Hello, world',
        })


class CreateTaskView(APIView):
    def post(self, request):
        AuthenticationCheck().authenticate(request)
        data = request.data.copy()
        data['user'] = request.user.id
        serializer = TaskSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'data':serializer.data, 'message':"Added Task Successfully", 'status':status.HTTP_201_CREATED})


class TaskListView(APIView):
    def get(self, request,):
        AuthenticationCheck().authenticate(request)
        print(request.query_params)
        serializer = TaskSerializer(Task.objects.all(), many=True)
        if request.query_params.get('status'):
            tasks = Task.objects.filter(status=request.query_params['status'], user=request.user)
            serializer = TaskSerializer(tasks, many=True)
            return Response({'data':serializer.data, 'status':status.HTTP_200_OK, 'tasks_count':tasks.count()})
        print(request.user)
        completed_tasks = Task.objects.filter(status='completed', user=request.user)
        pending_tasks = Task.objects.filter(status='pending', user=request.user)
        tasks = Task.objects.filter(user=request.user)
        serializer = TaskSerializer(Task.objects.filter(user=request.user), many=True)
        return Response({'data': serializer.data, 'status': status.HTTP_200_OK, 'total_tasks': tasks.count(),
                         'completed_tasks': completed_tasks.count(), 'pending_tasks': pending_tasks.count()})


class TaskUpdateView(APIView):
    def put(self, request, pk):
        AuthenticationCheck().authenticate(request)
        try:
            task = Task.objects.get(id=pk)
        except Task.DoesNotExist:
            return Response({'message': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = TaskSerializer(task, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


class TaskDeleteView(APIView):
    def delete(self, request, pk):
        AuthenticationCheck().authenticate(request)
        try:
            task = Task.objects.get(id=pk)
        except Task.DoesNotExist:
            return Response({'message': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)
        task.delete()
        return Response({'message': "Task Deleted", }, status=status.HTTP_200_OK)


@api_view(['POST', ])
def change_password(request):
    AuthenticationCheck().authenticate(request)
    if request.method == 'POST':
        user = request.user
        user.set_password(request.POST['password'])
        user.save()
        return Response({'message': 'Password Changed'}, status=status.HTTP_200_OK)
    return Response({'message': 'method is not post'}, status=status.HTTP_400_BAD_REQUEST)

# @api_view(['POST',])
# def refresh_token(request):
#     if request.method == 'POST':
