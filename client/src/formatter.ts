import vscode = require('vscode');
import path = require('path');
import cp = require('child_process');
import { getConfig, killTree } from './utils';


export class DocumentFormattingEditProvider implements vscode.DocumentFormattingEditProvider {
    public provideDocumentFormattingEdits(
        document: vscode.TextDocument,
        options: vscode.FormattingOptions,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.TextEdit[]> {

        const config = getConfig(document.uri);
        const formatTool = config['formatTool'] || 'terraform';
        const formatFlags = ["fmt", "-diff", "-"]; // config['formatFlags'].slice() || [];

        return this.runFormatter(formatTool, formatFlags, document, token).then(
            (edits) => edits,
            (err) => {
                if (err) {
                    console.log(err);
                    return Promise.reject('Check the console in dev tools to find errors when formatting.');
                }
            }
        );
    }

    private runFormatter(
        formatTool: string,
        formatFlags: string[],
        document: vscode.TextDocument,
        token: vscode.CancellationToken
    ): Thenable<vscode.TextEdit[]> {

        return new Promise<vscode.TextEdit[]>((resolve, reject) => {


            const t0 = Date.now();
            const cwd = path.dirname(document.fileName);
            let stdout = '';
            let stderr = '';

            // Use spawn instead of exec to avoid maxBufferExceeded error
            const p = cp.spawn(
                formatTool, formatFlags, { cwd }
            );
            token.onCancellationRequested(() => !p.killed && killTree(p.pid));

            p.stdout.setEncoding('utf8');
            p.stdout.on('data', (data) => (stdout += data));
            p.stderr.on('data', (data) => (stderr += data));

            p.stdin.setDefaultEncoding('utf8');
            p.stdin.write(document.getText());

            p.on('error', (err) => {
                if (err && (<any>err).code === 'ENOENT') {
                    return reject();
                }
            });
            p.on('close', (code) => {
                if (code !== 0) {
                    return reject(stderr);
                }

                // Return the complete file content in the edit.
                // VS Code will calculate minimal edits to be applied
                const fileStart = new vscode.Position(0, 0);
                const fileEnd = document.lineAt(document.lineCount - 1).range.end;
                const textEdits: vscode.TextEdit[] = [
                    new vscode.TextEdit(new vscode.Range(fileStart, fileEnd), stdout)
                ];

                const timeTaken = Date.now() - t0;
                if (timeTaken > 750) {
                    console.log(`Formatting took too long(${timeTaken}ms). Format On Save feature could be aborted.`);
                }
                return resolve(textEdits);
            });
            if (p.pid) {
                p.stdin.end(document.getText());
            }
        });
    }
}
