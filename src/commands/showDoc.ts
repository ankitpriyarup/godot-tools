import * as vscode from 'vscode'
import * as path from "path";
import * as parser from "../parser"
import * as extension from "../extension"

export const id = "showDoc"
export function command() {
    let symbolName = vscode.window.activeTextEditor ? scanDocument(vscode.window.activeTextEditor) : null

    if (symbolName == null || extension.DocContent.docItems.length == 0) {
        vscode.window.showQuickPick(extension.DocContent.docItems).then(selection => {
            if (!selection) {
                return;
            }

            findDoc(selection.label)
        });
    } else if (vscode.window.activeTextEditor &&
        vscode.window.activeTextEditor.document &&
        (
            vscode.window.activeTextEditor.document.languageId === 'gdscript'
        )) {
        findDoc(symbolName)
    }
}

function scanDocument(textEditor: vscode.TextEditor) {
    const textDocument = textEditor.document

    let pos = textEditor.selection.start
    let line = textDocument.lineAt(pos.line)
    const symbolName = parser.parse(line.text, pos.character)

    if (symbolName) return symbolName
    return null
}

function findDoc(symbolName: string, textEditor?: vscode.TextEditor) {
    textEditor = textEditor || vscode.window.activeTextEditor

    if (!textEditor.document) {
        throw new Error('No open document')
    }

    if (vscode.workspace.getConfiguration("godot_tools").get("data_directory")) {
        let docLocation = vscode.Uri.file(path.join(vscode.workspace.getConfiguration("godot_tools").get("data_directory"), 'documentation', `README.md`))
        return vscode.commands.executeCommand('markdown.showPreviewToSide', docLocation)
    }
    else {
        throw new Error('Not able to fecth document directory')
    }
}