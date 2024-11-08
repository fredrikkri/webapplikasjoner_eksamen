# 1.1 Planlegging

## 1. Skal dokumentere hvilke api-endepunkter (ressurser) som skal brukes

/api/v1/Courses
/api/v1/Courses/:courseSlug/
/api/v1/Courses/:courseSlug/:lessonSlug
/api/v1/Courses/:courseSlug/category

/api/v1/category/
/api/v1/category/:id

/api/v1/comments
/api/v1/comments/:lessonSlug

## 2. Skal til hvert api-endepunkt dokumentere hvilke verb som er tilgjengelig. Hva slags forespørsler skal de håndtere. 

**GET:**

/api/v1/Courses
- GET, henter alle Course.

/api/v1/Courses/:courseSlug/
- GET, henter et spesifisert kurs.

/api/v1/Courses/:courseSlug/:lessonSlug
- GET, henter en spesifisert leksjon fra et spesifisert kurs.

/api/v1/Courses/:courseSlug/category
- GET, kategorien til et spesifisert kurs.

/api/v1/category/
- GET, henter alle kategorier.

/api/v1/category/:id
- GET, henter en spesifisert kategori.

**POST:**

/api/v1/add
- POST, opprette et Course

/api/v1/Course/:courseSlug
- POST, opprette leksjon til et eksisterende kurs

/api/v1/Course/:courseSlug/:lessonSlug/
- POST, opprette kommentar til en leksjon

**DELETE:**

/api/v1/Course/:courseSlug
- DELETE, slette Course

/api/v1/Course/:courseSlug/:lessonSlug
- DELETE, slette leksjon

/api/v1/Course/:courseSlug/:lessonSlug/kommentar
- DELETE, slette kommentar


**PATCH:**

/Course/:id
- PATCH, oppdatere kategori for Course


## 3. Skal til hvert api-endepunkt dokumentere responsen og statuskoden for de ulike verbene. Hva slags data skal returneres når det går riktig / feil.

| **Endepunkt**                               | **Verb**   | **Statuskode**       | **Respons**                                         |
|-----------------------------------------|--------|------------------|-------------------------------------------------|
| /Course                                   | GET    | 200 OK           | Liste over alle Course                            |
| /Course/:id                               | GET    | 200 OK, 404      | Data for ett Course, eller feilmelding            |
| /Course/:id/leksjon                       | GET    | 200 OK, 404      | Liste over leksjoner i Courseet eller feilmelding |
| /Course/:id/leksjon/:id                   | GET    | 200 OK, 404      | Data for en leksjon eller feilmelding           |
| /Course/:id/leksjon/:id/kommentar         | GET    | 200 OK, 404      | Liste over kommentarer for leksjonen            |
| /Course/:id/leksjon/:id/kommentar/:id     | GET    | 200 OK, 404      | En spesifikk kommentar                          |
| /kategori/                              | GET    | 200 OK           | Liste over alle kategorier                      |
| /kategori/:id                           | GET    | 200 OK, 404      | En spesifikk kategori                           |
| /kategori/:id/Course                      | GET    | 200 OK, 404      | Alle Course i en kategori                         |
| /ny                                     | POST   | 201 Created      | Bekreftelse på opprettelse eller feil           |
| /Course/:id/ny                            | POST   | 201 Created      | Bekreftelse på opprettelse eller feil           |
| /Course/:id/leksjon/:id/ny                | POST   | 201 Created      | Bekreftelse på opprettelse eller feil           |
| /Course/:id                               | DELETE | 200 OK, 404      | Bekreftelse på sletting eller feilmelding       |
| /Course/:id/leksjon/:id                   | DELETE | 200 OK, 404      | Bekreftelse på sletting eller feilmelding       |
| /Course/:id/leksjon/:id/kommentar/:id     | DELETE | 200 OK, 404      | Bekreftelse på sletting eller feilmelding       |
| /Course/:id                               | PATCH  | 200 OK, 404      | Bekreftelse på oppdatering eller feilmelding    |


## 4. Skal dokumentere hvilke sider (urler) som skal benytte de ulike APIene og grovt hva som kan gjøres på den enkelte siden. Hvilke sider i "app" skal opprettes og grovt hva som kan gjøres på de ulike sidene.

Hjemmeside (/hjem)
- GET, /Course --> Viser en liste over alle Course.

Side med oversikt over alle Course (/Course)
- GET, /Course/:id --> Klikke seg inn på et Course.

Side med et spesifikt Course (/Course/:id)
- GET, /Course/:id/leksjon --> Viser informasjonen for alle tilhørende leksjoner til et Course.
- POST, /Course --> Bruker kan opprette Course.
- DELETE, /Course/:id --> Bruker kan slette Course.

Opprette et Course (/ny)
- POST, /ny --> Bruker kan opprette et Course

Leksjonsdetaljer (/Course/:id/leksjon/:id)
- GET, /Course/:id/leksjon/:id og GET, /Course/:id/leksjon/:id/kommentar --> Viser en leksjon med alle dens kommentarer.
- Bruker kan legge til kommentarer (bruker POST /Course/:id/leksjon/:id/kommentar).
- Mulighet til å slette leksjoner eller kommentarer (bruker DELETE /Course/:id/leksjon/:id og DELETE /Course/:id/leksjon/:id/kommentar/:id).

Kategoriliste (/kategori)
- Viser en liste over alle kategorier. Bruker GET /kategori/.
- Mulighet til å navigere til Course i en valgt kategori.

Kurs i kategori (/kategori/:id/Course)
- Viser alle Course innen en bestemt kategori. Bruker GET /kategori/:id/Course.
- Mulighet til å klikke seg videre inn på Coursedetaljer for Course i kategorien.

Opprett nytt Course
- Form for å opprette et nytt Course. Bruker POST /Course.