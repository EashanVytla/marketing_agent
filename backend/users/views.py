from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.contrib import messages

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .serializers import *
from .models import Event
from django.views.decorators.csrf import ensure_csrf_cookie

from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated

from rest_framework.authtoken.models import Token

class RegistrationView(APIView):
    def post(self, request, format=None):
        serializer = RegistrationSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()

            return Response(
                {
                    "success": True,
                    "message": "Account successfully created"
                },
                status=status.HTTP_200_OK
            )
        
        return Response(
            {
                "success": True,
                "message": serializer.error_messages
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    
class LoginView(APIView):
    def post(self, request, format=None):
        print(request.data)
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data

            login(request, user)
            print("Session key after login:", request.session.session_key)

            return Response(
                {
                    "success": True,
                    "message": "Login successful",
                    "user": {
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                    }
                },
                status=status.HTTP_200_OK
            )
        
        return Response(
            {
                "success": False,
                "message": serializer.error_messages
            },
            status=status.HTTP_400_BAD_REQUEST
        )

class TaskView(APIView):
    authentication_classes=[ SessionAuthentication ]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        if request.user.is_authenticated:
            tasks = request.user.tasks.all()
            serializer = TaskSerializer(tasks, many=True)
            
            return Response(
                serializer.data,
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                {
                    "message": "User not authenticated",
                },
                status=status.HTTP_401_UNAUTHORIZED
            )
        
class EventView(APIView):
    def get(self, request, format=None):
        events = Event.objects.all()
        serializer = EventSerializer(events, many=True)
        
        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )