import { BACKEND_BUCKET } from "../env";
import { errorMessages } from "../constants";

export default new class WOTDService {

  async get(): Promise<string> {
    const response = await fetch(`${BACKEND_BUCKET}/key_of_the_day`);
    if (!response.ok) {
      throw new Error(errorMessages.backend.any);
    }
    return await response.text();
  }

}
