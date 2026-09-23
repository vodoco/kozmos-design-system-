---
"@kozmos-ds/react": patch
---

The ES build ships one file per module, so an app's bundler keeps only what it
imports. Importing `Button` alone cost an app 48.7 KB gzip of Kozmos code,
nearly the whole library, because the build was one file its bundler could not
trim; it now costs 1.1 KB, and the heaviest single component, POIDetailPanel,
6.2 KB. Import paths do not change, and `require()` still gets one UMD file.
