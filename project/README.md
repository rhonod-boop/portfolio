# project/

One screenshot per project goes in here, plus the project's name and description.

```
project/mod-queue.png
project/tag-bot.png
```

Then add an entry to the `PROJECTS` list in `index.html` (search for `const PROJECTS`):

```js
const PROJECTS = [
  { name: 'Mod queue',
    desc: 'Discord bot that queues reports and DMs the mod team when a raid starts.',
    shot: 'project/mod-queue.png',
    href: 'https://example.com' },
];
```

- `name` — what it's called.
- `desc` — one or two lines: what it does and who it was for.
- `shot` — optional file in this folder. Missing image is fine, the card just shows the text.
- `href` — optional link, opens in a new tab. Leave it out for private work.

As soon as the list isn't empty, the cards replace the "No projects yet." panel on the
Work section. Screenshots crop to 16:10, so 1600×1000 PNG or JPG looks best.
