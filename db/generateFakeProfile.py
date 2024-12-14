from faker import Faker
import random
import base64

pathPortraitH = "../../Downloads/lqPortraitHomme/"
pathPortraitF = "../../Downloads/lqPortraitFemme/"
pathActivitee = "../../Downloads/lqActivitee/"

fake = Faker('fr_FR')

defGeneder = {1 : {"first_name":fake.first_name_male},
   2: {"first_name":fake.first_name_female},
   4: {"first_name":fake.first_name_nonbinary}
}

allTags = ["chat", "chien", "hamster", "lapin", "poisson rouge", "perruche", "tortue", "furet", "cochon d’Inde", "canari", "chinchilla", "gecko", "hérisson pygmée", "perroquet", "rat", "axolotl", "bernard-l’ermite", "serpent", "souris", "écureuil de Corée",
        "course à pied", "natation", "cyclisme", "football", "basketball", "tennis", "volley-ball", "handball", "rugby", "badminton", "ping-pong", "escalade", "danse", "yoga", "musculation", "boxe", "arts martiaux", "randonnée", "ski", "snowboard", "golf", "équitation", "aviron", "plongée sous-marine", "surf", "athlétisme", "patinage artistique", "skateboard", "tir à l’arc", "karaté",
        "peinture", "dessin", "sculpture", "photographie", "poterie", "gravure", "calligraphie", "écriture", "théâtre", "cinéma", "danse", "musique", "chant", "architecture", "broderie", "mosaïque", "couture", "design graphique", "marqueterie", "création de bijoux",
        "médecin", "infirmier", "pharmacien", "chirurgien", "vétérinaire", "dentiste", "psychologue", "avocat", "juge", "procureur", "ingénieur", "architecte", "informaticien", "développeur", "data analyst", "enseignant", "professeur", "chercheur", "écrivain", "journaliste", "bibliothécaire", "traducteur", "interprète", "pilote", "mécanicien", "pompier", "policier", "militaire", "agent immobilier", "chef cuisinier", "pâtissier", "boulanger", "agriculteur", "électricien", "plombier", "menuisier", "charpentier", "maçon", "peintre en bâtiment", "graphiste",
        "lecture", "jardinage", "cuisine", "pâtisserie", "bricolage", "astronomie", "méditation", "jeux", "pêche", "camping", "tricot", "crochet", "puzzle", "collection", "promenades", "tourisme", "apprentissage", "écriture", "shopping", "nettoyage", "organisation", "plantes", "musées", "bénévolat", "échecs", "discussions", "séries", "films", "rangement", "podcast",
        "gentillesse", "patience", "empathie", "honnêteté", "courage", "créativité", "générosité", "respect", "loyauté", "optimisme", "tolérance", "humilité", "bienveillance", "curiosité", "détermination", "adaptabilité", "ponctualité", "organisation", "persévérance", "autonomie", "confiance", "sensibilité", "ouverture", "prudence", "responsabilité", "discrétion", "altruisme", "rigueur", "gratitude", "authenticité",
        "minimaliste", "aventurier", "écoresponsable","familial","citadin","nomade","actif","spirituel","festif",
        "rock", "pop", "jazz", "classique", "hip-hop", "reggae", "blues", "électro", "métal", "country", "R&B", "soul", "funk", "musique latine", "techno", "house", "punk", "folk", "world music"]

def getAnImage64encode(dirPath, idImage):
    res = None
    with open(dirPath+f"{idImage}"+".jpg", "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read())
        res = encoded_string.__str__()[2:-1]
    return res

countPhotoH = 1
countPhotoF = 1



with open("db/profiles.sql","a") as file_profile:
    with open("db/login.sql","a") as file_login:
        for i in range(1,500):
            genre = random.choices([1 << 0, 1 << 1, 1 << 2], weights=[45,45,10])[0]
            first_name = defGeneder[genre]["first_name"]()
            last_name = fake.last_name()
            birth = fake.date_of_birth(minimum_age = 18, maximum_age = 80).strftime("%Y-%m-%d")
            preference = random.randint(1, 7)
            biography = fake.text().replace("\n","").replace("\'","")
            tags = random.sample(allTags, k= random.randint(5, 20))
            tags = ','.join(tags)
            latitude = random.randint(41391475,51076825)/1000000
            longitude = random.randint(-5152852,9500957)/1000000
            rating = random.randint(1, 100)
            photo1 = getAnImage64encode(pathPortraitH, countPhotoH)
            if genre == 2 or (genre == 4 and random.randint(1,2) == 1):
                photo1 = getAnImage64encode(pathPortraitF, countPhotoF)
                countPhotoF += 1
            else :
                countPhotoH += 1
            photo2 = getAnImage64encode(pathActivitee, random.randint(1,453))
            photo3 = getAnImage64encode(pathActivitee, random.randint(1,453))
            
            string_login = f"(\'{first_name}_{last_name}@matcha.com\',\'pwd\',TRUE,{i}),"
            print(string_login, file=file_login)

            string_profile = f"(\'{first_name}\',\'{last_name}\',\'{birth}\',{genre},{preference},\'{biography}\',\'{tags}\',{latitude},{longitude},{rating},\'{photo1}\',\'{photo2}\',\'{photo3}\'),"
            print(string_profile, file=file_profile)
            # print(fake.name())

