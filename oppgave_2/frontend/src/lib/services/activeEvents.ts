import { ENDPOINTS } from "@/config/config";

type CreateActiveEventParams = {
  event_id: string;
  template_id?: number;
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
        console.log("FAIL: ", data.data);
        return;
      }
      return data;
    } catch (error) {
      console.log(error);
    } finally {
      console.log("success");
    }
  };
