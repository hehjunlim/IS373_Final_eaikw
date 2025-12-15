/**
 * Sanity Query Builder
 * Centralized queries for the Design Gallery platform
 */

import sanityClient from "@sanity/client";

// Initialize client only if credentials are available
let client = null;

if (process.env.SANITY_PROJECT_ID) {
  try {
    client = sanityClient({
      projectId: process.env.SANITY_PROJECT_ID,
      dataset: process.env.SANITY_DATASET || "production",
      apiVersion: "2023-12-01",
      useCdn: true,
    });
  } catch (error) {
    console.warn("⚠️  Sanity CMS not configured. Set SANITY_PROJECT_ID in .env");
  }
} else {
  console.warn("⚠️  Sanity CMS credentials not found. Using fallback data.");
}

/**
 * Get all approved submissions
 */
export async function getApprovedSubmissions() {
  if (!client) {
    return [];
  }
  try {
    const submissions = await client.fetch(
      `*[_type == "gallerySubmission" && status == "approved"] | order(submittedAt desc) {
        _id,
        submitterName,
        submitterEmail,
        url,
        description,
        status,
        submittedAt,
        "screenshot": screenshot.asset->url,
        "designStyle": designStyle->{
          title,
          slug
        }
      }`
    );
    return submissions;
  } catch (error) {
    console.error("Error fetching approved submissions:", error);
    return [];
  }
}

/**
 * Get pending submissions for review
 */
export async function getPendingSubmissions() {
  if (!client) {
    return [];
  }
  try {
    const submissions = await client.fetch(
      `*[_type == "gallerySubmission" && status == "submitted"] | order(submittedAt desc) {
        _id,
        submitterName,
        submitterEmail,
        url,
        description,
        status,
        submittedAt,
        "screenshot": screenshot.asset->url
      }`
    );
    return submissions;
  } catch (error) {
    console.error("Error fetching pending submissions:", error);
    return [];
  }
}

/**
 * Get single submission
 */
export async function getSubmission(id) {
  if (!client) {
    return null;
  }
  try {
    const submission = await client.fetch(
      `*[_type == "gallerySubmission" && _id == $id][0] {
        _id,
        submitterName,
        submitterEmail,
        url,
        description,
        status,
        submittedAt,
        reviewNotes,
        reviewedAt,
        "screenshot": screenshot.asset->url,
        "designStyle": designStyle->{
          title,
          slug,
          description
        }
      }`,
      { id }
    );
    return submission;
  } catch (error) {
    console.error("Error fetching submission:", error);
    return null;
  }
}

/**
 * Get all design styles
 */
export async function getDesignStyles() {
  if (!client) {
    return [];
  }
  try {
    const styles = await client.fetch(
      `*[_type == "designStyle"] | order(title asc) {
        _id,
        title,
        slug,
        description,
        "colorPalette": colorPalette.colors,
        "sampleImages": sampleImages[]{
          "url": image.asset->url,
          caption
        },
        "submissionCount": count(gallerySubmissions)
      }`
    );
    return styles;
  } catch (error) {
    console.error("Error fetching design styles:", error);
    return [];
  }
}

/**
 * Get single design style with related submissions
 */
export async function getDesignStyle(slug) {
  if (!client) {
    return null;
  }
  try {
    const style = await client.fetch(
      `*[_type == "designStyle" && slug.current == $slug][0] {
        _id,
        title,
        slug,
        description,
        historicalBackground,
        "colorPalette": colorPalette.colors,
        typographyGuidance,
        "sampleImages": sampleImages[]{
          "url": image.asset->url,
          caption
        },
        "submissions": gallerySubmissions[]->{
          _id,
          submitterName,
          url,
          description,
          status,
          "screenshot": screenshot.asset->url
        }
      }`,
      { slug }
    );
    return style;
  } catch (error) {
    console.error("Error fetching design style:", error);
    return null;
  }
}

/**
 * Get all articles
 */
export async function getArticles() {
  if (!client) {
    return [];
  }
  try {
    const articles = await client.fetch(
      `*[_type == "article"] | order(publishedAt desc) {
        _id,
        title,
        slug,
        description,
        publishedAt,
        "author": author->{
          name,
          slug
        },
        "image": coverImage.asset->url,
        tags
      }`
    );
    return articles;
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}

/**
 * Get single article
 */
export async function getArticle(slug) {
  if (!client) {
    return null;
  }
  try {
    const article = await client.fetch(
      `*[_type == "article" && slug.current == $slug][0] {
        _id,
        title,
        slug,
        description,
        body,
        publishedAt,
        "author": author->{
          name,
          slug,
          bio,
          "image": image.asset->url
        },
        "coverImage": coverImage.asset->url,
        tags
      }`,
      { slug }
    );
    return article;
  } catch (error) {
    console.error("Error fetching article:", error);
    return null;
  }
}

/**
 * Get all authors
 */
export async function getAuthors() {
  if (!client) {
    return [];
  }
  try {
    const authors = await client.fetch(
      `*[_type == "author"] | order(name asc) {
        _id,
        name,
        slug,
        bio,
        "image": image.asset->url,
        email,
        url
      }`
    );
    return authors;
  } catch (error) {
    console.error("Error fetching authors:", error);
    return [];
  }
}

/**
 * Get submission by email
 */
export async function getSubmissionsByEmail(email) {
  if (!client) {
    return [];
  }
  try {
    const submissions = await client.fetch(
      `*[_type == "gallerySubmission" && submitterEmail == $email] | order(submittedAt desc) {
        _id,
        submitterName,
        url,
        description,
        status,
        submittedAt,
        reviewNotes,
        "screenshot": screenshot.asset->url
      }`,
      { email }
    );
    return submissions;
  } catch (error) {
    console.error("Error fetching submissions by email:", error);
    return [];
  }
}

/**
 * Get statistics
 */
export async function getStatistics() {
  if (!client) {
    return null;
  }
  try {
    const stats = await client.fetch(`{
      "totalSubmissions": count(*[_type == "gallerySubmission"]),
      "approvedCount": count(*[_type == "gallerySubmission" && status == "approved"]),
      "pendingCount": count(*[_type == "gallerySubmission" && status == "submitted"]),
      "rejectedCount": count(*[_type == "gallerySubmission" && status == "rejected"]),
      "articleCount": count(*[_type == "article"]),
      "styleCount": count(*[_type == "designStyle"]),
      "authorCount": count(*[_type == "author"])
    }`);
    return stats;
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return {
      totalSubmissions: 0,
      approvedCount: 0,
      pendingCount: 0,
      rejectedCount: 0,
      articleCount: 0,
      styleCount: 0,
      authorCount: 0,
    };
  }
}

export default {
  getApprovedSubmissions,
  getPendingSubmissions,
  getSubmission,
  getDesignStyles,
  getDesignStyle,
  getArticles,
  getArticle,
  getAuthors,
  getSubmissionsByEmail,
  getStatistics,
};
