from django.contrib.auth import authenticate
from rest_framework import serializers
from task.helpers.jwt_handler import create_access_token, create_refresh_token

from task.models import TblUser, Task


class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = TblUser
        fields = ['first_name', 'last_name', 'mobile_no', 'email', 'password']

    def create(self, validated_data):
        print(validated_data)
        user = TblUser.objects.create_user(
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            mobile_no=validated_data['mobile_no'],
            email=validated_data['email'],
            username=validated_data['email'],
            password=validated_data['password']
        )
        access_token = create_access_token(user.id)
        refresh_token = create_refresh_token(user.id)
        user.access_token = access_token
        user.refresh_token = refresh_token
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    class Meta:
        model = TblUser
        fields = ['id', 'username', 'password']

    def validate(self, data):
        user = authenticate(username=data['username'], password=data['password'])
        if not user:
            raise serializers.ValidationError('Invalid username or password')
        access_token = create_access_token(user.id)
        refresh_token = create_refresh_token(user.id)
        user.access_token = access_token
        user.refresh_token = refresh_token
        data['user'] = user
        return data


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'user', 'title', 'description', 'due_date', 'priority', 'status']

    def create(self, validated_data):
        task = Task.objects.create(**validated_data)
        return task

    def update(self, instance, validated_data):
        for k, v in validated_data.items():
            setattr(instance, k, v)
        instance.save()
        return instance
