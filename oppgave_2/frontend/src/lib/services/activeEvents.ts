import { ENDPOINTS } from "@/config/config";

type CreateActiveEventParams = {
  event_id: string;
  template_id?: number;
};

export const checkExistingActiveEvents = async (templateId: number, date: string) => {
  try {
    const response = await fetch(ENDPOINTS.events);
    const data = await response.json();
    
    if (!data.success) {
      console.error("Kunne ikke hente aktive arrangementer");
      return false;
    }
    const existingEvent = data.data.find((event: any) => 
      event.template_id === templateId && 
      new Date(event.date).toISOString().split('T')[0] === new Date(date).toISOString().split('T')[0]
    );

    return existingEvent !== undefined;
  } catch (error) {
    console.error("Feil ved sjekk av eksisterende arrangementer:", error);
    return false;
  }
};

export const onAddActiveEvent = async ({ event_id, template_id }: CreateActiveEventParams) => {
  try {
    const response = await fetch(ENDPOINTS.createActiveEvent, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        event_id,
        template_id
      }),
    });

    const data = await response.json();
    if (!data.success) {
      console.error("FAIL: ", data.error);
      return {
        success: false,
        error: data.error
      };
    }
    return {
      success: true,
      data: data.data
    };
  } catch (error) {
    console.error("Feil ved opprettelse av aktivt arrangement:", error);
    return {
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Det oppstod en feil ved opprettelse av arrangementet"
      }
    };
  }
};
