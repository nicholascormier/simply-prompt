import { z, Schema } from "zod";
import { stdin as input, stdout as output } from 'node:process';
import * as readline from 'node:readline/promises';
import { allColors } from "./types";
import type { Color, SchemaReturnType, SPInstance } from "./types";

const consoleInterface = readline.createInterface({ input, output });

export class SP implements SPInstance {

    public color: Color;
    private deliminator: string;
    private static initialized = false;

    private constructor(color: Color, deliminator: string) {
        SP.initialized = true;
        this.color = color;
        this.deliminator = deliminator;
    }

    static create(color: Color | undefined = undefined, deliminator: string | undefined = undefined) {
        if (SP.initialized) throw new Error("Prompt alread initialized.");
        if (!color) color = "WHITE"
        if (!deliminator) deliminator = ":"
        return new SP(color, deliminator);
    }

    public async getInput<T extends Schema>({ prompt, schema, color, transform }: { prompt: string; schema: T; color?: Color; transform?: (input: string) => SchemaReturnType<T> | undefined; } ): Promise<SchemaReturnType<T>> {
        let hex: Color = color ? color : this.color; 

        const formattedPrompt = `${prompt}${this.deliminator} `;
        let promptWithColor = resolveColor(hex, formattedPrompt);

        consoleInterface.resume();
        let input = await consoleInterface.question(promptWithColor);
        consoleInterface.pause()

        let parseInput: SchemaReturnType<T> | undefined = transform?.(input);

        const parsedInput = schema.safeParse(parseInput || input);

        if (!parsedInput.success) {
            throw new Error("Schema parsing error.");
        }

        return parsedInput.data;
    }

}

function resolveColor(color: Color, message: string) {
    // maybe add modifier fields for more effects from colors lib
    return allColors[color](message);
}

// add schema parsing
// add custom color api
// add recurvise prompt on invalid schema