import { createUploadthing } from "uploadthing/server";
import type { FileRouter } from "uploadthing/server";
import { prisma } from "$lib/db";

const f = createUploadthing();

export const ourFileRouter = {
  fileUploader: f({
    "application/pdf": { maxFileSize: "16MB", maxFileCount: 1 },
    "application/zip": { maxFileSize: "64MB", maxFileCount: 1 },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { maxFileSize: "16MB", maxFileCount: 1 },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": { maxFileSize: "16MB", maxFileCount: 1 },
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": { maxFileSize: "16MB", maxFileCount: 1 },
    "application/msword": { maxFileSize: "16MB", maxFileCount: 1 },
    "application/vnd.ms-excel": { maxFileSize: "16MB", maxFileCount: 1 },
    "application/vnd.ms-powerpoint": { maxFileSize: "16MB", maxFileCount: 1 },
    "text/plain": { maxFileSize: "4MB", maxFileCount: 1 },
    "text/csv": { maxFileSize: "8MB", maxFileCount: 1 },
    image: { maxFileSize: "8MB", maxFileCount: 1 },
    video: { maxFileSize: "128MB", maxFileCount: 1 },
    audio: { maxFileSize: "32MB", maxFileCount: 1 },
    // Allow other file types as fallback
    blob: { maxFileSize: "64MB", maxFileCount: 1 }
  })
    .middleware(async ({ req, files }) => {
      console.log("Uploading files:", files.map(f => f.name));
      
      return { uploadedAt: new Date() };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete!");

      return { 
        uploadedFile: {
          name: file.name,
          size: file.size,
          url: file.url,
          key: file.key
        }
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
