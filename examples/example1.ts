import { SP } from "../src/sp";
import { z } from "zod";

(async() => {

    const sp = SP.create();

    const firstName = await sp.prompt({
        message: "First name",
        schema: z.string(),
        color: "CYAN"
    });

    const lastName = await sp.prompt({
        message: "Last name",
        schema: z.string()
    });

    const is21 = await sp.prompt({
        message: "Are you at least 21?",
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

    console.log(firstName, lastName, is21);

    // nick commit true

})();