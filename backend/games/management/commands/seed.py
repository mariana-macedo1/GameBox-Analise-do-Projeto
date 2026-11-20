from django.contrib.auth.models import User
from django.core.management.base import BaseCommand

from games.models import Game, Review

GAMES = [
    ("Minecraft", "Sandbox", "Mojang Studios", 2011,
     "Em um mundo gerado proceduralmente feito de blocos, o jogador coleta recursos, constrói estruturas e sobrevive à noite contra criaturas hostis. Pode ser jogado de forma criativa, sem riscos, ou em modo sobrevivência."),
    ("The Last of Us", "Ação/Aventura", "Naughty Dog", 2013,
     "Vinte anos após uma pandemia fúngica devastar a civilização, Joel é contratado para escoltar a jovem Ellie através dos Estados Unidos. A jornada mistura furtividade, combate e uma narrativa emocional sobre perda e vínculo."),
    ("God of War", "Ação/Aventura", "Santa Monica Studio", 2018,
     "Kratos vive agora no reino nórdico e precisa ensinar o filho Atreus a sobreviver enquanto cumprem a promessa de espalhar as cinzas da esposa no pico mais alto dos nove reinos."),
    ("Resident Evil 4", "Survival Horror", "Capcom", 2005,
     "O agente Leon S. Kennedy é enviado a uma vila europeia isolada para resgatar a filha do presidente dos EUA e enfrenta aldeões controlados por um culto misterioso, em um clássico do terror de ação."),
    ("Red Dead Redemption 2", "Ação/Aventura", "Rockstar Games", 2018,
     "No fim da era do faroeste, Arthur Morgan e a gangue de Dutch van der Linde fogem da lei por um país em transformação. Um mundo aberto detalhado com foco em história e imersão."),
    ("Stardew Valley", "Simulação", "ConcernedApe", 2016,
     "Ao herdar a antiga fazenda do avô, o jogador deixa a vida na cidade para plantar, criar animais, pescar, explorar minas e construir laços com os moradores de Pelican Town."),
    ("Hollow Knight", "Metroidvania", "Team Cherry", 2017,
     "Em Hallownest, um reino subterrâneo de insetos em ruínas, um pequeno cavaleiro explora cavernas interligadas, enfrenta chefes desafiadores e descobre os segredos de uma praga misteriosa."),
    ("Cyberpunk 2077", "RPG", "CD Projekt Red", 2020,
     "Em Night City, metrópole obcecada por poder e modificações corporais, V busca um implante experimental que promete a imortalidade, em um RPG de mundo aberto com escolhas que afetam a história."),
]

REVIEWERS = [("Ana Souza", "ana@jogos.com"), ("Bruno Lima", "bruno@jogos.com"), ("Carla Dias", "carla@jogos.com")]
COMMENTS = ["Excelente, recomendo!", "Muito bom, mas poderia ser mais longo.", "Uma experiência marcante.", "Bom, porém com alguns problemas.", ""]


class Command(BaseCommand):
    help = "Cria dados iniciais (jogos, usuários e avaliações de exemplo)."

    def handle(self, *args, **options):
        if not User.objects.filter(username="admin@jogos.com").exists():
            User.objects.create_user("admin@jogos.com", "admin@jogos.com", "admin123",
                                     first_name="Administrador", is_staff=True, is_superuser=True)
        users = []
        for name, email in REVIEWERS + [("Usuário Demo", "usuario@jogos.com")]:
            user, _ = User.objects.get_or_create(username=email, defaults={"email": email, "first_name": name})
            user.set_password("user12345")
            user.save()
            users.append(user)

        for i, (title, genre, dev, year, synopsis) in enumerate(GAMES):
            game, _ = Game.objects.get_or_create(
                title=title,
                defaults={"genre": genre, "developer": dev, "release_year": year, "synopsis": synopsis},
            )
            for j, user in enumerate(users[:3]):  # usuário demo fica sem avaliações para testes
                Review.objects.get_or_create(
                    game=game, user=user,
                    defaults={"rating": 3 + (i + j) % 3, "comment": COMMENTS[(i + j) % len(COMMENTS)]},
                )
        self.stdout.write(self.style.SUCCESS("Dados iniciais criados."))
        self.stdout.write("Admin: admin@jogos.com / admin123")
        self.stdout.write("Usuário: usuario@jogos.com / user12345")
