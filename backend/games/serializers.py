from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Game, Review


class GameSerializer(serializers.ModelSerializer):
    average_rating = serializers.FloatField(read_only=True)
    reviews_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Game
        fields = [
            "id", "title", "genre", "developer", "release_year",
            "synopsis", "cover_url", "average_rating", "reviews_count",
        ]

    def validate_release_year(self, value):
        if not 1950 <= value <= 2100:
            raise serializers.ValidationError("Informe um ano entre 1950 e 2100.")
        return value


class ReviewSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(read_only=True)
    user_name = serializers.CharField(source="user.first_name", read_only=True)

    class Meta:
        model = Review
        fields = ["id", "user_id", "user_name", "rating", "comment", "created_at"]
        read_only_fields = ["id", "created_at"]
        extra_kwargs = {"rating": {"error_messages": {"required": "Selecione uma nota de 1 a 5 estrelas."}}}


class UserSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="first_name")
    is_admin = serializers.BooleanField(source="is_staff")

    class Meta:
        model = User
        fields = ["id", "name", "email", "is_admin"]


class RegisterSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    password = serializers.CharField(min_length=6, write_only=True)

    def validate_email(self, value):
        value = value.lower()
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Este e-mail já está cadastrado.")
        return value


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
