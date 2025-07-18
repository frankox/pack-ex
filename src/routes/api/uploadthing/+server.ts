import { env } from "$env/dynamic/private";
import { ourFileRouter } from "$lib/server/uploadthing";
import { createRouteHandler } from "uploadthing/server";
import { error } from "@sveltejs/kit";

// Only create handlers if UploadThing is configured
if (!env.UPLOADTHING_TOKEN && env.STORAGE_PROVIDER === 'uploadthing') {
  throw error(500, 'UploadThing token required when STORAGE_PROVIDER is set to uploadthing');
}

const handlers = createRouteHandler({
  router: ourFileRouter,
  config: {
    token: env.UPLOADTHING_TOKEN || '',
  },
});

export { handlers as GET, handlers as POST };
