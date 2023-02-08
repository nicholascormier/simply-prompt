import { Schema } from "zod";
import { stdin, stdout } from 'node:process';
import * as readline from 'node:readline/promises';
import { InputOptions, RawPrompt, AllColors, PromptType, PromptTypes, OptionalPrompt } from "./types";
import type { Color, SchemaReturnType, SPInstance, BucketInput, BucketResponse } from "./types";

const consoleInterface = readline.createInterface({ input: stdin, output: stdout });

export class SP implements SPInstance {

    private color: Color;
    private deliminator: string;
    private static initialized = false;

    private constructor(options: Required<OptionalPrompt>) {
        const { color, deliminator } = options;
        this.color = color;
        this.deliminator = deliminator;
        SP.initialized = true;
    }

    private _resolveColor(color: Color, message: string) {
        return AllColors[color](message)
    }

    private _resolveSchema(type: PromptType) {
        return PromptTypes[type];
    }

    private async _getInputFromTerminal(input: RawPrompt) {
        const prepared = this._preparePrompt(input)
        consoleInterface.resume();
        const response = await consoleInterface.question(prepared);
        consoleInterface.pause();
        return response;
    }
    
    private _preparePrompt({ color, deliminator, message }: RawPrompt) {
        const c = color || this.color;
        const d = deliminator || this.deliminator;

        const msg = `${message}${d}`;
        const resolvedMessage = this._resolveColor(c, msg);

        return resolvedMessage;
    }

    static create(options?: OptionalPrompt) {
        if (SP.initialized) throw new Error("Prompt alread initialized.");
        const color = options?.color ? options?.color : "WHITE";
        const deliminator = options?.deliminator ? options?.deliminator : ":";
        return new SP({ color, deliminator });
    }

    public async prompt<T extends Schema>(
        { message, type, color, deliminator, transform }:
        InputOptions<T>
    ): Promise<SchemaReturnType<T>> {

        const schema = this._resolveSchema(type);
        const userInput = await this._getInputFromTerminal({ message, color, deliminator });

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

}

// add recurvise prompt on invalid schema