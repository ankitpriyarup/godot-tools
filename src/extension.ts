import { ExtensionContext } from "vscode";
import GDScriptLanguageClient from "./lsp/GDScriptLanguageClient";
import * as path from "path";
import * as vscode from 'vscode'
import * as showDoc from './commands/showDoc'

let client: GDScriptLanguageClient = null;
const commandPrefix = "cmd"

export class DocContent {
	static docItems: vscode.QuickPickItem[] = []
	static builtIns = new Set()
	static dataDirectory

	constructor(dataPath : string) {
		DocContent.dataDirectory = path.join(dataPath, 'godot', 'doc')
		let indexLocation = path.join(dataPath, 'godot', 'doc', `index.json`)

		require('fs').readFile(indexLocation, 'utf8', function (err, data) {
			if (err) {
				throw err
			}

			var index = JSON.parse(data);
			for (let i = 0; i < index.size; i++) {
				DocContent.docItems.push({
					label: index.contents[i].label,
					description: index.contents[i].detail
				})
			}
			for (let i = 0; i < index.builtinSize; i++) {
				DocContent.builtIns.add(index.builtin[i])
			}
		});

	}
}

export function activate(context: ExtensionContext) {
	client = new GDScriptLanguageClient();
	context.subscriptions.push(client.start(), vscode.commands.registerCommand(`${commandPrefix}.${showDoc.id}`, showDoc.command));
}

export function deactivate(): Thenable<void> {
	if (client) {
		return client.stop();
	}
	return new Promise((resolve, reject) => {});
}
