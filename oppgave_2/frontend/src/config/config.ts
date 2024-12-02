import DownloadExcel from "@/components/DownloadeExcel";

export const BASE_URL = "http://localhost:3999/api/v1";
export const BASE_WEB = "http://localhost:4000/events/";

export const ENDPOINTS = {
  add: `${BASE_URL}/add`,
  update: `${BASE_URL}/update`,
  events: `${BASE_URL}/activeevents`,
  templates: `${BASE_URL}/templates`,
  create: `${BASE_URL}/create`,
  deleteEvent: (eventId: string) => `${BASE_URL}/deleteEvent/${eventId}`,
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
  rules: (eventId: string) => `${BASE_URL}/rules/${eventId}`
};
