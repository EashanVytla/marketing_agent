from rest_framework import serializers
from .models import Job
from events.models import Event  # Import Event model

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = ["event", "description", "created_at"]
    
    def validate(self, data):
        event_data = data.get("event")
        
        # If event is provided as a string (name), try to find the event
        if isinstance(event_data, str):
            try:
                # Look for event by name
                event = Event.objects.filter(name__iexact=event_data).first()
                if not event:
                    raise serializers.ValidationError({"event": f"No event found with name '{event_data}'"})
                # Replace the string with the actual event object
                data["event"] = event
            except Exception as e:
                raise serializers.ValidationError({"event": str(e)})
        elif not event_data:
            raise serializers.ValidationError({"event": "Event is required."})
            
        if not data.get("description"):
            raise serializers.ValidationError({"description": "Description is required."})
            
        return data
    
    def create(self, validated_data):
        # No need for custom create - validated_data now has the correct Event object
        return Job.objects.create(**validated_data)