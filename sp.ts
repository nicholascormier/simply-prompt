import { z, Schema } from "zod";
import { stdin as input, stdout as output } from 'node:process';
import * as readline from 'node:readline/promises';
import colors from "colors";

const consoleInterface = readline.createInterface({ input, output });

const allColors = {
    "WHITE": colors.white,
    "GREEN": colors.green,
    "BLUE": colors.blue,
    "YELLOW": colors.yellow,
    "CYAN": colors.cyan,
    "RED": colors.red,
    "MAGENTA": colors.magenta,
    "GREY": colors.grey
} as const;

type Color = keyof typeof allColors;

type InputProperties = {
    prompt: string;
    schema: Schema;
    color?: Color;
    transform?: (input: string) => string;
}

type SchemaReturn<T extends Schema> = z.infer<T>;

type TSP = {
    color: string;
    getInput<T extends Schema>(
        { prompt, schema, color, transform }:
        { prompt: string; schema: T; color?: Color; transform?: (input: string) => T; }
    ): SchemaReturn<T>;
}

export class SP implements TSP {

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

    public async getInput<T extends Schema>({ prompt, schema, color, transform }: { prompt: string; schema: T; color?: Color; transform?: (input: string) => SchemaReturn<T> | undefined; } ): Promise<SchemaReturn<T>> {
        let hex: Color = color ? color : this.color; 

        const formattedPrompt = `${prompt}${this.deliminator} `;
        let promptWithColor = resolveColor(hex, formattedPrompt);

        consoleInterface.resume();
        let input = await consoleInterface.question(promptWithColor);
        consoleInterface.pause()

        let parseInput: SchemaReturn<T> | undefined = transform?.(input);

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

(async () => {
    
    const prompt = SP.create();
    const fname = await prompt.getInput({
        prompt: "First name",
        schema: z.string(),
        color: "CYAN"
    });

    const lname = await prompt.getInput({
        prompt: "Last name",
        schema: z.string()
    });

    const is21 = await prompt.getInput({
        prompt: "Are you at least 21?",
        schema: z.coerce.boolean(),
        transform: (input) => {
            input = input.toLowerCase();
            if (input == "y" || input == "yes") {
                return true 
            } else if (input == "n" || input == "no") {
                return false
            }
        } 
    });


    console.log(fname, lname, is21);



})()