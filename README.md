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
>import { z } from "zod";
>
>const prompt = SP.create();
>
>(async() => {
>
>   const firstName = await prompt.getInput({
>      prompt: "First name",
>      schema: z.string(),
>      color: "CYAN"
>   });
>
>   const lastName = await prompt.getInput({
>      prompt: "Last name",
>      schema: z.string()
>   });
>
>   const is21 = await prompt.getInput({
>       prompt: "Are you at least 21?",
>       schema: z.coerce.boolean(),
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
> create(options?: CreateOptions): SPInstance
>
> getInput(options: InputOptions): SchemaReturnType
>
> type InputOptions = {
>    schema: T extends zod.Schema,
>    transform?: (input: string) => SchemaReturnType<T> | undefined,
>    ...
> }
>
> // zod is doing all of the magic here :)
> type SchemaReturnType<T extends zod.Schema> z.infer<T>;
>
>``` 
> - be sure to add coerce modifier to zod schema for types that are <strong>NOT</strong> strings (booleans & numbers).
