from django.shortcuts import render
from .serializers import EventSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .models import Event

# Create your views here.
class EventView(APIView):
    def get(self, request, format=None):
        events = Event.objects.all()
        serializer = EventSerializer(events, many=True)
        
        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )