import * as vscode from 'vscode';
import { convertToSail } from './htmlToSail';

// Export the converter function directly for testing
export { convertToSail };

export function activate(context: vscode.ExtensionContext) {
  console.log('Sail Converter is now active');
  // Show notification to confirm the extension is loaded
  vscode.window.showInformationMessage('Sail Converter extension is now active');

  let disposable = vscode.commands.registerCommand('sail-converter.convertToSail', () => {
    console.log('Convert to Sail command triggered');
    // Show notification when command is triggered
    vscode.window.showInformationMessage('Convert to Sail command triggered');
    
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      vscode.window.showErrorMessage('No active editor found');
      return;
    }

    const document = editor.document;
    const selection = editor.selection;
    
    // Get selected text or full document if no selection
    const text = selection.isEmpty 
      ? document.getText() 
      : document.getText(selection);

    try {
      const sailCode = convertToSail(text);
      
      // Replace selected text with converted Sail code
      editor.edit(editBuilder => {
        const range = selection.isEmpty 
          ? new vscode.Range(0, 0, document.lineCount, 0) 
          : selection;
        editBuilder.replace(range, sailCode);
      });
      
      vscode.window.showInformationMessage('HTML converted to Sail successfully');
    } catch (error) {
      let message = 'Failed to convert HTML to Sail';
      if (error instanceof Error) {
        message += `: ${error.message}`;
      }
      vscode.window.showErrorMessage(message);
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}