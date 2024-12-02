# Documentation oppg2

## 1. Skal lage enkle low-fi skisse basert på kravene over.

## 2. Skal dokumentere hvilke api-endepunkter (ressurser) som skal brukes.

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

## 5. Skal dokumentere hvilke sider (urler) som skal benytte de ulike APIene og grovt hva som kan gjøres på den enkelte siden. Hvilke sider i "app" skal opprettes og grovt hva som kan gjøres på de ulike sidene.


## 6. Skal dokumentere hvordan filtreringen skal foregå og løses i frontend og backend.

## 7. Skal dokumentere datamodellen og bakgrunnen for denne modellen.

## 8. Skal dokumentere hvordan løse det å opprette / gjenbruke en mal.

## 9. Skal dokumentere databasemodellen og nødvendige relasjoner.
