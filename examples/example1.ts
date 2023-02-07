import { SP } from "../sp";
import { z } from "zod";
const prompt = SP.create();

(async() => {

    const firstName = await prompt.getInput({
        prompt: "First name",
        schema: z.string(),
        color: "CYAN"
    });

    const lastName = await prompt.getInput({
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

    console.log(firstName, lastName, is21);

    // nick commit true

})();