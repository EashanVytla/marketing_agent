from django.shortcuts import render
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from .serializers import TaskSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

# Create your views here.
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