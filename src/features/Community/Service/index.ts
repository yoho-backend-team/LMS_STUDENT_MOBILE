import { getErrorMessage } from "~/utils/errorHandler";
import Client from "~/api/httpClients";

export const getCommunities = async (url: string) => {
  try {
    const response = await Client.get(url);

    // Log raw response to check structure
    console.log("🔍 Raw API response from", url, ":", response);

    return response;
  } catch (error) {
    console.error("❌ API error:", error);
    throw new Error(getErrorMessage(error));
  }
};
