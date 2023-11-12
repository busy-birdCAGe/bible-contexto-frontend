import { BACKEND_BUCKET } from "../env";

export default new class WOTDService {

  async get(): Promise<string> {
    const response = await fetch(`${BACKEND_BUCKET}/word_of_the_day`);
    if (!response.ok) {
    throw new Error(
        `Error: S3 get returned ${response.status} status`
    );
    }
    return await response.text();
  }

}
