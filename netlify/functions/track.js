const crypto = require("crypto");

// In-memory storage (in production, use a database)
let submissions = [];

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
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

  // Handle POST - Track submission by confirmation number
  if (event.httpMethod === "POST") {
    try {
      const data = JSON.parse(event.body);
      const confirmationNumber = data.confirmationNumber;

      if (!confirmationNumber) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            error: "Confirmation number is required",
          }),
        };
      }

      // Find submission (in production, query from database)
      const submission = submissions.find((s) => s.confirmationNumber === confirmationNumber);

      if (!submission) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({
            success: false,
            error: "Submission not found",
            message: "No submission found with this confirmation number",
          }),
        };
      }

      // Return submission details
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          submission: {
            confirmationNumber: submission.confirmationNumber,
            status: submission.status,
            designStyle: submission.designStyle,
            submittedDate: submission.timestamp,
            reviewDate: submission.reviewDate,
            reviewNotes: submission.reviewNotes,
          },
        }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: "Failed to track submission",
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

// Share submissions array with submissions function
exports.setSubmissions = (subs) => {
  submissions = subs;
};

exports.getSubmissions = () => {
  return submissions;
};
