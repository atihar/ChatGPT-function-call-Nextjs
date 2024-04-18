import { NextResponse } from "next/server";
import OpenAI from "openai";

// ++ This is in an API route page of Next.14 app router ++
// You can call this function in any where and modify if you don't 
// use in app router api
export async function GET() {
 const apiKey = process.env.NEXT_OPEN_AI_KEY;
 const openai = new OpenAI({ apiKey });

// 1. Define your function here
 function helloWorld(appendString : string) {
 console.log("Hello World" + " " + appendString);
 }
  try {
     // Building the chat
     const response = await openai.chat.completions.create({
     model: "gpt-3.5-turbo-0613",
     temperature: 0.2,
     messages: [
     { role: "system", content: "Perform function requests for the user!" },
     { role: "user", content: "Hi, I would like to call the hello world function passing the string 'Hello from NVIDIA' to it." }
     ],
     function_call: "auto",
     functions: [{
     name: "helloWorld",
     description: "Hello World function",
     parameters: {
       type: "object",
       properties: {
         appendString: {
            type: "string",
            description: "String to append to the Hello World function",
           }
         }
       },
       required: ["appendString"],
       }],
     });
    
    console.log(response.choices[0].finish_reason); // for test. remove it in prod

    // taking a boolean to check if the open ai wants to call function or not
    let wantsToCallFn = response.choices[0].finish_reason == "function_call";

    if (wantsToCallFn && response.choices[0].message.function_call.name === "helloWorld") {
     let argumentObject = JSON.parse(response.choices[0].message.function_call.arguments);
     helloWorld(argumentObject.appendString);
     }
    return NextResponse.json({ message: "Function executed successfully!" });
 } catch (error) {
   console.error("Error while making request to OpenAI in Function call API", error);
   return NextResponse.json({ error: "Error connecting with OpenAI", status: 500 });
   }
}