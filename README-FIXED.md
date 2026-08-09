# Amar Bari — Fixed Production Test Build

This build preserves the original page markup and original shared stylesheet, while extracting each page's inline CSS into the single `style.css`. Page-specific CSS is scoped by page class so rules from messages/details/post/etc. cannot overwrite each other.

Test all existing flows before deploying to production.
