const crypto = require("crypto");

// In-memory storage (in production, use a database)
const submissions = [];

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Content-Type": "application/json",
  };

  // Handle preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  // Handle POST - Submit new style guide
  if (event.httpMethod === "POST") {
    try {
      const data = JSON.parse(event.body);

      // Generate confirmation number
      const confirmationNumber = "DSG-" + crypto.randomBytes(4).toString("hex").toUpperCase();

      // Create submission object
      const submission = {
        id: confirmationNumber,
        confirmationNumber: confirmationNumber,
        timestamp: new Date().toISOString(),
        status: "pending",
        name: data.name,
        email: data.email,
        designStyle: data.designStyle,
        demoUrl: data.demoUrl,
        authenticity: data.authenticity,
        toolsUsed: data.toolsUsed || "",
        additionalNotes: data.additionalNotes || "",
        screenshots: data.screenshots || [], // URLs would be stored here
        reviewedBy: null,
        reviewNotes: "",
        reviewDate: null,
      };

      // Store submission (in production, save to database)
      submissions.push(submission);

      // In production, send confirmation email here

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          confirmationNumber: confirmationNumber,
          message:
            "Your style guide submission has been received! Please save your confirmation number for tracking.",
        }),
      };
    } catch (error) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: "Invalid submission data",
          details: error.message,
        }),
      };
    }
  }

  // Handle GET - Retrieve submissions for review mode
  if (event.httpMethod === "GET") {
    try {
      // In production, add authentication check here

      // Return all submissions
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          submissions: submissions,
          count: submissions.length,
        }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: "Failed to retrieve submissions",
          details: error.message,
        }),
      };
    }
  }

  // Method not allowed
  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({
      success: false,
      error: "Method not allowed",
    }),
  };
};
