import { SP } from "../src/sp";

(async () => {
    
    const prompt = SP.create();
    
    const bucket1 = await prompt.promptBucket({
        "prompt1": {
            message: "Question 1",
            type: "STRING" 
        },
        "prompt2": {
            message: "Question 2",
            type: "BOOL"
        },
        "prompt3": {
            message: "Question 3",
            type: "NUMBER"
        }
    });

    const { prompt1,  prompt2, prompt3 } = bucket1;

    // typeof prompt1 = "string"
    // typeof prompt2 = "bool"
    // typeof prompt3 = "number"

})()

