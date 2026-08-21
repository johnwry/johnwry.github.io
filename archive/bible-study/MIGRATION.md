# Bible-study preservation archive

This directory preserves the meaningful source material from the retired
`bible-study` repository. The original repository was not modified.

Preserved here:

- all authored content, manuscripts, study notes, images, recordings, PDFs,
  presentations, ebooks, and working documents;
- the old Hugo configuration, layouts, assets, data, package metadata, and
  deployment workflow;
- the root README and `romanos1-8.notas` file.

Excluded because they are reproducible or machine-specific:

- `.git/` history (the original repository remains intact);
- `node_modules/`;
- generated `public/` and Hugo resource caches;
- `.DS_Store` files.

`SHA256SUMS` records the checksum of every imported source file (excluding this migration note and the checksum file itself). The unified Hugo
site mounts the old `docs` collection as the searchable
`legacy-bible-study` section and exposes the two book projects under
`/legacy/` for downloads.

