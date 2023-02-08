import { z, Schema } from "zod";
import colors from "colors";

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

export const PromptTypes = {
    "STRING": z.string(),
    "BOOL": z.coerce.boolean(),
    "NUMBER": z.coerce.number()
} as const;

export type PromptType = keyof typeof PromptTypes;

export type SchemaReturnType<T extends Schema> = z.infer<T>;

export type PromptOptions<T extends Schema> = {
    message: string;
    type: PromptType;
    deliminator?: string;
    color?: Color;
    transform?: (input: string) => SchemaReturnType<T> | undefined;
}

export type SPInstance = {
    prompt<T extends Schema>(
        { message, type, color, transform }: PromptOptions<T>
    ): SchemaReturnType<T>;
    promptBucket<T extends BucketInput>(input: T): Promise<BucketResponse<T>>;
}

export type OptionalPrompt = {
    color?: Color;
    deliminator?: string;
}

export type RawPrompt = OptionalPrompt & { message: string }

// based dev

export type BucketInput = {
    [key: string]: PromptOptions<Schema>
};

type ResolveSchemaFromType<T extends PromptType> = typeof PromptTypes[T];

export type BucketResponse<T extends BucketInput, K extends keyof T = keyof T> = { 
    [Property in K]: z.infer<ResolveSchemaFromType<T[Property]["type"]>>;
}
