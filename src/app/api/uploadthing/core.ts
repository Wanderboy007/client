// app/api/uploadthing/core.ts
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  eventThumbnail: f({
    image: { maxFileSize: "2MB", maxFileCount: 1 }
  })
    .middleware(async ({ req }) => {
      // You can add authentication here if needed
      return {};
    })
    .onUploadComplete(({ file }) => {
      console.log("Thumbnail uploaded:", file.url);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;