# Scripts

This directory contains utility scripts that are separate from the core `met-hub` application.

## Legacy Import Script (`import.js`)

> [!WARNING]
> This script is dead/legacy code. It contains several bugs and strict mode violations. It should not be used in its current form.

### Known Issues
- **Deprecated APIs**: Uses `String.prototype.substr()`, which is deprecated.
- **Strict Mode Violations**: Assigns variables (`queryText`, `res`, `data`) without `let` or `const`, creating implicit globals.
- **Security Vulnerabilities**: Contains a hardcoded PostgreSQL password.
- **Environment Mismatch**: References a machine-specific path (`/home/zaloha/.k/data2/`).
- **Control Flow Bug**: Silently exits after processing the first matched file due to a `return` statement inside the `fs.readdir` callback.
