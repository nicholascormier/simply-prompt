import { z, Schema } from "zod";
import colors from "colors";

export const allColors = {
    "WHITE": colors.white,
    "GREEN": colors.green,
    "BLUE": colors.blue,
    "YELLOW": colors.yellow,
    "CYAN": colors.cyan,
    "RED": colors.red,
    "MAGENTA": colors.magenta,
    "GREY": colors.grey
} as const;

export type Color = keyof typeof allColors;

export type SchemaReturnType<T extends Schema> = z.infer<T>;

export type SPInstance = {
    color: string;
    getInput<T extends Schema>(
        { prompt, schema, color, transform }:
        { prompt: string; schema: T; color?: Color; transform?: (input: string) => T; }
    ): SchemaReturn<T>;
}