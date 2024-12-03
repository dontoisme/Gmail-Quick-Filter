# Gmail Quick Filter Chrome Extension

## Overview

Gmail Quick Filter is a Chrome extension that enhances your Gmail experience by allowing you to quickly filter emails from a selected sender. With a single click or keyboard shortcut, you can view all emails from the sender of your currently selected email.

## Features

- Adds a "Quick Filter" button to the Gmail toolbar
- Provides a keyboard shortcut (Ctrl+Shift+F or Cmd+Shift+F on Mac) for quick filtering
- Works with both selected emails in the inbox and open emails
- Seamlessly integrates with Gmail's interface

## Installation

1. Clone this repository or download the source code.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" by toggling the switch in the top right corner.
4. Click "Load unpacked" and select the directory containing the extension files.

## Usage

1. In Gmail, select an email by clicking its checkbox or open an email.
2. Click the "Quick Filter" button in the Gmail toolbar, or use the keyboard shortcut (Ctrl+Shift+F or Cmd+Shift+F on Mac).
3. The extension will automatically filter your inbox to show all emails from the selected sender.

## Files

- `manifest.json`: Defines the extension's permissions and structure.
- `content.js`: Contains the main logic for the extension, including email selection and filtering.
- `background.js`: Handles the keyboard shortcut functionality.

## Development

To modify the extension:

1. Make changes to the relevant files (`content.js`, `background.js`, or `manifest.json`).
2. Go to `chrome://extensions/` in Chrome.
3. Click the refresh icon for the Gmail Quick Filter extension.
4. Reload your Gmail tab to see the changes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

