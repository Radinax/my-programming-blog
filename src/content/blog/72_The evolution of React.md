---
title: "The evolution of React JS: React Router V7 and SSR done right"
description: "We're gonna give a summary of React Conference by Ryan Florence about React Router V7 and how it implements SSR, SSG and CSR all in one!"
category: ["typescript", "reactjs"]
pubDate: "2024-07-26"
published: false
---

This is gonna be a quick one, the idea is to give a summary of the conference of React 2024 going on right now, one in particular that caught my attention was the one done showcasing how to enhance your forms using React Server Action.

This is from React conference in 2024:

https://www.youtube.com/watch?v=X9cw4VczYVg

Here is the repo: https://github.com/aurorascharff/next14-message-box

For starters, let's check how we define routes now:

```javascript
import { defineConfig } from "vite";
import { vitePlugin as react } from "@react-router/dev";
import inspect from "vite-plugin-inspect";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      appDirectory: "src",
      ssr: false,
      future: {
        unstable_singleFetch: true,
      },
      routes(defineRoutes) {
        return defineRoutes((route) => {
          route("", "containers/Home.tsx", { index: true });
          route("/login", "containers/Login.tsx");
          route("/signup", "containers/Signup.tsx");
          route("/settings", "containers/Settings.tsx");
          route("/notes/new", "containers/NewNote.tsx");
          route("/notes/:id", "containers/Notes.tsx");
          route("*", "Routes.tsx");
        });
      },
    }),
    inspect(),
  ],
});
```

## Conclusion

See you on the next post.

Sincerely,

**Eng. Adrian Beria.**
