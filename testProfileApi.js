import axios from "axios";

const token = "1759344489"; // Replace with a valid token

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
