---
title: "Next JS 14: Enhance your forms using React Server Action"
description: "We're gonna give a summary of React Conference by Aurora Walberg Scharff about how to enhance your forms using React Server Actions in NextJS!"
category: ["typescript", "nextjs"]
pubDate: "2024-07-25"
published: true
---

This is gonna be a quick one, the idea is to give a summary of the conference of React 2024 going on right now, one in particular that caught my attention was the one done showcasing how to enhance your forms using React Server Action.

This is from React conference in 2024:

https://www.youtube.com/watch?v=X9cw4VczYVg

Here is the repo: https://github.com/aurorascharff/next14-message-box

Lets add for context, the schema:

```jsx
import { z } from "zod";

export const messageSchema = z.object({
  content: z.string().min(1, {
    message: "Content must be at least 1 characters long",
  }),
  createdById: z.string().uuid({
    message: "Invalid user ID",
  }),
});
```

This is a message box component rendered on the server which is just a normal component that does some data fetching:

```jsx
export default async function MessageBox() {
  const messages = await getMessages();
  const user = await getCurrentUser();

  return (
    <div className="flex w-full flex-col shadow-xl sm:w-[400px]">
      <div className="flex justify-between bg-slate-500 p-6">
        <h1 className="text-lg text-white">Messages</h1>
        <form action={resetMessages}>
          <SubmitButton>Reset</SubmitButton>
        </form>
      </div>
      <div className="grid border-x border-b border-gray-300">
        <AutomaticScroller className="grid h-80 content-start gap-4 overflow-auto border-b border-gray-300 p-4">
          {messages.length === 0 && (
            <span className="text-center text-gray-500">No messages</span>
          )}
          {messages.map((message) => {
            return (
              <MessageDisplay
                userId={user.id}
                key={message.id}
                message={message}
              />
            );
          })}
        </AutomaticScroller>
        <ErrorBoundary
          fallback={
            <p className="px-6 pb-8 pt-[58px] text-end">
              ⚠️Something went wrong
            </p>
          }
        >
          <MessageInput userId={user.id} />
        </ErrorBoundary>
      </div>
    </div>
  );
}
```

The magic happens inside the `MessageInput` component which gets rendered in the client and see the `useActionState`:

```jsx
"use client";

type Props = {
  userId: string,
};

export default function MessageInput({ userId }: Props) {
  const [state, submitMessageAction] = useActionState(submitMessage, {
    success: false,
  });

  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
    }
  }, [state.error, state.timestamp]);

  return (
    <>
      <form action={submitMessageAction} className="flex flex-col gap-2 p-6">
        <input
          autoComplete="off"
          defaultValue={state.content}
          required
          minLength={1}
          name="content"
          className="italic outline-none"
          placeholder="Type a message..."
        />
        <input type="hidden" name="userId" value={userId} />
        <SubmitButton>Send</SubmitButton>
      </form>
      {state.error && (
        <noscript className="px-6 pb-6 text-end text-red-600">
          {state.error}
        </noscript>
      )}
    </>
  );
}
```

Notice the `useActionState` hook we have now, it returns a state we initizialized inside the React Server Action `submitMessage` and returns an object with value equal to success which is what the RSA returns. The RSA called `submitMessage` , all it does is:

```jsx
type State = {
  success: boolean,
  error?: string,
  timestamp?: Date,
  content?: string,
};

export async function submitMessage(
  _prevState: State,
  formData: FormData
): Promise<State> {
  await slow();

  const timestamp = new Date();

  const result = messageSchema.safeParse({
    content: formData.get("content"),
    createdById: formData.get("userId"),
  });

  if (!result.success) {
    return {
      error: "Invalid message!",
      success: false,
      timestamp,
    };
  }

  const messages = await getMessages(result.data.createdById);

  if (messages.length > 10) {
    return {
      content: result.data.content,
      error: "Your message limit has been reached.",
      success: false,
      timestamp,
    };
  }

  await prisma.message.create({
    data: result.data,
  });

  revalidatePath("/");

  return {
    success: true,
  };
}
```

Inside the function that goes inside `useActionState` is where the whole asynchronous operation happens and this is a React Server Action which directly interacts with the DB and we reload the component with the revalidate from nextjs.

Oh, and here is a neat component to automatically scroll your site for you when you add something new, it might come in handy in the future!

```jsx
"use client";

import React, { useEffect, useRef } from "react";

type Props = {
  children: React.ReactNode,
  className?: string,
};

export default function AutomaticScroller({ children, className }: Props) {
  const ref = (useRef < null) | (HTMLDivElement > null);

  useEffect(() => {
    const mutationObserver = new MutationObserver(async () => {
      if (ref.current) {
        ref.current.scroll({
          behavior: "smooth",
          top: ref.current.scrollHeight,
        });
      }
    });

    if (ref.current) {
      mutationObserver.observe(ref.current, {
        childList: true,
      });

      return () => {
        mutationObserver.disconnect();
      };
    }
  }, [ref]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
```

When we send a message, the UI will update to pending state. The component that handles this is:

```jsx
"use client";

import React from "react";
import { useFormStatus } from "react-dom";
import Button from "./ui/Button";
import Spinner from "./ui/Spinner";

export default function SubmitButton({
  children,
  disabled,
  ...otherProps
}: React.HTMLProps<HTMLButtonElement>) {
  const { pending } = useFormStatus();

  return (
    <Button {...otherProps} disabled={pending || disabled} type="submit">
      {pending ? (
        <div className="flex items-center justify-center gap-2">
          {children}
          <Spinner />
        </div>
      ) : (
        children
      )}
    </Button>
  );
}
```

## Conclusion

For now we can see that React Server Actions are just the same as we would write in a Node application using an ORM, the beauty in my opinion is the `useActionState` hook that handles the state and errors for us without having to do it manually.

The React conference for 2024 is showing really good stuff for us! React Server Action has been an interesting topic as of late in the community, and while I don't particularly like Next JS, I love the concept of SSR because it makes the applications a lot better. And this will go very well for the next post which talks about an improvement in React Router that will kill Next JS.

See you on the next post.

Sincerely,

**Eng. Adrian Beria.**
