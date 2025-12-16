/**
 * Eleventy data file for gallery submissions
 * - Public builds: only approved submissions
 * - Review/admin builds: all submissions
 *
 * Control review mode with env var `ELEVENTY_REVIEW` or `REVIEW_MODE` set to "true" during build.
 * Build will fail loudly if Sanity is unreachable to avoid leaking content.
 */
import "dotenv/config";
import { getApprovedSubmissions, getAllSubmissions } from "./sanity-queries.js";

export default async function () {
  const reviewMode =
    (process.env.ELEVENTY_REVIEW && process.env.ELEVENTY_REVIEW === "true") ||
    (process.env.REVIEW_MODE && process.env.REVIEW_MODE === "true");

  try {
    if (reviewMode) {
      const all = await getAllSubmissions();
      return { submissions: all, reviewMode: true };
    }

    const approved = await getApprovedSubmissions();
    return { submissions: approved, reviewMode: false };
  } catch (error) {
    // Fail the build loudly if Sanity cannot be reached or returns an error.
    console.error("Fatal: Unable to fetch submissions from Sanity:", error);
    throw new Error("Sanity fetch failed - aborting build to prevent public leakage.");
  }
}
