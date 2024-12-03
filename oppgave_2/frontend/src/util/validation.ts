import { VALIDATION } from '../config/config';

export const validateTitle = (title: string): string | null => {
  if (!title || title.trim() === '') {
    return 'Tittel er påkrevd';
  }
  if (title.length < VALIDATION.title.minLength) {
    return `Tittel må være minst ${VALIDATION.title.minLength} tegn`;
  }
  if (title.length > VALIDATION.title.maxLength) {
    return `Tittel kan ikke være lengre enn ${VALIDATION.title.maxLength} tegn`;
  }
  return null;
};

export const validateDescription = (description: string): string | null => {
  if (!description || description.trim() === '') {
    return 'Beskrivelse er påkrevd';
  }
  if (description.length < VALIDATION.description.minLength) {
    return `Beskrivelse må være minst ${VALIDATION.description.minLength} tegn`;
  }
  if (description.length > VALIDATION.description.maxLength) {
    return `Beskrivelse kan ikke være lengre enn ${VALIDATION.description.maxLength} tegn`;
  }
  return null;
};

{/* SRC: kilde: chatgpt.com  || metode under er laget med gpt, endringer er gjort for å tilpasse til vårt prosjekt */}
export const validateDate = (date: string): string | null => {
  if (!date) {
    return 'Dato er påkrevd';
  }

  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    return 'Dato kan ikke være i fortiden';
  }

  return null;
};

export const validateLocation = (location: string): string | null => {
  if (!location || location.trim() === '') {
    return 'Lokasjon er påkrevd';
  }
  if (location.length < VALIDATION.location.minLength) {
    return `Lokasjon må være minst ${VALIDATION.location.minLength} tegn`;
  }
  if (location.length > VALIDATION.location.maxLength) {
    return `Lokasjon kan ikke være lengre enn ${VALIDATION.location.maxLength} tegn`;
  }
  return null;
};

export const validateEventType = (eventType: string): string | null => {
  if (!eventType || eventType.trim() === '') {
    return 'Kategori er påkrevd';
  }
  if (!VALIDATION.eventTypes.includes(eventType as typeof VALIDATION.eventTypes[number])) {
    return 'Ugyldig kategori valgt';
  }
  return null;
};

export const validateTotalSlots = (totalSlots: number): string | null => {
  if (totalSlots === undefined || totalSlots === null) {
    return 'Antall plasser er påkrevd';
  }
  if (!Number.isInteger(totalSlots)) {
    return 'Antall plasser må være et heltall';
  }
  if (totalSlots < VALIDATION.totalSlots.min) {
    return `Antall plasser må være minst ${VALIDATION.totalSlots.min}`;
  }
  if (totalSlots > VALIDATION.totalSlots.max) {
    return `Antall plasser kan ikke være mer enn ${VALIDATION.totalSlots.max}`;
  }
  return null;
};

export const validatePrice = (price: number): string | null => {
  if (price === undefined || price === null) {
    return 'Pris er påkrevd';
  }
  if (price < 0) {
    return 'Pris kan ikke være negativ';
  }
  if (!Number.isFinite(price)) {
    return 'Ugyldig pris';
  }
  if (price > VALIDATION.price.max) {
    return `Pris kan ikke være høyere enn ${VALIDATION.price.max}`;
  }
  return null;
};

{/* SRC: kilde: chatgpt.com  || metode under er laget med gpt, endringer er gjort for å tilpasse til vårt prosjekt */}
export const validateEmail = (email: string): string | null => {
  if (!email || email.trim() === '') {
    return 'E-post er påkrevd';
  }

  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!emailRegex.test(email)) {
    return 'Ugyldig e-postadresse';
  }

  if (email.length > VALIDATION.email.maxLength) {
    return `E-postadressen kan ikke være lengre enn ${VALIDATION.email.maxLength} tegn`;
  }

  return null;
};

export const validateEventData = (eventData: {
  title: string;
  description: string;
  date: string;
  location: string;
  event_type: string;
  total_slots: number;
  price: number;
}): Record<string, string | null> => {
  return {
    title: validateTitle(eventData.title),
    description: validateDescription(eventData.description),
    date: validateDate(eventData.date),
    location: validateLocation(eventData.location),
    event_type: validateEventType(eventData.event_type),
    total_slots: validateTotalSlots(eventData.total_slots),
    price: validatePrice(eventData.price)
  };
};

export const hasValidationErrors = (validationResults: Record<string, string | null>): boolean => {
  return Object.values(validationResults).some(error => error !== null);
};
