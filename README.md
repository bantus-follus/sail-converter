# Urbit Sail Converter

Vibecoded VS Code extension that converts HTML to Hoon Sail syntax. No guarantees on perfection.

## Features

- Convert selected HTML text to Sail syntax
- Convert entire document if no text is selected
- Shortcut: `Ctrl+Alt+S` (`Cmd+Alt+S` on Mac)

## How to Use

1. Open an HTML file or create HTML content in any file
2. Select the HTML content you want to convert (or don't select anything to convert the entire document)
3. Press `Ctrl+Alt+S` (`Cmd+Alt+S` on Mac) or run the "Convert to Sail" command from the Command Palette

## Conversion Features

The converter supports:

- Basic HTML tags
- ID attributes using `#` notation
- Class attributes using `.` notation
- Image sources using `@` notation
- Links using `/` notation
- General attributes using parentheses
- Proper indentation for nested elements
- Self-closing tags
- Text content with `: ` or `; ` prefix

## Building and Installing

1. Clone this repository
2. Run `npm install` to install dependencies
3. Run `npm run compile` to build the extension
4. Install from vsix
5. Press F5 to launch a new VS Code window with the extension loaded

To package the extension:
```bash
npm run package
```

## Requirements

- VS Code 1.60.0 or higher

## Extension Settings

No additional settings are required.
