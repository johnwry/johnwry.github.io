# Unified site migration

## What is live

- One Hugo site with dedicated visual systems for biblical studies and music.
- Full-text, accent-insensitive search across studies, books, posts, and song
  pages, including quoted phrases and Bible references such as `Romanos 8:1`.
- Search metadata for collection, historical dates, books, passages, tags,
  categories, themes, and language.
- Taxonomy pages for tags, categories, and themes.
- A music library with album/artist collections, native audio players,
  downloads, lyric pages, song metadata, and a reusable song template for
  lyrics and chords.
- Light/dark reading modes and a deliberately larger base type size.

## Preserved from `bible-study`

The complete meaningful source is stored in `archive/bible-study/` with a
SHA-256 manifest. The searchable `docs` collection is mounted into the live
site at `/legacy-bible-study/`. The two book projects are available as reading
pages, while all of their original downloads remain available under
`/legacy/it-is-settled/` and `/legacy/la-iglesia-carnal/`.

The old repository itself was not edited.

## Music content still to curate

The site can now represent every song with `artist`, `album`, `key`, `tempo`,
`audio`, `tags`, lyrics, and a chord sheet. The current source contains many
more recordings than complete lyric/chord sheets. Missing words or chords were
not invented; existing lyrics were preserved, and pages without chord metadata
show an honest “to be added” note. Use `hugo new --kind music music/song-name.md`
to create each remaining song record with the standard fields.

