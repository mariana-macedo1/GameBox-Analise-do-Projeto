from django.contrib.auth.models import User
from rest_framework.test import APITestCase

from .models import Game


class ApiTests(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_user("a@a.com", "a@a.com", "123456", first_name="Admin", is_staff=True)
        self.u1 = User.objects.create_user("u1@a.com", "u1@a.com", "123456", first_name="U1")
        self.u2 = User.objects.create_user("u2@a.com", "u2@a.com", "123456", first_name="U2")
        self.game = Game.objects.create(
            title="Jogo", genre="RPG", developer="Dev", release_year=2020, synopsis="Sinopse"
        )
        self.reviews_url = f"/api/games/{self.game.id}/reviews/"

    def test_visitor_can_list_and_filter(self):
        res = self.client.get("/api/games/?search=jo&genre=RPG")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(len(res.data), 1)

    def test_visitor_cannot_review(self):
        self.assertEqual(self.client.post(self.reviews_url, {"rating": 5}).status_code, 401)

    def test_rating_is_required_and_limited(self):
        self.client.force_authenticate(self.u1)
        self.assertEqual(self.client.post(self.reviews_url, {"comment": "x"}).status_code, 400)
        self.assertEqual(self.client.post(self.reviews_url, {"rating": 6}).status_code, 400)

    def test_average_updates(self):
        self.client.force_authenticate(self.u1)
        self.client.post(self.reviews_url, {"rating": 4, "comment": "bom"})
        self.client.force_authenticate(self.u2)
        self.client.post(self.reviews_url, {"rating": 2})
        game = self.client.get(f"/api/games/{self.game.id}/").data
        self.assertEqual(game["average_rating"], 3.0)
        self.assertEqual(game["reviews_count"], 2)

    def test_same_user_updates_own_review(self):
        self.client.force_authenticate(self.u1)
        self.client.post(self.reviews_url, {"rating": 4})
        self.client.post(self.reviews_url, {"rating": 1})
        self.assertEqual(self.game.reviews.count(), 1)
        self.assertEqual(self.game.average_rating, 1.0)

    def test_only_admin_manages_games(self):
        payload = {"title": "N", "genre": "RPG", "developer": "D", "release_year": 2021, "synopsis": "S"}
        self.assertEqual(self.client.post("/api/games/", payload).status_code, 401)
        self.client.force_authenticate(self.u1)
        self.assertEqual(self.client.post("/api/games/", payload).status_code, 403)
        self.client.force_authenticate(self.admin)
        self.assertEqual(self.client.post("/api/games/", payload).status_code, 201)
        self.assertEqual(self.client.delete(f"/api/games/{self.game.id}/").status_code, 204)

    def test_register_and_login(self):
        res = self.client.post("/api/auth/register/", {"name": "Ana", "email": "ana@a.com", "password": "123456"})
        self.assertEqual(res.status_code, 201)
        self.assertEqual(self.client.post("/api/auth/register/", {"name": "Ana", "email": "ana@a.com", "password": "123456"}).status_code, 400)
        self.assertEqual(self.client.post("/api/auth/login/", {"email": "ana@a.com", "password": "123456"}).status_code, 200)
        self.assertEqual(self.client.post("/api/auth/login/", {"email": "ana@a.com", "password": "errada"}).status_code, 400)
