# 1.1 Planlegging

## 1. Skal dokumentere hvilke api-endepunkter (ressurser) som skal brukes

/kurs
/kurs/:id
/kurs/:id/leksjon
/kurs/:id/leksjon/:id
/kurs/:id/leksjon/:id/kommentar
/kurs/:id/leksjon/:id/kommentar/:id
/kategori/
/kategori/:id
/kategori/:id/kurs

## 2. Skal til hvert api-endepunkt dokumentere hvilke verb som er tilgjengelig. Hva slags forespørsler skal de håndtere. 

**GET:**

/kurs
- GET, henter alle kurs.

/kurs/:id
- GET, henter et spesifisert kurs.

/kurs/:id/leksjon
- GET, henter alle leksjoner fra et spesifisert kurs.

/kurs/:id/leksjon/:id
- GET, henter en spesifisert leksjon fra et spesifisert kurs.

/kurs/:id/leksjon/:id/kommentar
- GET, henter alle kommentarer fra en spesifisert leksjon fra et spesifisert kurs.

/kurs/:id/leksjon/:id/kommentar/:id
- GET, henter en spesifisert kommentar fra en spesifisert leksjon fra et spesifisert kurs.

/kategori/
- GET, henter alle kategorier.

/kategori/:id
- GET, henter en spesifisert kategori.

/kategori/:id/kurs
- GET, henter alle kurs fra en spesifisert kategori.

**POST:**

/ny
- POST, opprette et kurs

/kurs/:id/ny
- POST, opprette leksjon

/kurs/:id/leksjon/:id/ny
- POST, opprette kommentar

**DELETE:**

/kurs/:id
- DELETE, slette kurs

/kurs/:id/leksjon/:id
- DELETE, slette leksjon

/kurs/:id/leksjon/:id/kommentar/:id
- DELETE, slette kommentar


**PATCH:**

/kurs/:id
- PATCH, oppdatere kategori for kurs


## 3. Skal til hvert api-endepunkt dokumentere responsen og statuskoden for de ulike verbene. Hva slags data skal returneres når det går riktig / feil.

| **Endepunkt**                               | **Verb**   | **Statuskode**       | **Respons**                                         |
|-----------------------------------------|--------|------------------|-------------------------------------------------|
| /kurs                                   | GET    | 200 OK           | Liste over alle kurs                            |
| /kurs/:id                               | GET    | 200 OK, 404      | Data for ett kurs, eller feilmelding            |
| /kurs/:id/leksjon                       | GET    | 200 OK, 404      | Liste over leksjoner i kurset eller feilmelding |
| /kurs/:id/leksjon/:id                   | GET    | 200 OK, 404      | Data for en leksjon eller feilmelding           |
| /kurs/:id/leksjon/:id/kommentar         | GET    | 200 OK, 404      | Liste over kommentarer for leksjonen            |
| /kurs/:id/leksjon/:id/kommentar/:id     | GET    | 200 OK, 404      | En spesifikk kommentar                          |
| /kategori/                              | GET    | 200 OK           | Liste over alle kategorier                      |
| /kategori/:id                           | GET    | 200 OK, 404      | En spesifikk kategori                           |
| /kategori/:id/kurs                      | GET    | 200 OK, 404      | Alle kurs i en kategori                         |
| /ny                                     | POST   | 201 Created      | Bekreftelse på opprettelse eller feil           |
| /kurs/:id/ny                            | POST   | 201 Created      | Bekreftelse på opprettelse eller feil           |
| /kurs/:id/leksjon/:id/ny                | POST   | 201 Created      | Bekreftelse på opprettelse eller feil           |
| /kurs/:id                               | DELETE | 200 OK, 404      | Bekreftelse på sletting eller feilmelding       |
| /kurs/:id/leksjon/:id                   | DELETE | 200 OK, 404      | Bekreftelse på sletting eller feilmelding       |
| /kurs/:id/leksjon/:id/kommentar/:id     | DELETE | 200 OK, 404      | Bekreftelse på sletting eller feilmelding       |
| /kurs/:id                               | PATCH  | 200 OK, 404      | Bekreftelse på oppdatering eller feilmelding    |


## 4. Skal dokumentere hvilke sider (urler) som skal benytte de ulike APIene og grovt hva som kan gjøres på den enkelte siden. Hvilke sider i "app" skal opprettes og grovt hva som kan gjøres på de ulike sidene.

Hjemmeside (/hjem)
- GET, /kurs --> Viser en liste over alle kurs.

Side med oversikt over alle kurs (/kurs)
- GET, /kurs/:id --> Klikke seg inn på et kurs.

Side med et spesifikt kurs (/kurs/:id)
- GET, /kurs/:id/leksjon --> Viser informasjonen for alle tilhørende leksjoner til et kurs.
- POST, /kurs --> Bruker kan opprette kurs.
- DELETE, /kurs/:id --> Bruker kan slette kurs.

Opprette et kurs (/ny)
- POST, /ny --> Bruker kan opprette et kurs

Leksjonsdetaljer (/kurs/:id/leksjon/:id)
- GET, /kurs/:id/leksjon/:id og GET, /kurs/:id/leksjon/:id/kommentar --> Viser en leksjon med alle dens kommentarer.
- Bruker kan legge til kommentarer (bruker POST /kurs/:id/leksjon/:id/kommentar).
- Mulighet til å slette leksjoner eller kommentarer (bruker DELETE /kurs/:id/leksjon/:id og DELETE /kurs/:id/leksjon/:id/kommentar/:id).

Kategoriliste (/kategori)
- Viser en liste over alle kategorier. Bruker GET /kategori/.
- Mulighet til å navigere til kurs i en valgt kategori.

Kurs i kategori (/kategori/:id/kurs)
- Viser alle kurs innen en bestemt kategori. Bruker GET /kategori/:id/kurs.
- Mulighet til å klikke seg videre inn på kursdetaljer for kurs i kategorien.

Opprett nytt kurs
- Form for å opprette et nytt kurs. Bruker POST /kurs.