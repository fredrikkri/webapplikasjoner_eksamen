import DownloadExcel from "@/components/DownloadeExcel";
import { Event } from "@/types/Event";

export const BASE_URL = "http://localhost:3999/api/v1";
export const BASE_WEB = "http://localhost:4000/events/";

export const ENDPOINTS = {
  add: `${BASE_URL}/add`,
  update: `${BASE_URL}/update`,
  events: `${BASE_URL}/activeevents`,
  templates: `${BASE_URL}/templates`,
  create: `${BASE_URL}/create`,
  deleteEvent: (eventId: string) => `${BASE_URL}/delete-event/${eventId}`,
  deleteTemplate: (eventId: string) => `${BASE_URL}/delete-template/${eventId}`,
  editTemplate: (eventData: Event) => `${BASE_URL}/edit-template/${eventData.id}`,
  editEvent: (eventData: Event) => `${BASE_URL}/edit-event/${eventData.id}`,
  createRegistration: `${BASE_URL}/registrer`,
  createRegistrationById: `${BASE_URL}/registrerWishlist`,
  createWaitlistRegistration: `${BASE_URL}/waitlist-registrer`,
  createActiveEvent: `${BASE_URL}/activeevents/add`,
  createTemplate: `${BASE_URL}/templates/add`,
  downloadExcel: `${BASE_URL}/download-excel`,
  getRegistrationEventData: `${BASE_URL}/registrations`,
  deleteRegistration: (id: string) => `${BASE_URL}/deleteregistration/${id}`,
  getWishlist: (eventId: string) => `${BASE_URL}/${eventId}/waitlist-orders`,
  deleteWaitlistItem: (registrationId: string) => `${BASE_URL}/waitlist-registrations/${registrationId}`,
  getAttendersWaitList: (eventId: string) => `${BASE_URL}/waitlist-registrations/${eventId}`,
  getRegisteredMembers: (eventId: string) => `${BASE_URL}/registrations/${eventId}`,
  rules: (eventId: string) => `${BASE_URL}/rules/${eventId}`,
  updateEventAvailableSlots: (eventId: string, available_slots: string) => `${BASE_URL}/edit-event/${eventId}/${available_slots}`,
};

export const VALIDATION = {
  title: {
    minLength: 3,
    maxLength: 100
  },
  description: {
    minLength: 10,
    maxLength: 1000
  },
  location: {
    minLength: 3,
    maxLength: 100
  },
  totalSlots: {
    min: 1,
    max: 1000000
  },
  price: {
    max: 100000
  },
  email: {
    maxLength: 254
  },
  eventTypes: [
    'Seminar',
    'Webinar',
    'Kurs',
    'Konsert',
    'Opplæring',
    'Presentasjon',
    'Forelesning',
    'Kunngjøring'
  ]
} as const;
