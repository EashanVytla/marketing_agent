from django.shortcuts import render
from .serializers import EventSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .models import Event
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator

# Create your views here.
@method_decorator(ensure_csrf_cookie, name='dispatch')
class EventView(APIView):
    def get(self, request, format=None):
        events = Event.objects.all()
        serializer = EventSerializer(events, many=True)
        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )
    def post(self, request, format=None):
        serializer = EventSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)