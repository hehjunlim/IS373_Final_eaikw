/**
 * Airtable CRM Integration for Design Gallery
 * Syncs submissions and contributor data
 */

import axios from "axios";

const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_API_TOKEN = process.env.AIRTABLE_API_TOKEN;
const AIRTABLE_BASE_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}`;

const headers = {
  Authorization: `Bearer ${AIRTABLE_API_TOKEN}`,
  "Content-Type": "application/json",
};

/**
 * Create or update submission record in Airtable
 */
export async function syncSubmissionToAirtable(submission) {
  try {
    // Check if submission already exists
    const existing = await axios.get(
      `${AIRTABLE_BASE_URL}/Submissions?filterByFormula={Email}="${submission.submitterEmail}"`,
      { headers }
    );

    const record = {
      fields: {
        "Submitter Name": submission.submitterName,
        Email: submission.submitterEmail,
        URL: submission.url,
        Description: submission.description,
        Status: submission.status,
        "Submitted At": new Date(submission.submittedAt).toISOString().split("T")[0],
        "Sanity ID": submission._id,
      },
    };

    if (existing.data.records.length > 0) {
      // Update existing
      const recordId = existing.data.records[0].id;
      await axios.patch(`${AIRTABLE_BASE_URL}/Submissions/${recordId}`, record, { headers });
      console.log(`Updated Airtable record: ${recordId}`);
    } else {
      // Create new
      await axios.post(`${AIRTABLE_BASE_URL}/Submissions`, { records: [record] }, { headers });
      console.log(`Created Airtable record for ${submission.submitterEmail}`);
    }

    return true;
  } catch (error) {
    console.error("Airtable sync error:", error.response?.data || error.message);
    return false;
  }
}

/**
 * Create or update contributor record
 */
export async function syncContributorToAirtable(contributor) {
  try {
    // Check if contributor already exists
    const existing = await axios.get(
      `${AIRTABLE_BASE_URL}/Contributors?filterByFormula={Email}="${contributor.email}"`,
      { headers }
    );

    const record = {
      fields: {
        Name: contributor.name,
        Email: contributor.email,
        "Contact Info": contributor.contactInfo || "",
        Company: contributor.company || "",
        "Submission Count": contributor.submissionCount || 0,
      },
    };

    if (existing.data.records.length > 0) {
      const recordId = existing.data.records[0].id;
      await axios.patch(`${AIRTABLE_BASE_URL}/Contributors/${recordId}`, record, { headers });
    } else {
      await axios.post(`${AIRTABLE_BASE_URL}/Contributors`, { records: [record] }, { headers });
    }

    return true;
  } catch (error) {
    console.error("Contributor sync error:", error.response?.data || error.message);
    return false;
  }
}

/**
 * Get all submissions from Airtable
 */
export async function getSubmissionsFromAirtable() {
  try {
    const response = await axios.get(`${AIRTABLE_BASE_URL}/Submissions`, { headers });
    return response.data.records.map((record) => ({
      id: record.id,
      ...record.fields,
    }));
  } catch (error) {
    console.error("Airtable fetch error:", error.response?.data || error.message);
    return [];
  }
}

/**
 * Get all contributors from Airtable
 */
export async function getContributorsFromAirtable() {
  try {
    const response = await axios.get(`${AIRTABLE_BASE_URL}/Contributors`, { headers });
    return response.data.records.map((record) => ({
      id: record.id,
      ...record.fields,
    }));
  } catch (error) {
    console.error("Contributors fetch error:", error.response?.data || error.message);
    return [];
  }
}

export default {
  syncSubmissionToAirtable,
  syncContributorToAirtable,
  getSubmissionsFromAirtable,
  getContributorsFromAirtable,
};
