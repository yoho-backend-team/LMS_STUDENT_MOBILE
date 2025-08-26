import { getCommunities } from "../Service";
import { setStudentCommunity, setLoading } from "./CommunitySlice";

export const getAllStudentCommunities =
  (courseId: string) => async (dispatch: any) => {
    try {
      dispatch(setLoading(true));
      console.log("📡 Fetching communities for course:", courseId);

      // ⚠️ Try without leading slash if Client already has baseURL
      const response = await getCommunities(
        `institutes/community/course/${courseId}`
      );

      // Defensive parsing: support both {data: [...]} and {status, message, data: [...]}
      let communitiesArray: any[] = [];

      if (Array.isArray(response)) {
        communitiesArray = response;
      } else if (Array.isArray(response?.data)) {
        communitiesArray = response.data;
      } else if (Array.isArray(response?.data?.data)) {
        communitiesArray = response.data.data;
      }

      console.log("✅ Parsed communities:", communitiesArray);

      dispatch(setStudentCommunity(communitiesArray));
    } catch (error) {
      console.error("❌ Failed to fetch communities:", error);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };
