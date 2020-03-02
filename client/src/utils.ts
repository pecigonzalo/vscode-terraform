import vscode = require('vscode');
import path = require('path');
import cp = require('child_process');

export function killTree(processId: number): void {
    if (process.platform === 'win32') {
        const TASK_KILL = 'C:\\Windows\\System32\\taskkill.exe';

        // when killing a process in Windows its child processes are *not* killed but become root processes.
        // Therefore we use TASKKILL.EXE
        try {
            cp.execSync(`${TASK_KILL} /F /T /PID ${processId}`);
        } catch (err) {
            console.log('Error killing process tree: ' + err);
        }
    } else {
        // on linux and OS X we kill all direct and indirect child processes as well
        try {
            const cmd = path.join(__dirname, '../../../scripts/terminateProcess.sh');
            cp.spawnSync(cmd, [processId.toString()]);
        } catch (err) {
            console.log('Error killing process tree: ' + err);
        }
    }
}

export function getConfig(uri?: vscode.Uri): vscode.WorkspaceConfiguration {
    if (!uri) {
        if (vscode.window.activeTextEditor) {
            uri = vscode.window.activeTextEditor.document.uri;
        } else {
            uri = undefined;
        }
    }
    return vscode.workspace.getConfiguration('terraform', uri);
}
