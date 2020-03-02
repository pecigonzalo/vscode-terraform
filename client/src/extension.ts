'use strict';

import * as path from 'path';
import { workspace, ExtensionContext, DocumentFilter } from 'vscode';
import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from 'vscode-languageclient';


const documentSelector: DocumentFilter = { language: "terraform", scheme: "file" };

export function activate(context: ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "vscode-terraform" is now active!');

    // context.subscriptions.push(
    //     vscode.languages.registerDocumentFormattingEditProvider(documentSelector, new DocumentFormattingEditProvider())
    // );

    // The server is implemented in node
    let serverModule = context.asAbsolutePath(path.join('server', 'server.js'));
    // The debug options for the server
    let debugOptions = { execArgv: ["--nolazy", "--debug=6009"] };

    // If the extension is launched in debug mode then the debug server options are used
    // Otherwise the run options are used
    let serverOptions: ServerOptions = {
        run: { module: serverModule, transport: TransportKind.ipc },
        debug: { module: serverModule, transport: TransportKind.ipc, options: debugOptions }
    };

    // Options to control the language client
    let clientOptions: LanguageClientOptions = {
        documentSelector: [{ scheme: 'file', language: 'terraform' }],
        synchronize: {
            configurationSection: 'terraformLanguageServer',
            fileEvents: workspace.createFileSystemWatcher('**/*.tf')
        }
    };

    // Create the language client and start the client.
    let disposable = new LanguageClient('terraformLanguageServer', 'Terraform Language Server', serverOptions, clientOptions).start();

    // Push the disposable to the context's subscriptions so that the
    // client can be deactivated on extension deactivation
    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
