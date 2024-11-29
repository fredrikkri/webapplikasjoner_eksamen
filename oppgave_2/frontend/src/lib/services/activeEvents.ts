import { ENDPOINTS } from "@/config/config";

export const onAddActiveEvent = async ({ event_id }: { event_id: string }) => {
    try {
      const response = await fetch(ENDPOINTS.createActiveEvent, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ event_id }),
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
