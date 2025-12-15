import sanityClient from "@sanity/client";

const client = sanityClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || "production",
  apiVersion: "2023-12-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT",
  "Content-Type": "application/json",
};

/**
 * Create a new gallery submission in Sanity
 */
export async function createSubmission(event) {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const data = JSON.parse(event.body);

    // Validate required fields
    const requiredFields = ["submitterName", "submitterEmail", "url", "description"];
    const missing = requiredFields.filter((field) => !data[field]);
    if (missing.length > 0) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: `Missing required fields: ${missing.join(", ")}` }),
      };
    }

    // Create submission document in Sanity
    const submission = await client.create({
      _type: "gallerySubmission",
      submitterName: data.submitterName,
      submitterEmail: data.submitterEmail,
      url: data.url,
      description: data.description,
      status: "submitted",
      submittedAt: new Date().toISOString(),
    });

    // Call Discord webhook if configured
    if (process.env.DISCORD_WEBHOOK_URL) {
      await notifyDiscord(submission, "submitted");
    }

    return {
      statusCode: 201,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        submission: {
          id: submission._id,
          status: submission.status,
          submittedAt: submission.submittedAt,
        },
      }),
    };
  } catch (error) {
    console.error("Submission error:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Failed to create submission" }),
    };
  }
}

/**
 * Get all approved submissions
 */
export async function getApprovedSubmissions(event) {
  try {
    const submissions = await client.fetch(
      '*[_type == "gallerySubmission" && status == "approved"] | order(submittedAt desc)'
    );

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ submissions }),
    };
  } catch (error) {
    console.error("Fetch error:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Failed to fetch submissions" }),
    };
  }
}

/**
 * Get submissions for review (instructor panel)
 */
export async function getSubmissionsForReview(event) {
  // Verify authorization
  const authHeader = event.headers.authorization || event.headers.Authorization;
  if (authHeader !== `Bearer ${process.env.REVIEW_API_TOKEN}`) {
    return {
      statusCode: 401,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Unauthorized" }),
    };
  }

  try {
    const submissions = await client.fetch(
      `*[_type == "gallerySubmission"] | order(submittedAt desc) {
        _id,
        submitterName,
        submitterEmail,
        url,
        description,
        status,
        submittedAt,
        reviewNotes,
        reviewedAt,
        "screenshot": screenshot.asset->url
      }`
    );

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ submissions }),
    };
  } catch (error) {
    console.error("Fetch error:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Failed to fetch submissions" }),
    };
  }
}

/**
 * Update submission status (approve/reject)
 */
export async function updateSubmissionStatus(event) {
  if (event.httpMethod !== "PUT") {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  // Verify authorization
  const authHeader = event.headers.authorization || event.headers.Authorization;
  if (authHeader !== `Bearer ${process.env.REVIEW_API_TOKEN}`) {
    return {
      statusCode: 401,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Unauthorized" }),
    };
  }

  try {
    const data = JSON.parse(event.body);
    const { submissionId, status, reviewNotes } = data;

    if (!submissionId || !status) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Missing submissionId or status" }),
      };
    }

    // Update submission
    const updated = await client
      .patch(submissionId)
      .set({
        status,
        reviewNotes: reviewNotes || "",
        reviewedAt: new Date().toISOString(),
      })
      .commit();

    // Send Discord notification for approvals
    if (status === "approved" && process.env.DISCORD_WEBHOOK_URL) {
      const submission = await client.getDocument(submissionId);
      await notifyDiscord(submission, "approved");
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ success: true, submission: updated }),
    };
  } catch (error) {
    console.error("Update error:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Failed to update submission" }),
    };
  }
}

/**
 * Send Discord notification
 */
async function notifyDiscord(submission, event) {
  try {
    const embed = {
      title: event === "submitted" ? "📝 New Gallery Submission" : "✅ Submission Approved",
      color: event === "submitted" ? 3447003 : 3066993,
      fields: [
        { name: "Submitter", value: submission.submitterName, inline: true },
        { name: "Email", value: submission.submitterEmail, inline: true },
        { name: "URL", value: `[View](${submission.url})`, inline: true },
        { name: "Description", value: submission.description.substring(0, 100) + "..." },
        { name: "Status", value: submission.status },
      ],
      timestamp: new Date().toISOString(),
    };

    await fetch(process.env.DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embeds: [embed] }),
    });
  } catch (error) {
    console.error("Discord notification error:", error);
  }
}
