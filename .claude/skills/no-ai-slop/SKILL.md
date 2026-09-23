---
name: no-ai-slop
description: >
  Remove AI writing patterns from prose. Use this skill when the user asks to clean up writing,
  remove AI tells, make text sound more human, de-slop content, reduce AI-sounding language,
  or review/edit prose for authenticity. Also trigger when the user says things like "this sounds
  like AI", "too robotic", "make it natural", "less generic", or "stop sounding like ChatGPT".
  Even casual requests like "clean this up" or "make this better" when applied to prose should
  trigger this skill.
---

# No AI Slop

AI prose has a fingerprint. This skill helps you find and remove the patterns that give it away. Read the reference files in `references/` for detailed phrase lists, structural patterns, and before/after examples.

## How to use this skill

When cleaning up text or writing new prose:

1. Read `references/phrases.md` for banned phrases and jargon
2. Read `references/structures.md` for structural patterns to avoid
3. Write or edit, applying the rules below
4. **Before delivering: re-read your entire output sentence by sentence** and run the checks in the Mandatory Re-Read Pass at the bottom of this file. This step is critical because you will produce AI patterns even after reading these rules.

## The One Rule That Matters Most: Let Sentences Flow

The single biggest AI tell is chopping connected ideas into separate short sentences. This pattern alone accounts for most of what makes AI prose feel generated. Everything else in this skill matters, but if you only internalize one rule, make it this one.

**What to catch:**

Binary contrasts split across two sentences:
- "The failure isn't about the product. It's about the market." → "The failure is about the market, not the product."
- "This isn't a technology problem. It's a people problem." → "This is a people problem, not a technology one."

Staccato sequences of short declarative sentences:
- "Collaboration deepens. Innovation accelerates. Culture shifts." → "Collaboration deepens and innovation accelerates."
- "Founders quit on themselves. The first year is lonely." → "Founders quit on themselves because the first year is lonely."

**Join vs. rephrase:** Not all staccato sequences should be mechanically joined with conjunctions. After joining, mentally score the result for fluency (1-5). If the joined version sounds like clauses stitched together with commas and "and" rather than a sentence a person would actually write, rephrase from scratch instead. Preserve the original meaning and intent, but reword freely.

- Score 4-5 (natural): keep the joined version. "Founders quit on themselves because the first year is lonely" flows well.
- Score 1-3 (awkward): rephrase entirely. "Cowork sessions were stateless, and Projects make them cumulative, the difference between a tool you use and one that learns how you work" scores low because it's three ideas glued together. Better: "Cowork sessions were stateless, but Projects remember what came before, turning a tool you use into one that learns how you work."

**Signs the join scored low:**
- More than one comma-separated clause with different subjects
- The joined sentence has no clear logical connective (cause, contrast, sequence) between parts
- It reads like a list of statements rather than one thought
- You had to use a weak conjunction like ", and" between ideas that aren't additive

Enumerated parallel sentences (a particularly stubborn pattern):
- "One cofounder wants to pivot. Another wants to cut costs. A third wants to bring in an investor." → "Cofounders split over direction, with one pushing to pivot, another to cut costs, and a third to bring in outside investment."
- "Some teams succeed. Others fail. Most land somewhere in between." → "Some teams succeed while others fail, though most land somewhere in between."

Short sentences used for manufactured drama:
- "We need quality." or "That's fine." or "Culture shifts." — these almost never need to stand alone.

**The fix:** First try joining with conjunctions (and, but, because, while, since, so, though, or). Then read the result aloud. If it flows naturally, keep it. If it sounds like clauses stapled together, rephrase from scratch while preserving the meaning. The goal is one flowing sentence that a person would actually write, not a mechanical splice of the originals. Real human writing connects thoughts. AI writing isolates them.

**Don't overcorrect.** Two or three clauses joined by a conjunction reads naturally. Four or more chained together with commas and "which" becomes a run-on. Aim for two connected ideas per sentence as the sweet spot.

## Other Core Rules

**Cut filler.** Remove throat-clearing openers ("Here's the thing:"), emphasis crutches ("Let that sink in."), adverbs (genuinely, fundamentally, simply), hedging phrases ("at its core", "it's worth noting"), and listicle transitions (Finally, Additionally, Moreover). See `references/phrases.md`.

**Name the actor.** "The decision was reached" hides who decided. "The culture shifts" pretends nobody acted. Write "the team decided" or "you decided." Every sentence needs a person doing something.

**Be concrete.** "The implications are significant" says nothing. Name the specific implication. Replace lazy extremes (every, always, never, everyone) with specifics.

**Replace jargon.** Navigate → handle. Lean into → accept. Landscape → situation. Double down → commit. Deep dive → close look. See `references/phrases.md` for the full list.

**No em dashes.** Replace every em dash with a comma, period, or by continuing the sentence naturally.

**No inline colons.** Colons should only appear before bullet-point or numbered lists. Never use a colon to introduce items inline within a sentence. "Three traits: discipline, timing, and feedback" should be "three traits like discipline, timing, and feedback" or "three traits including discipline, timing, and feedback" or restructured so the items flow naturally into the sentence. This also covers dramatic single-word reveals like "It comes down to one thing: trust."

**Vary rhythm.** Avoid three-item lists (use two items). Don't end paragraphs with punchy standalone declarations. Mix longer flowing sentences with shorter ones.

**Trust the reader.** Don't explain things twice, soften claims, or add "and that's okay." State facts and move on.

## Mandatory Re-Read Pass

After writing or editing, re-read every sentence and search for these patterns. Fix every one you find before delivering:

1. **Em dashes (—):** Find and replace every single one.
2. **Inline colons:** Any colon that isn't followed by a bullet-point or numbered list needs replacing. Use "like", "such as", "including", or restructure the sentence.
3. **Any pair of adjacent sentences both under ~10 words:** Join them with a conjunction. If the joined version sounds awkward (fluency score 1-3), rephrase entirely instead of forcing a splice.
4. **Any sentence starting with "It's"/"That's"/"This is" after a negative sentence:** Binary contrast, join into one sentence.
5. **Enumeration patterns** ("One X. Another Y. A third Z."): Combine into one sentence with commas and conjunctions.
6. **Banned jargon:** Search for lean into, lean on, landscape, navigate, double down, game-changer, move the needle, level up, deep dive, product-led growth.
7. **Paragraphs ending with a short punchy closer:** Rewrite or fold into the preceding sentence.
8. **Three-word declarative sentences:** Almost never needed. Join or cut.

## Scoring (optional)

Rate 1-10 on: Directness, Rhythm, Trust, Authenticity, Density. Below 35/50: revise.

## Attribution

Heavily modified from [stop-slop](https://github.com/hardikpandya/stop-slop) by [Hardik Pandya](https://hvpandya.com). MIT licensed.
