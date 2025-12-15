/**
 * Netlify Function: Sanity to Airtable Sync
 * Receives webhooks from Sanity and syncs to Airtable
 */

const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_API_TOKEN = process.env.AIRTABLE_API_TOKEN;
const AIRTABLE_TABLE_NAME = "Submissions";

exports.handler = async (event) => {
  // Only accept POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const body = JSON.parse(event.body);

    // Sanity sends the document in the payload
    const document = body.document || body;

    // Only process gallerySubmission documents
    if (document._type !== "gallerySubmission") {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Skipped non-gallery submission" }),
      };
    }

    // Only process published documents
    if (!document._id || document._id.startsWith("drafts.")) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Skipped draft" }),
      };
    }

    // Format data for Airtable
    const airtablePayload = {
      records: [
        {
          fields: {
            "Submitter Name": document.submitterName || "",
            Email: document.submitterEmail || "",
            URL: document.url || "",
            Description: document.description || "",
            Status: document.status || "submitted",
            "Sanity ID": document._id,
            "Submitted At": document._createdAt || new Date().toISOString(),
          },
        },
      ],
    };

    // Send to Airtable
    const airtableResponse = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(airtablePayload),
      }
    );

    const airtableData = await airtableResponse.json();

    if (!airtableResponse.ok) {
      console.error("Airtable error:", airtableData);
      return {
        statusCode: airtableResponse.status,
        body: JSON.stringify({
          error: "Failed to sync to Airtable",
          details: airtableData,
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Synced to Airtable",
        airtableRecord: airtableData.records[0],
      }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal server error",
        details: error.message,
      }),
    };
  }
};
