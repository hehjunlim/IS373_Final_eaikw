# Design Gallery API Documentation

## Overview

This document describes the API endpoints for the Design Gallery platform, which
manages design system submissions, reviews, and integrations with Sanity CMS,
Airtable, and Discord.

---

## Base URLs

- **Development:** `http://localhost:8080/.netlify/functions`
- **Production:** `https://yourdomain.com/.netlify/functions`

---

## Authentication

Most endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer YOUR_API_TOKEN
```

---

## Endpoints

### 1. Create Submission

**Endpoint:** `POST /sanity-submissions`

**Description:** Submit a new design system to the gallery.

**Request Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "submitterName": "John Doe",
  "submitterEmail": "john@example.com",
  "url": "https://example.com/design-system",
  "description": "A comprehensive design system with...",
  "screenshot": "https://example.com/screenshot.jpg"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "submission": {
    "id": "sanity-doc-id",
    "status": "submitted",
    "submittedAt": "2025-12-15T10:00:00Z"
  }
}
```

**Error Response (400 Bad Request):**

```json
{
  "error": "Missing required fields: submitterName, url"
}
```

---

### 2. Get Approved Submissions

**Endpoint:** `GET /sanity-submissions?status=approved`

**Description:** Retrieve all approved submissions for public gallery display.

**Request Headers:**

```
Content-Type: application/json
```

**Response (200 OK):**

```json
{
  "submissions": [
    {
      "_id": "submission-1",
      "submitterName": "Jane Smith",
      "submitterEmail": "jane@example.com",
      "url": "https://example.com",
      "description": "Modern design system...",
      "status": "approved",
      "submittedAt": "2025-12-10T14:32:00Z",
      "screenshot": {
        "url": "https://cdn.sanity.io/images/...",
        "alt": "Screenshot of design system"
      }
    }
  ]
}
```

---

### 3. Get Submissions for Review

**Endpoint:** `GET /sanity-submissions`

**Description:** Retrieve all submissions for instructor review panel.

**Request Headers:**

```
Authorization: Bearer YOUR_REVIEW_TOKEN
Content-Type: application/json
```

**Response (200 OK):**

```json
{
  "submissions": [
    {
      "_id": "submission-1",
      "submitterName": "John Doe",
      "submitterEmail": "john@example.com",
      "url": "https://example.com",
      "description": "Design system description",
      "status": "submitted",
      "submittedAt": "2025-12-15T10:00:00Z",
      "reviewNotes": "",
      "reviewedAt": null,
      "screenshot": "https://cdn.sanity.io/..."
    }
  ]
}
```

**Error Response (401 Unauthorized):**

```json
{
  "error": "Unauthorized"
}
```

---

### 4. Update Submission Status

**Endpoint:** `PUT /sanity-submissions`

**Description:** Approve, reject, or request changes on a submission.

**Request Headers:**

```
Authorization: Bearer YOUR_REVIEW_TOKEN
Content-Type: application/json
```

**Request Body:**

```json
{
  "submissionId": "sanity-doc-id",
  "status": "approved",
  "reviewNotes": "Excellent design system with clear documentation."
}
```

**Status Options:**

- `submitted` - Initial status
- `under-review` - Being reviewed
- `approved` - Approved for gallery
- `changes-requested` - Feedback provided
- `rejected` - Does not meet guidelines

**Response (200 OK):**

```json
{
  "success": true,
  "submission": {
    "_id": "sanity-doc-id",
    "status": "approved",
    "reviewedAt": "2025-12-15T11:30:00Z",
    "reviewNotes": "Excellent design system..."
  }
}
```

**Error Response (401 Unauthorized):**

```json
{
  "error": "Unauthorized"
}
```

---

## CRM Integration Endpoints

### 5. Sync Submission to Airtable

**Module:** `airtable-crm.js`

**Function:** `syncSubmissionToAirtable(submission)`

**Description:** Automatically syncs submission data to Airtable when a new
submission is created.

**Parameters:**

```javascript
{
  "_id": "sanity-doc-id",
  "submitterName": "John Doe",
  "submitterEmail": "john@example.com",
  "url": "https://example.com",
  "description": "Design system...",
  "status": "submitted",
  "submittedAt": "2025-12-15T10:00:00Z"
}
```

**Returns:**

```javascript
true | false; // Success or failure
```

---

### 6. Sync Contributor to Airtable

**Module:** `airtable-crm.js`

**Function:** `syncContributorToAirtable(contributor)`

**Description:** Create or update contributor records in Airtable.

**Parameters:**

```javascript
{
  "name": "John Doe",
  "email": "john@example.com",
  "contactInfo": "Phone or additional contact",
  "company": "Company Name",
  "submissionCount": 1
}
```

**Returns:**

```javascript
true | false; // Success or failure
```

---

### 7. Get Submissions from Airtable

**Module:** `airtable-crm.js`

**Function:** `getSubmissionsFromAirtable()`

**Description:** Retrieve all submissions from Airtable CRM.

**Returns:**

```javascript
[
  {
    id: "airtable-record-id",
    "Submitter Name": "John Doe",
    Email: "john@example.com",
    URL: "https://example.com",
    Status: "approved",
  },
];
```

---

## Discord Integration Endpoints

### 8. Notify New Submission

**Module:** `discord-notifications.js`

**Function:** `notifySubmission(submission)`

**Description:** Send a notification to Discord when a new submission is
created.

**Parameters:**

```javascript
{
  "_id": "sanity-doc-id",
  "submitterName": "John Doe",
  "submitterEmail": "john@example.com",
  "url": "https://example.com",
  "description": "Design system...",
  "submittedAt": "2025-12-15T10:00:00Z"
}
```

**Discord Message:** Sent to `#gallery-submissions` channel

**Returns:**

```javascript
true | false; // Success or failure
```

---

### 9. Notify Approval

**Module:** `discord-notifications.js`

**Function:** `notifyApproval(submission)`

**Description:** Send a notification when a submission is approved.

**Parameters:**

```javascript
{
  "_id": "sanity-doc-id",
  "submitterName": "John Doe",
  "submitterEmail": "john@example.com",
  "url": "https://example.com",
  "status": "approved",
  "reviewedAt": "2025-12-15T11:30:00Z"
}
```

**Discord Message:** Sent to `#announcements` channel

**Returns:**

```javascript
true | false; // Success or failure
```

---

### 10. Notify Rejection

**Module:** `discord-notifications.js`

**Function:** `notifyRejection(submission, reason)`

**Description:** Send a notification when a submission is rejected.

**Parameters:**

```javascript
{
  "_id": "sanity-doc-id",
  "submitterName": "John Doe",
  "submitterEmail": "john@example.com",
  "url": "https://example.com",
  "status": "rejected",
  "reviewedAt": "2025-12-15T11:30:00Z"
}
```

**Reason:** Optional string explaining rejection

**Returns:**

```javascript
true | false; // Success or failure
```

---

## Error Handling

### Standard Error Responses

**400 Bad Request:**

```json
{
  "error": "Description of what went wrong"
}
```

**401 Unauthorized:**

```json
{
  "error": "Invalid or missing authentication token"
}
```

**404 Not Found:**

```json
{
  "error": "Resource not found"
}
```

**500 Internal Server Error:**

```json
{
  "error": "An unexpected error occurred"
}
```

---

## Rate Limiting

Current rate limits (subject to change):

- **Submissions:** 10 per hour per IP
- **Review API:** 100 per hour per token
- **Read API:** 1000 per hour per IP

---

## Webhooks

### Incoming Webhooks

No incoming webhooks required. All updates are handled through direct API calls.

### Outgoing Webhooks

**Discord Webhooks** are configured to send notifications on:

- New submission created
- Submission approved
- Submission rejected

**Configuration:** Set `DISCORD_WEBHOOK_URL` in environment

---

## Data Models

### Submission Schema (Sanity)

```json
{
  "_id": "string",
  "_type": "gallerySubmission",
  "submitterName": "string (required)",
  "submitterEmail": "string (required)",
  "url": "string (required, URL format)",
  "screenshot": {
    "_type": "image",
    "asset": { "url": "string" }
  },
  "description": "string (required)",
  "status": "submitted | under-review | approved | changes-requested | rejected",
  "submittedAt": "datetime",
  "reviewNotes": "string (optional)",
  "reviewedAt": "datetime (optional)",
  "reviewedBy": {
    "_ref": "author-id"
  }
}
```

### Design Style Schema (Sanity)

```json
{
  "_id": "string",
  "_type": "designStyle",
  "title": "string",
  "slug": "string",
  "description": "string",
  "historicalBackground": "array of blocks",
  "colorPalette": {
    "colors": [
      {
        "name": "string",
        "hex": "string",
        "usage": "string"
      }
    ]
  },
  "typographyGuidance": "array of blocks",
  "sampleImages": [
    {
      "image": "image object",
      "caption": "string"
    }
  ],
  "gallerySubmissions": ["array of references"]
}
```

### Author Schema (Sanity)

```json
{
  "_id": "string",
  "_type": "author",
  "name": "string",
  "slug": "string",
  "bio": "string",
  "image": "image object",
  "email": "string",
  "url": "string (URL)"
}
```

### Article Schema (Sanity)

```json
{
  "_id": "string",
  "_type": "article",
  "title": "string",
  "slug": "string",
  "description": "string",
  "author": { "_ref": "author-id" },
  "publishedAt": "datetime",
  "body": "array of blocks",
  "coverImage": "image object",
  "tags": ["array of strings"]
}
```

---

## Usage Examples

### Example 1: Submit a Design System

```javascript
fetch("/.netlify/functions/sanity-submissions", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    submitterName: "Jane Smith",
    submitterEmail: "jane@example.com",
    url: "https://design.example.com",
    description: "Our comprehensive design system...",
  }),
})
  .then((r) => r.json())
  .then((data) => console.log("Submission created:", data.submission.id));
```

### Example 2: Approve a Submission

```javascript
fetch("/.netlify/functions/sanity-submissions", {
  method: "PUT",
  headers: {
    Authorization: "Bearer YOUR_TOKEN",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    submissionId: "doc-id",
    status: "approved",
    reviewNotes: "Great work!",
  }),
})
  .then((r) => r.json())
  .then((data) => console.log("Updated:", data.submission.status));
```

### Example 3: Get Approved Submissions for Gallery

```javascript
fetch("/.netlify/functions/sanity-submissions?status=approved")
  .then((r) => r.json())
  .then((data) => {
    data.submissions.forEach((sub) => {
      console.log(`${sub.submitterName}: ${sub.url}`);
    });
  });
```

---

## Support & Contact

For API support or integration questions:

- Create an issue in the repository
- Contact the development team
- Check the GitHub Issues for known problems

---

**Last Updated:** December 15, 2025  
**API Version:** 1.0.0
