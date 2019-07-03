import { ExtensionContext } from "vscode";
import GDScriptLanguageClient from "./lsp/GDScriptLanguageClient";
import * as path from "path";
import * as vscode from 'vscode'
import * as showDoc from './commands/showDoc'

let client: GDScriptLanguageClient = null;
const commandPrefix = "cmd"

export class DocContent {
	static docItems: vscode.QuickPickItem[] = [];

	constructor() {
		let indexLocation = path.join(vscode.workspace.getConfiguration("godot_tools").get("data_directory"), 'documentation', `index.json`)
		var index = require(indexLocation)

		for (let i = 0; i < index.size; i++) {
			DocContent.docItems.push({
				label: index.contents[i].label,
				description: index.contents[i].detail
			})
		}
	}
}

export function activate(context: ExtensionContext) {
	new DocContent();
	client = new GDScriptLanguageClient();
	context.subscriptions.push(client.start(), vscode.commands.registerCommand(`${commandPrefix}.${showDoc.id}`, showDoc.command));
}

export function deactivate(): Thenable<void> {
	if (client) {
		return client.stop();
	}
	return new Promise((resolve, reject) => {});
}
