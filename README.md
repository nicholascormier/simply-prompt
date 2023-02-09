# simply-prompt 
#### a safe and simple prompt utility. 

> ## Creating individual prompts
> ```
>import { SP } from "simply-prompt";
>
>const prompt = SP.create();
>
>(async() => {
>
>   const firstName = await prompt.getInput({
>      message: "First name",
>      schema: z.string()
>   });
>
>   const lastName = await prompt.getInput({
>      message: "Last name",
>      schema: z.string()
>   });
>
>   const is21 = await prompt.getInput({
>       message: "Are you at least 21?",
>       schema: zod.coerce.boolean(),
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
> promptBucket({ [K: string]: PromptOptions }) => BucketResponse 
>
> type PromptOptions = {
>    message: string,
>    schema: zod.Schema,
>    deliminator?: string,
>    color?: Color,
>    transform?: (input: string) => SchemaReturnType<T> | undefined,
> }
>
> // zod is doing all of the magic here :)
> type SchemaReturnType<T extends zod.Schema> z.infer<T>;
>``` 
## Creating a Prompt Bucket 
>```
>(async () => {
>    
>    const prompt = SP.create();
>    
>    const bucket = await prompt.promptBucket({
>        "first_name": {
>            message: "Enter your first name",
>            schema: z.string()
>        },
>        "last_name": {
>            message: "Enter your last name",
>            schema: z.string()
>        },
>        "age": {
>            message: "Enter your age",
>            schema: z.coerce.number()
>        }
>    });
>
>    const { first_name,  last_name, age } = bucket;
>
>    // typeof first_name = string
>    // typeof last_name = string
>    // typeof age = number
>
>})()
>```

> - there is no need for shapes more complex than string, boolean & number.
> - this is because you can cast your prompt types to more complex types
##### example:
>
>```
> import { SP } from "simply-prompt";
> import { z } from "zod";
>
>(async () => {
>    
>    const prompt = SP.create();
>    
>    const bucket1 = await prompt.promptBucket({
>        "first_name": {
>            message: "Enter your first name",
>            schema: z.string()
>        },
>        "last_name": {
>            message: "Enter your last name",
>            schema: z.coerce.boolean()
>        },
>        "age": {
>            message: "Enter your age",
>            schema: z.coerce.number()
>        },
>        "favorite_food": {
>            message: "Enter your favorite food",
>            schema: z.string()
>        },
>        "favorite_color": {
>            message: "Enter your favorite color",
>            schema: z.string()
>        },
>    });
>
>    const { 
>       first_name,
>       last_name, 
>       age,
>       favorite_food,
>       favorite_color
>     } = bucket1;
>
>    const Nick = {
>        identity: {
>            first_name,
>            last_name,
>            age
>        },
>        preferences: {
>            favorite_food,
>            favorite_color
>        }
>    }
>
>    /*
>    shape of "Nick" {
>        identity: {
>            first_name: string;
>            last_name: string;
>            age: number;
>        };
>        preferences: {
>            favorite_food: string;
>            favorite_color: string;
>        };
>    }
>    */
>
>})()