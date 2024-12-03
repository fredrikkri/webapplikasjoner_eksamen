# Documentation oppgave 2

## Skal dokumentere hvilke api-endepunkter (ressurser) som skal brukes.

### Events

**GET api/v1/events | returnerer (200 ok) / (404 Not Found)**

Hvis 200 ok:
{
    "success": true,
    "data": [
        {
            "id": "event-1",
            "title": "Tech Conference 2024",
            "description": "A major technology conference covering the latest in AI, blockchain, and web development.",
            "slug": "tech-conference-2024",
            "date": "2024-11-20",
            "location": "Oslo, Norway",
            "event_type": "Seminar",
            "total_slots": 300,
            "available_slots": 200,
            "price": 1500
        }
    ]
}
ellers:
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Events not found"
  }
}

**GET api/v1/events/:slug | returnerer (200 ok) / (404 Not Found)**

Hvis 200 ok:
{
    "success": true,
    "data": {
        "id": 1,
        "title": "Title",
        "slug": "event_slug",
        "location": "Location",
        "date": "2024-01-01",
        "description": "Description"
    }
}
ellers:
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Event not found"
  }
}

**POST api/v1/create-event | returnerer (201 Created) / (400 Bad Request)**

hvis 201 Created:
{
    "success": true,
    "data": {
        "id": "46079c2e-6323-4dc4-a97d-4051561c0d92",
        "title": "akakaka",
        "description": "akakaka",
        "slug": "akakaka-48f851",
        "date": "2024-12-13",
        "location": "3333",
        "event_type": "Konsert",
        "total_slots": 10,
        "available_slots": 10,
        "price": 101
    }
}
ellers:
{
    "success": false,
    "data": [
        {
        "message": "Bad Request"
        }
    ]
}
ellers:
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "Bad Request"
  }
}

### Active Events

**GET api/v1/active-events | returnerer (200 ok) / (400 Bad Request)**

Hvis 200 ok:
{
    "success": true,
    "data": [
        {
            "id": "event-1",
            "title": "Tech Conference 2024",
            "description": "A major technology conference covering the latest in AI, blockchain, and web development.",
            "slug": "tech-conference-2024",
            "date": "2024-11-20",
            "location": "Oslo, Norway",
            "event_type": "Seminar",
            "total_slots": 300,
            "available_slots": 200,
            "price": 1500
        }
    ]
}
ellers:
{
    "success": false,
    "data": [
        {
        "message": "Bad Request"
        }
    ]
}

**GET api/v1/active-events/:eventSlug | returnerer (200 ok) / (404 Not Found)**

Hvis 200 ok:
{
    "success": true,
    "data": {
        "id": 1,
        "title": "Title",
        "slug": "event_slug",
        "location": "Location",
        "date": "2024-01-01",
        "description": "Description"
    }
}
ellers:
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Event not found"
  }
}

**POST api/v1/active-events/add | returnerer (201 Created) / (400 Bad Request)**

hvis 201 Created:
{
    "success": true,
    "data": {
        "id": "46079c2e-6323-4dc4-a97d-4051561c0d92",
        "title": "akakaka",
        "description": "akakaka",
        "slug": "akakaka-48f851",
        "date": "2024-12-13",
        "location": "3333",
        "event_type": "Konsert",
        "total_slots": 10,
        "available_slots": 10,
        "price": 101
    }
}
ellers:
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "Bad Request"
  }
}

### Templates

**GET api/v1/templates | returnerer (200 ok) / (400 Bad Request)**

hvis 200 ok:
{
    "success": true,
    "data": [
        {
            "id": "event-1",
            "title": "Tech Conference 2024",
            "description": "A major technology conference covering the latest in AI, blockchain, and web development.",
            "slug": "tech-conference-2024",
            "date": "2024-11-20",
            "location": "Oslo, Norway",
            "event_type": "Seminar",
            "total_slots": 300,
            "available_slots": 200,
            "price": 1500
        }
    ]
} 
ellers:
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "Bad Request"
  }
}

**GET api/v1/templates/:event_slug | returnerer (200 ok) / (400 Bad Request)**

hvis 200 ok:
{
    "success": true,
    "data": {
        "id": "event-1",
        "title": "Tech Conference 2024",
        "description": "A major technology conference covering the latest in AI, blockchain, and web development.",
        "slug": "tech-conference-2024",
        "date": "2024-11-20",
        "location": "Oslo, Norway",
        "event_type": "Seminar",
        "total_slots": 300,
        "available_slots": 200,
        "price": 1500
    }
}
ellers:
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "Bad Request"
  }
}


**POST api/v1/templates/create | returnerer (201 Created) / (400 Bad Request)**

hvis 201 Created:
{
    "success": true,
    "data": {
        "id": "46079c2e-6323-4dc4-a97d-4051561c0d92",
        "title": "akakaka",
        "description": "akakaka",
        "slug": "akakaka-48f851",
        "date": "2024-12-13",
        "location": "3333",
        "event_type": "Konsert",
        "total_slots": 10,
        "available_slots": 10,
        "price": 101
    }
}
ellers:
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "Bad Request"
  }
}
### Registrations

**GET api/v1/registrations | returnerer (200 ok) / (400 Bad Request)**

hvis 200 ok:
{
    "success": true,
    "data": [
        {
            "id": "1ad9db18-3f6c-410d-a619-ea0c06cc84ea",
            "event_id": "event-1",
            "email": "ewewr@gmail.com",
            "has_paid": "false",
            "registration_date": "2024-12-02T11:52:02.354Z",
            "order_id": "5dfb9283-ff26-47fe-8f44-f4418588db95"
        }
    ]
}
ellers:
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "Bad Request"
  }
}

**GET api/v1/registrations/:event_id | returnerer (200 ok) / (400 Bad Request)**

hvis 200 ok:
{
    "success": true,
    "data": [
        {
            "id": "1ad9db18-3f6c-410d-a619-ea0c06cc84ea",
            "event_id": "event-1",
            "email": "ewewr@gmail.com",
            "has_paid": "false",
            "registration_date": "2024-12-02T11:52:02.354Z",
            "order_id": "5dfb9283-ff26-47fe-8f44-f4418588db95"
        }
    ]
}
ellers:
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "Bad Request"
  }
}

**POST api/v1/registrer | returnerer (201 Created) / (400 Bad Request)**

hvis 201 Created:
{
    "success": true,
    "data": [
        {
            "id": "1-abc",
            "event_id": "event-1",
            "email": "john.doe@example.com",
            "has_paid": "true",
            "registration_date": "2024-11-01",
            "order_id": null
        }
    ]
}
ellers:
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "Bad Request"
  }
}

**DELETE api/v1/delete-registration/:id | returnerer (200 ok) / (404 Not Found)**

hvis 200 ok:
{
    "success": true,
    "data": [
        {
            "id": "1ad9db18-3f6c-410d-a619-ea0c06cc84ea",
            "event_id": "event-1",
            "email": "ewewr@gmail.com",
            "has_paid": "false",
            "registration_date": "2024-12-02T11:52:02.354Z",
            "order_id": "5dfb9283-ff26-47fe-8f44-f4418588db95"
        }
    ]
}
ellers:
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "Bad Request"
  }
}

### Waitlist

**GET api/v1/waitlist-registrations | returnerer (200 ok) / (400 Bad Request)**

hvis 200 ok:
{
    "success": true,
    "data": [
        {
            "id": "1ad9db18-3f6c-410d-a619-ea0c06cc84ea",
            "event_id": "event-1",
            "email": "ewewr@gmail.com",
            "has_paid": "false",
            "registration_date": "2024-12-02T11:52:02.354Z",
            "order_id": "5dfb9283-ff26-47fe-8f44-f4418588db95"
        }
    ]
}
ellers:
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "Bad Request"
  }
}

**GET api/v1/waitlist-registrations/:event_id | returnerer (200 ok) / (400 Bad Request)**

hvis 200 ok:
{
    "success": true,
    "data": [
        {
            "id": "1ad9db18-3f6c-410d-a619-ea0c06cc84ea",
            "event_id": "event-1",
            "email": "ewewr@gmail.com",
            "has_paid": "false",
            "registration_date": "2024-12-02T11:52:02.354Z",
            "order_id": "5dfb9283-ff26-47fe-8f44-f4418588db95"
        }
    ]
}
ellers:
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "Bad Request"
  }
}

**GET api/v1/waitlist-registrations/:registration_id | returnerer (200 ok) / (400 Bad Request)**

hvis 200 ok:
{
    "success": true,
    "data": [
        {
            "id": "9a68ab49-6b7f-4c14-882b-3079202ba8aa",
            "event_id": "event-1",
            "email": "gg@gmail.com",
            "has_paid": "false",
            "registration_date": "2024-12-02T12:13:59.575Z",
            "order_id": "ca729cb0-f6ce-4fb3-976f-0d8412e63a74"
        }
    ]
}
ellers:
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Event not found"
  }
}


**GET api/v1/:event_slug/waitlist-orders | returnerer (200 ok) / (400 Bad Request)**

hvis 200 ok:
{
    "success": true,
    "data": [
        {
            "order_id": "ca729cb0-f6ce-4fb3-976f-0d8412e63a74",
            "number_of_people": 1,
            "responsible_person": "gg@gmail.com",
            "total_price": 1500,
            "registration_date": "2024-12-02T12:13:59.575Z"
        }
    ]
}
ellers:
{
  "error": {
    "code": "EVENT_NOT_FOUND",
    "message": "Event not found for the provided slug"
  }
}

**GET api/v1/:event_slug/waitlist-orders/:order_id | returnerer (200 ok) / (400 Bad Request)**

hvis 200 ok:
{
    "success": true,
    "data": 
        {
            "order_id": "ca729cb0-f6ce-4fb3-976f-0d8412e63a74",
            "number_of_people": 1,
            "responsible_person": "gg@gmail.com",
            "total_price": 1500,
            "registration_date": "2024-12-02T12:13:59.575Z"
        }
}
ellers:
{
  "error": {
    "code": "ORDER_NOT_FOUND",
    "message": "Order not found for the event"
  }
}

**POST api/v1/waitlist-registrer | returnerer (201 Created) / (400 Bad Request)**

hvis 200 ok:
{
    "success":true,
    "data":"fd1912f9-a934-44ca-93f8-8cc60ca7d743"
    }
ellers:
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "Bad Request"
  }
}

### Excel

**GET api/v1/download-excel-statistics | returnerer (200 ok) / (400 Bad Request)**

hvis 200 ok:
{
    "success": true,
    "data": {}
}
ellers:
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Excel Document not found"
  }
}

### Rules

**GET api/v1/rules/:eventId | returnerer (200 ok) / (400 Bad Request)**

hvis 200 ok:
{
    "success": true,
    "data": {
        "event_id": "46079c2e-6323-4dc4-a97d-4051561c0d92",
        "is_private": "false",
        "restricted_days": null,
        "allow_multiple_events_same_day": "true",
        "waitlist": "true",
        "fixed_price": "false",
        "fixed_size": "false",
        "is_free": "false"
    }
}
ellers:
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Rules not found"
  }
}

## Skal dokumentere hvilke sider (urler) som skal benytte de ulike APIene og grovt hva som kan gjøres på den enkelte siden. Hvilke sider i "app" skal opprettes og grovt hva som kan gjøres på de ulike sidene.

**/events**

Skjer momentant:
- api/v1/activeevents
    - Henter ut alle eventer som er aktive.

Hva man kan gjøre på siden:
- trykke på et av eventene
    - Man blir tatt med til denne url: events/:event_slug
- trykke på "Download Excel"
    - man laster ned statestikk i excel fil: api/v1/download-excel
- Filtrere på måned, år og event-kategori

**/events/:event_slug**

Skjer momentant:
- api/v1/active-events/:event_slug
    - henter ut et enkelt event

Hva man kan gjøre på siden:
- api/v1/waitlist-registrer
    - legger til en ny registrering
- events/:event_slug/admin
    - trykker på admininistrer knapp for å komme til admin-side for dette eventet

**/events/tech-conference-2024/admin**

Skjer momentant:
- api/v1/tech-conference-2024/waitlist-orders
    - Man får opp venteliste for påmeldinger til eventet

Hva man kan gjøre på siden:
- api/v1/registrerWishlist
    - Man flytter en ordre fra venteliste til å registrert-liste
- api/v1/waitlist-registrations/:registration_id
    - Man sletter en ordre i venteliste
- api/v1/waitlist-registrer
    - legger til en ny registrering manuelt som vil gå hoppe over venteliste

**/templates**

Skjer momentant:
- api/v1/templates
    - Henter ut alle templates som er public  
 
Hva man kan gjøre på siden:
- trykke på et av templatene
    - Man blir tatt med til denne url: templates/:event_slug

**templates/:event_slug**

Skjer momentant:
- api/v1/templates/:event_slug
    - henter ut en template

Hva man kan gjøre på siden:
- api/v1/templates/add
    - opretter en template basert på nåverende template
- /api/v1/create
    -  oppretter et nytt arangement basert på template

**/opprett**

Skjer momentant:
- api/v1/events/:event_slug
    - henter ut et event

Hva man kan gjøre på siden:
- api/v1/create
    - oppretter et nytt event
- api/v1/templates/add
    - oppretter en ny mal

## Skal dokumentere hvordan filtreringen skal foregå og løses i frontend og backend.

### Filtrering på eventer
Dette gjøres i frontend. Vi henter inn alle aktive eventer med et customHook i frontend. Vi sender med hvilken måned, år, eller kategori som er valgt inn i komponentet "ListEvents". Hvis det er valgt noe som ønskes å filtrere vekk, så filtrerer den vekk eventer som inneholder noe som ønskes å filtreres vekk.

### Filtrering i repository
Det gjøres filtrering i backend i repository-laget. Filtreringene som gjøres her er joins for når vi trenger data som matcher mellom to ulike tabeller. Da vil data som ikke matcher spørringen bli filtrert bort. 
Et eksempel er når vi ønsker å finne en bestemt template. Da henter vi alle rader fra tabellen "events" og "events_template" tabellen. På grunn av join-operasjonen, så står vi kun igjen med data der id i event-tabellen er lik event_id i events_template-tabellen. Dette var et eksempel på hvordan vi gjør filtrering i backend.

### Filtrering i excel dokument
Vi valgte å gjøre filtrering direkte i excel dokumentet. Man kan trykke på rute A1 i "Registrations-worksheet". Da vil du få muligheten til å velge hvilke påmeldinger for hvilket år som skal vises. Dette ble gjort i backend i excel.controller laget. Når Worksheet blir opprettet, så sørger vi for at dropdownmeny med filtrering er muliggjort på celle A1 der "year" er plassert.

## Skal dokumentere datamodellen og bakgrunnen for denne modellen.
Vi har et table som heter event, denne blir aldri direkte rendret. Vi bruker "mellomtablene" som heter events_active og events_template som da har en ref til events tablet. Dette gjør det lett å hente data og kategorisere ulike typer arrangementer.

## Skal dokumentere hvordan løse det å opprette / gjenbruke en mal.
Hver gang vi velger å gjenbruke en mal så genererer vi en ny id bak tittelen, som da er "slug", som da er en unik verdi. vi genererer også nye id'er til set arrangement.
Ved hjelp av events_template kan vi lett hente ut data fra events tablet. Hvis vi velger en mal så henter vi ut dataen fra events og genererer nye id'er til set informasjon ved opprettelse.

## Skal dokumentere databasemodellen og nødvendige relasjoner.

Databasemodellen består av følgende tabeller og relasjoner:

### events (Hovedtabell)
- Primærnøkkel: id (TEXT)
- Kolonner:
  - title (TEXT, NOT NULL)
  - description (TEXT, NOT NULL)
  - slug (TEXT, NOT NULL)
  - date (TEXT, NOT NULL)
  - location (TEXT, NOT NULL)
  - event_type (TEXT, NOT NULL)
  - total_slots (INTEGER, NOT NULL)
  - available_slots (INTEGER, NOT NULL)
  - price (INTEGER, NOT NULL)

### events_template
- Primærnøkkel: id (INTEGER AUTOINCREMENT)
- Fremmednøkkel: event_id -> events(id)
- Kolonner:
  - private (TEXT)

### events_active
- Primærnøkkel: id (INTEGER AUTOINCREMENT)
- Fremmednøkler:
  - event_id -> events(id)
  - template_id -> events_template(id)

### wait_list
- Primærnøkkel: id (TEXT)
- Fremmednøkkel: event_id -> events(id)
- Kolonner:
  - email (TEXT, NOT NULL)
  - has_paid (TEXT, NOT NULL)
  - registration_date (TEXT, NOT NULL)
  - order_id (TEXT)

### registrations
- Primærnøkkel: id (TEXT)
- Fremmednøkkel: event_id -> events(id)
- Kolonner:
  - email (TEXT, NOT NULL)
  - has_paid (TEXT, NOT NULL)
  - registration_date (TEXT, NOT NULL)
  - order_id (TEXT)

### days
- Primærnøkkel: id (INTEGER AUTOINCREMENT)
- Kolonner:
  - day (TEXT, NOT NULL)

### event_rules
- Primærnøkkel: event_id (TEXT)
- Fremmednøkkel: event_id -> events(id) ON DELETE CASCADE
- Kolonner:
  - is_private (TEXT)
  - restricted_days (TEXT)
  - allow_multiple_events_same_day (TEXT)
  - waitlist (TEXT)
  - fixed_price (TEXT)
  - fixed_size (TEXT)
  - is_free (TEXT)

Relasjoner og deres betydning:
1. events_template og events_active er mellomtabeller som refererer til hovedtabellen events, dette muliggjør kategorisering av events som enten maler eller aktive arrangementer
2. wait_list og registrations har lignende struktur og begge refererer til events, dette håndterer både venteliste og faktiske registreringer for arrangementer
3. event_rules er direkte knyttet til events med CASCADE DELETE, som betyr at reglene automatisk slettes når et arrangement slettes
4. Alle fremmednøkler er aktivert med "PRAGMA foreign_keys = ON" for å sikre referanseintegritet

Dette databasedesignet støtter:
- Fleksibel håndtering av arrangementer (både maler og aktive)
- Robust registreringssystem med ventelistefunksjonalitet
- Omfattende regelsett for hvert arrangement
- Effektiv dataintegritet gjennom fremmednøkler
