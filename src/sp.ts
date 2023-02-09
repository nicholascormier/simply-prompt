import { Schema } from "zod";
import { stdin, stdout } from 'node:process';
import * as readline from 'node:readline/promises';
import { RawPrompt, AllColors, PromptOptions, OptionalPromptStyle } from "./types";
import type { Color, SchemaReturnType, SPInstance, BucketInput, BucketResponse } from "./types";

const consoleInterface = readline.createInterface({ input: stdin, output: stdout });

export class SP implements SPInstance {

    private color: Color;
    private delimiter: string;
    private static initialized = false;

    private constructor(options: Required<OptionalPromptStyle>) {
        const { color, delimiter } = options;
        this.color = color;
        this.delimiter = delimiter;
        SP.initialized = true;
    }

    private _resolveColor(color: Color, message: string) {
        return AllColors[color](message)
    }

    private async _getInputFromTerminal(input: RawPrompt) {
        const prepared = this._preparePrompt(input)
        consoleInterface.resume();
        const response = await consoleInterface.question(prepared);
        consoleInterface.pause();
        return response;
    }
    
    private _preparePrompt({ color, delimiter, message }: RawPrompt) {
        const c = color || this.color;
        const d = delimiter || this.delimiter;

        const msg = `${message}${d}`;
        const resolvedMessage = this._resolveColor(c, msg);

        return resolvedMessage;
    }

    static create(options?: OptionalPromptStyle) {
        if (SP.initialized) throw new Error("Prompt alread initialized.");
        const color = options?.color ? options?.color : "WHITE";
        const delimiter = options?.delimiter ? options?.delimiter : ":";
        return new SP({ color, delimiter });
    }

    public async prompt<T extends Schema>(
        { message, schema, color, delimiter, transform }:
        PromptOptions<T>
    ): Promise<SchemaReturnType<T>> {

        const userInput = await this._getInputFromTerminal({ message, color, delimiter });

        const transformed: SchemaReturnType<T> | undefined = transform?.(userInput);
        const parsedInput = schema.safeParse(transformed || userInput);

        if (!parsedInput.success) {
            throw new Error("Schema parsing error.");
        }

        return parsedInput.data;
        
    }

    public async promptBucket<T extends BucketInput>(input: T): Promise<BucketResponse<T>> {
        
        let returnVal: any = {};

        for (let key in input) {
            const current = input[key];
            const currentInput = await this._getInputFromTerminal(current);
            returnVal[key] = currentInput;
        }
    
        return returnVal;

    }

    public setNewDefaults(options: OptionalPromptStyle): void {
        const { color, delimiter } = options;
        if (color) this.color = color;
        if (delimiter) this.delimiter = delimiter;
    }

}

// add recurvise prompt on invalid schema