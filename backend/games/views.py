from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.decorators import action, api_view, authentication_classes, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response

from .models import Game, Review
from .permissions import IsAdminOrReadOnly
from .serializers import (
    GameSerializer, LoginSerializer, RegisterSerializer, ReviewSerializer, UserSerializer,
)


class GameViewSet(viewsets.ModelViewSet):
    """Catálogo: leitura pública; criar/editar/excluir apenas administrador."""

    serializer_class = GameSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        qs = Game.objects.all()
        search = self.request.query_params.get("search")
        genre = self.request.query_params.get("genre")
        if search:
            qs = qs.filter(title__icontains=search)
        if genre:
            qs = qs.filter(genre=genre)
        return qs

    @action(detail=True, methods=["get", "post"], permission_classes=[IsAuthenticatedOrReadOnly])
    def reviews(self, request, pk=None):
        game = self.get_object()
        if request.method == "GET":
            return Response(ReviewSerializer(game.reviews.select_related("user"), many=True).data)

        serializer = ReviewSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        review, created = Review.objects.update_or_create(
            game=game,
            user=request.user,
            defaults={
                "rating": serializer.validated_data["rating"],
                "comment": serializer.validated_data.get("comment", ""),
            },
        )
        return Response(
            ReviewSerializer(review).data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )


@api_view(["GET"])
def genres(request):
    values = Game.objects.order_by("genre").values_list("genre", flat=True).distinct()
    return Response(list(values))


def auth_payload(user):
    token, _ = Token.objects.get_or_create(user=user)
    return {"token": token.key, "user": UserSerializer(user).data}


@api_view(["POST"])
@authentication_classes([])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = serializer.validated_data
    user = User.objects.create_user(
        username=data["email"], email=data["email"],
        password=data["password"], first_name=data["name"].strip(),
    )
    return Response(auth_payload(user), status=status.HTTP_201_CREATED)


@api_view(["POST"])
@authentication_classes([])
@permission_classes([AllowAny])
def login(request):
    serializer = LoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = authenticate(
        username=serializer.validated_data["email"].lower(),
        password=serializer.validated_data["password"],
    )
    if user is None:
        return Response({"detail": "E-mail ou senha incorretos."}, status=status.HTTP_400_BAD_REQUEST)
    return Response(auth_payload(user))


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout(request):
    Token.objects.filter(user=request.user).delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    return Response(UserSerializer(request.user).data)
