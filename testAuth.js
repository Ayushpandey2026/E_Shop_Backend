import axios from "axios";

const baseURL = "http://localhost:8000/api/web/auth";

async function testSignup() {
  try {
    console.log("Testing Signup...");
    const res = await axios.post(`${baseURL}/signup`, {
      name: "Test User",
      email: "test@example.com",
      password: "password123"
    });
    console.log("Signup Success:", res.data);
    return res.data.token;
  } catch (err) {
    console.error("Signup Error:", err.response?.data || err.message);
    return null;
  }
}

async function testLogin() {
  try {
    console.log("Testing Login...");
    const res = await axios.post(`${baseURL}/login`, {
      email: "test@example.com",
      password: "password123",
      role: "user"
    });
    console.log("Login Success:", res.data);
    return res.data.token;
  } catch (err) {
    console.error("Login Error:", err.response?.data || err.message);
    return null;
  }
}

async function testLoginCaseInsensitive() {
  try {
    console.log("Testing Login with different case...");
    const res = await axios.post(`${baseURL}/login`, {
      email: "TEST@EXAMPLE.COM",
      password: "password123",
      role: "user"
    });
    console.log("Login Case Insensitive Success:", res.data);
    return res.data.token;
  } catch (err) {
    console.error("Login Case Insensitive Error:", err.response?.data || err.message);
    return null;
  }
}

async function testForgotPassword() {
  try {
    console.log("Testing Forgot Password...");
    const res = await axios.post(`${baseURL}/forgot-password`, {
      email: "test@example.com"
    });
    console.log("Forgot Password Success:", res.data);
  } catch (err) {
    console.error("Forgot Password Error:", err.response?.data || err.message);
  }
}

async function testSignupDuplicate() {
  try {
    console.log("Testing Signup Duplicate...");
    const res = await axios.post(`${baseURL}/signup`, {
      name: "Test User2",
      email: "test@example.com",
      password: "password123"
    });
    console.log("Signup Duplicate Success:", res.data);
  } catch (err) {
    console.error("Signup Duplicate Error:", err.response?.data || err.message);
  }
}

async function testLoginWrongPassword() {
  try {
    console.log("Testing Login Wrong Password...");
    const res = await axios.post(`${baseURL}/login`, {
      email: "test@example.com",
      password: "wrong",
      role: "user"
    });
    console.log("Login Wrong Password Success:", res.data);
  } catch (err) {
    console.error("Login Wrong Password Error:", err.response?.data || err.message);
  }
}

async function runTests() {
  console.log("Starting Critical Path Testing for Authentication...\n");

  // Test signup
  const token = await testSignup();
  console.log("\n");

  // Test duplicate signup
  await testSignupDuplicate();
  console.log("\n");

  // Test login
  await testLogin();
  console.log("\n");

  // Test login case insensitive
  await testLoginCaseInsensitive();
  console.log("\n");

  // Test login wrong password
  await testLoginWrongPassword();
  console.log("\n");

  // Test forgot password
  await testForgotPassword();
  console.log("\n");

  console.log("Critical Path Testing Completed.");
}

runTests();
