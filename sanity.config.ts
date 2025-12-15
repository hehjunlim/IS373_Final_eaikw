import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";

const projectId = "817a8pxv";
const dataset = "production";

export default defineConfig({
  name: "default",
  title: "Design Gallery CMS",

  projectId,
  dataset,

  plugins: [structureTool(), visionTool()],

  schema: {
    types: [
      // Document types
      {
        type: "document",
        name: "designStyle",
        title: "Design Style",
        fields: [
          {
            name: "title",
            title: "Title",
            type: "string",
            validation: (Rule) => Rule.required(),
          },
          {
            name: "slug",
            title: "Slug",
            type: "slug",
            options: { source: "title" },
            validation: (Rule) => Rule.required(),
          },
          {
            name: "description",
            title: "Description",
            type: "text",
          },
          {
            name: "historicalBackground",
            title: "Historical Background",
            type: "array",
            of: [{ type: "block" }],
          },
          {
            name: "colorPalette",
            title: "Color Palette",
            type: "object",
            fields: [
              {
                name: "colors",
                title: "Colors",
                type: "array",
                of: [
                  {
                    type: "object",
                    fields: [
                      { name: "name", title: "Name", type: "string" },
                      { name: "hex", title: "Hex Value", type: "string" },
                      { name: "usage", title: "Usage", type: "string" },
                    ],
                  },
                ],
              },
            ],
          },
          {
            name: "typographyGuidance",
            title: "Typography Guidance",
            type: "array",
            of: [{ type: "block" }],
          },
          {
            name: "sampleImages",
            title: "Sample Images",
            type: "array",
            of: [
              {
                type: "object",
                fields: [
                  { name: "image", title: "Image", type: "image", options: { hotspot: true } },
                  { name: "caption", title: "Caption", type: "string" },
                ],
              },
            ],
          },
          {
            name: "gallerySubmissions",
            title: "Gallery Submissions",
            type: "array",
            of: [{ type: "reference", to: [{ type: "gallerySubmission" }] }],
          },
        ],
      },
      {
        type: "document",
        name: "gallerySubmission",
        title: "Gallery Submission",
        fields: [
          {
            name: "submitterName",
            title: "Submitter Name",
            type: "string",
            validation: (Rule) => Rule.required(),
          },
          {
            name: "submitterEmail",
            title: "Submitter Email",
            type: "string",
            validation: (Rule) => Rule.required(),
          },
          {
            name: "url",
            title: "Project URL",
            type: "url",
            validation: (Rule) => Rule.required(),
          },
          {
            name: "screenshot",
            title: "Screenshot",
            type: "image",
            options: { hotspot: true },
          },
          {
            name: "designStyle",
            title: "Design Style Reference",
            type: "reference",
            to: [{ type: "designStyle" }],
          },
          {
            name: "description",
            title: "Description",
            type: "text",
          },
          {
            name: "status",
            title: "Status",
            type: "string",
            options: {
              list: [
                { title: "Submitted", value: "submitted" },
                { title: "Under Review", value: "under-review" },
                { title: "Approved", value: "approved" },
                { title: "Changes Requested", value: "changes-requested" },
                { title: "Rejected", value: "rejected" },
              ],
            },
            initialValue: "submitted",
          },
          {
            name: "submittedAt",
            title: "Submitted At",
            type: "datetime",
            initialValue: () => new Date().toISOString(),
          },
          {
            name: "reviewNotes",
            title: "Review Notes",
            type: "text",
          },
          {
            name: "reviewedAt",
            title: "Reviewed At",
            type: "datetime",
          },
          {
            name: "reviewedBy",
            title: "Reviewed By",
            type: "reference",
            to: [{ type: "author" }],
          },
        ],
      },
      {
        type: "document",
        name: "article",
        title: "Article",
        fields: [
          {
            name: "title",
            title: "Title",
            type: "string",
            validation: (Rule) => Rule.required(),
          },
          {
            name: "slug",
            title: "Slug",
            type: "slug",
            options: { source: "title" },
            validation: (Rule) => Rule.required(),
          },
          {
            name: "description",
            title: "Description",
            type: "text",
          },
          {
            name: "author",
            title: "Author",
            type: "reference",
            to: [{ type: "author" }],
            validation: (Rule) => Rule.required(),
          },
          {
            name: "publishedAt",
            title: "Published At",
            type: "datetime",
            initialValue: () => new Date().toISOString(),
          },
          {
            name: "body",
            title: "Body",
            type: "array",
            of: [{ type: "block" }],
          },
          {
            name: "coverImage",
            title: "Cover Image",
            type: "image",
            options: { hotspot: true },
          },
          {
            name: "tags",
            title: "Tags",
            type: "array",
            of: [{ type: "string" }],
          },
        ],
      },
      {
        type: "document",
        name: "author",
        title: "Author",
        fields: [
          {
            name: "name",
            title: "Name",
            type: "string",
            validation: (Rule) => Rule.required(),
          },
          {
            name: "slug",
            title: "Slug",
            type: "slug",
            options: { source: "name" },
          },
          {
            name: "bio",
            title: "Bio",
            type: "text",
          },
          {
            name: "image",
            title: "Image",
            type: "image",
            options: { hotspot: true },
          },
          {
            name: "email",
            title: "Email",
            type: "string",
          },
          {
            name: "url",
            title: "Website URL",
            type: "url",
          },
        ],
      },
    ],
  },
});
