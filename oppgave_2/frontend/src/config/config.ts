export const BASE_URL = "http://localhost:3999/api/v1";

export const ENDPOINTS = {
  add: `${BASE_URL}/add`,
  update: `${BASE_URL}/update`,
  events: `${BASE_URL}/activeevents`,
  templates: `${BASE_URL}/templates`,
  create: `${BASE_URL}/create`,
  createRegistration: `${BASE_URL}/registrer`,
  createRegistrationById: `${BASE_URL}/registrerWishlist`,
  createWaitlistRegistration: `${BASE_URL}/waitlist-registrer`,
  createActiveEvent: `${BASE_URL}/activeevents/add`,
  createTemplate: `${BASE_URL}/templates/add`,
  getRegistrationEventData: `${BASE_URL}/registrations`,
  getWishlist: (eventId: string) => `${BASE_URL}/${eventId}/waitlist-orders`,
  deleteWaitlistItem: (registrationId: string) => `${BASE_URL}/waitlist-registrations/${registrationId}`,
  getAttendersWaitList: (eventId: string) => `${BASE_URL}/waitlist-registrations/${eventId}`
};