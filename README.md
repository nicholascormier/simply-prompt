# simply-prompt

## a safe and simple prompt utility. 

> ### API
>
>
>
>
> <strong>example</strong>
>
> ```
>import { SP } from "simply-prompt";
>
>const prompt = SP.create();
>
>(async() => {
>
>   const firstName = await prompt.getInput({
>      message: "First name",
>      type: "STRING",
>      color: "CYAN"
>   });
>
>   const lastName = await prompt.getInput({
>      message: "Last name",
>      type: "STRING"
>   });
>
>   const is21 = await prompt.getInput({
>       message: "Are you at least 21?",
>       type: "BOOL",
>       transform: (input) => {
>           input = input.toLowerCase();
>           if (input == "y" || input == "yes") {
>               return true 
>           } else if (input == "n" || input == "no") {
>               return false
>           }
>        } 
>    });
>   
>   console.log(firstName, lastName, is21);
>
>   // nick commit true
>
>})();
>```

![example output](https://github.com/nickcognito/simply-prompt/blob/master/examples/example1.jpg?raw=true)

>###### powered by zod
>
>```
> create(options?: OptionalPrompt): SPInstance
>
> prompt(options: PromptOptions) => SchemaReturnType 
> (SchemaReturnType is primative string / boolean / number)
>
> promptBucket({ [string]: PromptOptions }) => BucketResponse 
>
> type PromptOptions = {
>    message: string,
>    type: "STRING" | "BOOL" | "NUMBER",
>    deliminator?: string,
>    color?: Color,
>    transform?: (input: string) => SchemaReturnType<T> | undefined,
> }
>
> // zod is doing all of the magic here :)
> type SchemaReturnType<T extends zod.Schema> z.infer<T>;
>``` 
>```
>import { SP } from "../src/sp";
>
>(async () => {
>    
>    const prompt = SP.create();
>    
>    const bucket1 = await prompt.promptBucket({
>        "prompt1": {
>            message: "Question 1",
>            type: "STRING" 
>        },
>        "prompt2": {
>            message: "Question 2",
>            type: "BOOL"
>        },
>        "prompt3": {
>            message: "Question 3",
>            type: "NUMBER"
>        }
>    });
>
>    const { prompt1,  prompt2, prompt3 } = bucket1;
>
>    // typeof prompt1 = "string"
>    // typeof prompt2 = "bool"
>    // typeof prompt3 = "number"
>
>})()
>```