from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.db.models import Avg


class Game(models.Model):
    title = models.CharField("título", max_length=150)
    genre = models.CharField("gênero", max_length=60)
    developer = models.CharField("desenvolvedora", max_length=120)
    release_year = models.PositiveSmallIntegerField("ano de lançamento")
    synopsis = models.TextField("sinopse")
    cover_url = models.URLField("capa (URL da imagem)", max_length=500, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["title"]

    def __str__(self):
        return self.title

    @property
    def average_rating(self) -> float:
        value = self.reviews.aggregate(avg=Avg("rating"))["avg"]
        return round(value, 1) if value else 0.0

    @property
    def reviews_count(self) -> int:
        return self.reviews.count()


class Review(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name="reviews")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="reviews")
    rating = models.PositiveSmallIntegerField(
        "nota", validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comment = models.TextField("comentário", blank=True)
    created_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(fields=["game", "user"], name="one_review_per_user_per_game")
        ]

    def __str__(self):
        return f"{self.user} → {self.game} ({self.rating}★)"
