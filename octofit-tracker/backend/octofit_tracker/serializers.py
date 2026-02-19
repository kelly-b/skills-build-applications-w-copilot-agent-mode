from rest_framework import serializers
from .models import Team, User, Activity, Workout, Leaderboard

class TeamSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()

    class Meta:
        model = Team
        fields = ['id', 'name', 'description']

    def get_id(self, obj):
        """Return a stable string ID derived from the Django PK (already
        normalized by the migration)."""
        pk = getattr(obj, 'pk', None)
        return str(pk) if pk is not None else None

class UserSerializer(serializers.ModelSerializer):
    # return human-friendly team name and a safe team id (string) to avoid
    # non-serializable ObjectId values leaking into the API response
    team = serializers.SlugRelatedField(read_only=True, slug_field='name')
    team_id = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'team', 'team_id']

    def get_team_id(self, obj):
        """Return the team's PK as a string (or None). Assumes DB has been
        normalized so Team PK is available."""
        team = getattr(obj, 'team', None)
        if team and getattr(team, 'pk', None) is not None:
            return str(team.pk)
        return None

class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = '__all__'

class WorkoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workout
        fields = '__all__'

class LeaderboardSerializer(serializers.ModelSerializer):
    # expose team name and a safe team identifier string to avoid ObjectId
    team = serializers.SlugRelatedField(read_only=True, slug_field='name')
    team_id = serializers.SerializerMethodField()

    class Meta:
        model = Leaderboard
        fields = ['id', 'team', 'team_id', 'score']

    def get_team_id(self, obj):
        team = getattr(obj, 'team', None)
        if team and getattr(team, 'pk', None) is not None:
            return str(team.pk)
        return None
