import { SP } from "../src/sp";
import { z } from "zod";

(async () => {
    
    const sp = SP.create();
    
    const bucket = await sp.promptBucket({
        "first_name": {
            message: "Enter your first name",
            schema: z.string(),
            color: "MAGENTA",
            delimiter: "$ "
        },
        "last_name": {
            message: "Enter your last name",
            schema: z.string(),
            color: "GREEN",
            delimiter: " - "
        },
        "age": {
            message: "Enter your age",
            schema: z.coerce.number(),
            color: "YELLOW",
            delimiter: "# "
        },
        "favorite_color": {
            message: "Enter your favorite color",
            schema: z.string(),
            color: "RED",
            delimiter: "/ "
        },
        "favorite_food": {
            message: "Enter your favorite food",
            schema: z.string(),
            color: "CYAN",
            delimiter: ": "
        }
    });

    const { first_name, last_name, age, favorite_color, favorite_food } = bucket;

    // typeof first_name = "string"
    // typeof last_name = "bool"
    // typeof age = "number"
    // typeof favorite_color = "string"
    // typeof favotire_food = "string"

    // there is no need for shapes more complex than string, boolean & number.
    // this is because you can cast your prompt types to more complex types
    // example:

    const Nick = {
        identity: {
            first_name,
            last_name,
            age
        },
        preferences: {
            favorite_food,
            favorite_color
        }
    };

    /*

    shape of "Nick" {
        identity: {
            first_name: string;
            last_name: string;
            age: number;
        };
        preferences: {
            favorite_food: string;
            favorite_color: string;
        };
    }

    */

})();

