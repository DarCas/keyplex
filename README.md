# KeyPlex

![NPM Last Update](https://img.shields.io/npm/last-update/%40darcas%2Fkeyplex)
![NPM Version](https://img.shields.io/npm/v/%40darcas%2Fkeyplex)
![NPM Downloads](https://img.shields.io/npm/dy/%40darcas%2Fkeyplex)
![NPM License](https://img.shields.io/npm/l/%40darcas%2Fkeyplex)

**KeyPlex** is a versatile and modular library for managing namespaced key-value storage. It provides an abstract class that can be extended to create custom storage solutions, as well as concrete implementations for `localStorage` and `sessionStorage`.

## Features

- **Namespace Support**: Automatically scopes keys using a customizable namespace (default is derived from the current domain).
- **Extensibility**: Easily create custom storage backends by extending the `KeyPlex` abstract class.
- **Convenient API**: Simplified methods for getting, setting, deleting, and checking keys.

## Installation

```bash
npm install @darcas/keyplex
```

Or, if you're using yarn:

```bash
yarn add @darcas/keyplex
```

## Usage

### Using `LocalPlex` and `SessionPlex`

KeyPlex includes two built-in implementations:

- **`LocalPlex`**: Uses `localStorage` as the backend.
- **`SessionPlex`**: Uses `sessionStorage` as the backend.

Example:

```typescript
import { LocalPlex, SessionPlex } from '@darcas/keyplex';

// Initialize a LocalPlex instance
const localStore = new LocalPlex('myNamespace');

// Set a value
localStore.set('key', { name: 'KeyPlex' });

// Get a value
const value = localStore.get('key');
console.log(value); // Output: { name: 'KeyPlex' }

// Check if a key exists
if (localStore.has('key')) {
  console.log('Key exists!');
}

// Delete a key
localStore.del('key');

// Initialize a SessionPlex instance
const sessionStore = new SessionPlex('sessionNamespace');
sessionStore.set('sessionKey', 'Session Data');
```

### Deleting with Wildcard (`%`)

In `KeyPlex`, when you want to delete multiple keys at once, you can use the `%` wildcard at the end of the key name. This allows you to match all keys that **start** with the same prefix, making it easier to clean up related entries.

#### How It Works:

- If the key you're deleting ends with a `%`, the library will match all keys that **start** with the same prefix (before the `%` symbol).
- The `%` wildcard acts like a "glob" or "pattern matching" character, allowing for batch deletion of keys that follow a similar naming convention.

#### Example:

```typescript
// Initialize a LocalPlex or SessionPlex instance
const localStore = new LocalPlex('myNamespace');

// Set some keys
localStore.set('user/123/profile', { name: 'John Doe' });
localStore.set('user/123/settings', { theme: 'dark' });
localStore.set('user/124/profile', { name: 'Jane Doe' });

// Delete all keys related to user 123
localStore.del('user/123%');

// After deletion, only user/124 keys will remain in the storage
```

In this case, the `localStore.del('user/123%')` call will remove the following keys:

- `user/123/profile`
- `user/123/settings`

This is useful when you have a group of related keys (e.g., user data) and want to delete them in bulk without needing to manually list all keys.

#### Important Notes:

- The wildcard `%` only works at the **end** of the key name.
- It does not support complex patterns or regular expressions, so only keys that start with the specified prefix will be matched.
- Wildcard deletion is recursive, meaning that it will apply to all keys with matching prefixes, so use it carefully to avoid unintended deletions.

### Extending `KeyPlex`

To create a custom storage backend, extend the `KeyPlex` class and implement the required methods:

1. **`keys`**: Return all keys in the storage.
2. **`getItem`**: Retrieve a value by its key.
3. **`setItem`**: Store a value by its key.
4. **`removeItem`**: Remove a value by its key.

Example:

```typescript
import { KeyPlex } from '@darcas/keyplex';

class CustomStorage extends KeyPlex {
  private store: Record<string, string> = {};

  keys(): string[] {
    return Object.keys(this.store);
  }

  protected getItem(key: string): string | null {
    return this.store[key] || null;
  }

  protected setItem(key: string, value: string): void {
    this.store[key] = value;
  }

  protected removeItem(key: string): void {
    delete this.store[key];
  }
}

// Usage
const customStore = new CustomStorage('customNamespace');
customStore.set('customKey', 'Custom Value');
console.log(customStore.get('customKey')); // Output: 'Custom Value'
```

## API Reference

### `KeyPlex` Methods

- **`get<T = unknown>(key: string, def: T | null = null): T`**
  Retrieves the value associated with the key, or returns the default value if the key does not exist.

- **`set<T = unknown>(key: string, value: T): void`**
  Stores the value under the specified key.

- **`del(key: string): void`**
  Deletes the value associated with the key. Supports pattern deletion using a `%` wildcard.

- **`has(key: string): boolean`**
  Checks whether a key exists in the storage.

- **`keys(): string[]` (Abstract)**  
  Returns all keys in the storage.

## Contributing

If you'd like to contribute to the project, feel free to fork it and create a pull request. Please ensure that your changes are well-tested and properly documented.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Made with ❤️ by [Dario Casertano (DarCas)](https://github.com/DarCas).
