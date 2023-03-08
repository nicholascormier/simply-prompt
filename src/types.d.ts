import { z, Schema } from "zod";
import colors from "colors";
import { SP } from "./sp";

export const AllColors = {
    "WHITE": colors.white,
    "GREEN": colors.green,
    "BLUE": colors.blue,
    "YELLOW": colors.yellow,
    "CYAN": colors.cyan,
    "RED": colors.red,
    "MAGENTA": colors.magenta,
    "GREY": colors.grey
} as const;

export type Color = keyof typeof AllColors;

export type SchemaReturnType<T extends Schema> = z.infer<T>;

export type RawPrompt = {
    message: string;
    color?: Color;
    delimiter?: string;
}

type PromptStyle = Pick<RawPrompt, "color" | "delimiter">

export type OptionalPromptStyle = Partial<PromptStyle>;

// based dev

export type BucketInput = {
    [key: string]: PromptOptions<Schema>
};

export type BucketResponse<T extends BucketInput, K extends keyof T = keyof T> = { 
    [Property in K]: SchemaReturnType<T[Property]["schema"]>;
}

export type PromptOptions<T extends Schema> = {
    message: string;
    schema: T;
    delimiter?: string;
    color?: Color;
    transform?: (input: string) => SchemaReturnType<T> | undefined;
}

export type SPInstance = {
    prompt: <T extends Schema>(
        PromptInputOptions: PromptOptions<T>
    ) => SchemaReturnType<T>;
    promptBucket: <T extends BucketInput>(PromptBucketInputOptions: T) => Promise<BucketResponse<T>>;
    setNewDefaults: (PropmtStyleOptions: OptionalPromptStyle) => void;
}