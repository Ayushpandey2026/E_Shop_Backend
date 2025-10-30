import axios from "axios";

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZTFiNzlhYjUxN2VkNjkyNmM3MWZmZSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzYxODM0OTg0LCJleHAiOjE3NjI0Mzk3ODR9.Bb3iRGlFG-mqWlrR8HAARGuYOmGvQMOEdNx7z8MVfd0";

const testProfileApi = async () => {
  try {
    const res = await axios.get("http://localhost:8000/api/web/auth/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Profile API response:", res.data);
  } catch (err) {
    if (err.response) {
      console.error("Profile API error response:", err.response.data);
    } else {
      console.error("Profile API error:", err.message);
    }
  }
};

testProfileApi();
