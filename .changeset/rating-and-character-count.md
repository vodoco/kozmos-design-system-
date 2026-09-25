---
"@kozmos-ds/react": minor
---

A thumbs scale, a character count, and the state `Rating` was actually in.

**`Rating` takes a `variant`.** `thumbs` is the two-option form the Express
Maps prompt asks on — "Are you enjoying this?" is a yes or a no, not a mark
out of five. Stars are an ordinal scale, so choosing four fills four; thumbs
are a choice between two, so exactly the one chosen fills. The value stays a
number either way — **0 unanswered, 1 down, 2 up** — so a product stores one
shape whichever scale it asks on, and choosing what is already chosen clears
it. On all three platforms.

**And four things that were wrong with it underneath.** Measured in a browser
rather than read off the source:

- `aria-checked` was taken from the _hover_ value, so a pointer passing over
  the fifth star made a screen reader announce five when the answer was three.
- There were **five tab stops**. A radiogroup is one, with the arrows moving
  inside it. There were no arrow keys at all, so a keyboard visitor could
  reach the scale and not use it. Left and right now follow the writing
  direction, so the first option is still first in Arabic.
- `readOnly` set `disabled` on every option, which drops the whole rating out
  of the tab order: a rating meant only to be read could not be reached. It is
  one `role="img"` with the rating as its label.
- `"Rating"` and `"Rate 3 out of 5 stars"` were fixed English — and the second
  says "stars" whatever the scale is. `label`, `itemLabel` and `valueLabel`
  are the caller's now.

On iOS every option was an `Image` with `.onTapGesture`: VoiceOver could not
activate it and announced nothing, so the rating existed only for people using
their eyes and a finger. On Compose every star carried
`contentDescription = null` and a bare `clickable`, with the same result for
TalkBack. Both are real controls now, with `Role.RadioButton` on Compose.

**Android's star was a different colour.** `primitivesColorsEmotionalAlert600`
— #f9a707 against iOS's and the web's #d97706, and #fbc459 against #fbbf24 in
dark mode. It reads `semanticsDataYellow` now, like the other two.

**`Input` and `Textarea` take a `count`.** `limit` is a **soft** maximum,
deliberately not `maxLength`: a browser refuses the keystroke past
`maxLength`, so someone pasting a long answer loses the end of it in silence
instead of being told it is too long. `minimum` only applies once something
has been typed — an empty field is unanswered, not wrong. The count is never
in the `role="alert"` element while it is only a count, because it changes on
every keystroke and a screen reader would read the number back after each
letter; it joins the message there only when there is a reason to speak. It
counts what a person sees rather than UTF-16 units, so an emoji is one
character.

**`FeedbackCard` passes both through**, and loses three things of its own: the
success mark was `bg-green-100` / `dark:bg-green-900/30`, which compile to a
fixed `rgb(220 252 231)` — a product that re-themed Kozmos got Tailwind green
there and nowhere else — and the mark itself was the emoji 🎉, which a screen
reader reads as "party popper". It takes the success role and a real icon.
`submitLabel`, `submittingLabel` and `commentPlaceholder` were fixed English
inside the component; the card's heading level is the caller's.
