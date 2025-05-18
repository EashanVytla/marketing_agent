from django.shortcuts import render

# Create your views here.
from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.contrib import messages

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .serializers import *
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator

@method_decorator(ensure_csrf_cookie, name='dispatch')
class JobView(APIView):
    def post(self, request, format=None):
        serializer = JobSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()

            return Response(
                {
                    "success": True,
                    "message": "Job successfully created"
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