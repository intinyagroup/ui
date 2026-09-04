---
title: Comment
description: Comment thread with add, like, and delete actions, author avatars, and a composer.
---

# Comment

A comment thread with an inline composer. Comments render with avatar, author, timestamp, likes, and per-comment actions. Deleting is restricted to the current user.

## Usage

```svelte
<script>
  import { CommentSection } from '@intinyagroup/ui';

  let comments = $state([
    { id: 1, author: 'Ada', text: 'First!', time: '2m', likes: 3 },
    { id: 2, author: 'Grace', text: 'Nice work.', time: '1h', likes: 1 }
  ]);

  function addComment(text) {
    comments = [...comments, { id: Date.now(), author: 'You', text, time: 'now' }];
  }

  function likeComment(id) {
    comments = comments.map((c) =>
      c.id === id ? { ...c, likes: (c.likes ?? 0) + 1 } : c
    );
  }

  function deleteComment(id) {
    comments = comments.filter((c) => c.id !== id);
  }
</script>

<CommentSection
  {comments}
  currentUser="You"
  onAddComment={addComment}
  onLike={likeComment}
  onDelete={deleteComment}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `comments` | `CommentItem[]` | — | List of comments to render |
| `onAddComment` | `(text: string) => void` | — | Called with the composer text when submitted |
| `onLike` | `(id: string \| number) => void` | — | Called when a comment is liked |
| `onDelete` | `(id: string \| number) => void` | — | Called when a comment is deleted |
| `currentUser` | `string` | — | Author name used to show delete controls |
| `placeholder` | `string` | `'Add a comment…'` | Composer placeholder |
| `class` | `string` | — | Additional CSS classes |
| `commentClass` | `string` | — | Additional CSS classes per comment |
| `children` | `Snippet` | — | Extra content below the thread |

### CommentItem

```ts
{
  id: string | number;
  author: string;
  avatar?: string;
  text: string;
  time: string;
  likes?: number;
}
```

## Features

- Composer with submit handling; empty drafts are ignored.
- Like and delete callbacks per comment.
- Delete controls only for the current user's comments.
- Optional avatar image per comment.