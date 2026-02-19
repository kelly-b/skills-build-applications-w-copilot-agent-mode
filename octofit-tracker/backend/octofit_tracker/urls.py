"""octofit_tracker URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
import os
from rest_framework.routers import DefaultRouter
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .views import TeamViewSet, UserViewSet, ActivityViewSet, WorkoutViewSet, LeaderboardViewSet

router = DefaultRouter()
router.register(r'teams', TeamViewSet)
router.register(r'users', UserViewSet)
router.register(r'activities', ActivityViewSet)
router.register(r'workouts', WorkoutViewSet)
router.register(r'leaderboard', LeaderboardViewSet)

@api_view(['GET'])
def api_root(request, format=None):
    """Return API root with Codespaces host when available."""
    codespace = os.environ.get('CODESPACE_NAME')
    if codespace:
        host = f"{codespace}-8000.app.github.dev"
        scheme = 'https'
        base = f"{scheme}://{host}/api"
    else:
        base = request.build_absolute_uri('/api').rstrip('/')

    return Response({
        'teams': f"{base}/teams/",
        'users': f"{base}/users/",
        'activities': f"{base}/activities/",
        'workouts': f"{base}/workouts/",
        'leaderboard': f"{base}/leaderboard/",
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    # custom API root uses $CODESPACE_NAME when present
    path('api/', api_root),
    path('api/', include(router.urls)),
]
