import {
    IConnection,
    DocumentFormattingParams,
    TextEdit,
    TextDocuments,
    Range
} from "vscode-languageserver";
import {
    TextDocument
} from 'vscode-languageserver-textdocument';
import * as execa from "execa";
// import * as parse from "parse-diff";

export class DocumentFormattingProvider {

    async execCmd(
        formatTool: string,
        formatFlags: string[],
        cwd: string,
        document: TextDocument,
    ): Promise<execa.ExecaReturnValue> {
        const content = document.getText();
        try {
            return await execa(
                formatTool, formatFlags,
                {
                    localDir: cwd,
                    input: content,
                    stripFinalNewline: false,
                    timeout: 5000,
                }
            );
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    }

    async documentFormatting(params: DocumentFormattingParams, connection: IConnection, documents: TextDocuments<TextDocument>): Promise<TextEdit[]> {

        const formatTool = 'terraform'; // config['formatTool'] || 'terraform';
        const formatFlags = ["fmt", "-"]; // config['formatFlags'].slice() || [];

        const cwd = process.cwd();
        const document = documents.get(params.textDocument.uri);

        if (document) {
            try {
                const format = await this.execCmd(
                    formatTool,
                    formatFlags,
                    cwd,
                    document,
                );

                return [TextEdit.replace(
                    Range.create(
                        0, 0, Number.MAX_VALUE, Number.MAX_VALUE
                    ),
                    format.stdout,
                )];

            } catch (error) {
                connection.console.warn(error);
                return [];
            }

        } else {
            return [];
        }
    };
};
