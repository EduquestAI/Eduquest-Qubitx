import express, { Express, Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import data from '../prompts/gradeinfo.json';
import puppeteer from "puppeteer";
const cors = require('cors');
import dotenv from "dotenv";
import fs from "fs";

// Dotenv init
dotenv.config();
// Important Variables
const app: Express = express();
const port = process.env.PORT;
const key: string = process.env.KEY as string;

/********************************************************************************************
 * ------------------------------------------CORS-------------------------------------------*
 ********************************************************************************************/
// UNCOMMENT WHEN REVERSE PROXY IS SETUP AND ITS UP
// CORS is weird and idk it that well but this basically is good for security and lets our API only be called by our domain and localhost when developing


let corsOptions = { 
  origin : ['eduquest.me']
};
app.use(cors(corsOptions));


/********************************************************************************************
 * ---------------------------------------Functions-----------------------------------------*
 ********************************************************************************************/

// Reads gradeinfo JSON and gets the right boundary for the user inputted subject and grade level (K-5 for now)
function getBoundaries(grade: string, subject: string){
  // Const declaration unnecessary but more readable :shrug:
  const gradeData = data[grade as keyof typeof data];
  return gradeData[subject as keyof typeof gradeData].boundaries;
}

/********************************************************************************************/

// Saturates the default subject prompt with the proper user inputted values and returns to be sent off to AI 
function saturatePrompt(prompt: string, interest: string, gradeLevel: string, subject: string){
  prompt = prompt.replace(/\[interest\]/g, interest);
  prompt = prompt.replace(/\[gradeLevel\]/g, gradeLevel);
  prompt = prompt.replace(/\[boundaries\]/g, getBoundaries(gradeLevel, subject) as string);

  return prompt;
}

/********************************************************************************************/

// Scrapes DuckDuckGo for image backgrounds (gets like )
async function scrapeImage(query: string){
  // Puppeteer setup
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  // Going to DuckDuckGo, waiting for response and inspecting element on page
  await page.goto(`https://duckduckgo.com/?q=${query}+background&t=hc&va=b&iax=images&ia=images`);
  await page.waitForSelector('.tile--img__img', { timeout: 5_000 });
  const images = await page.evaluate( () => {
    // Code to get each img src with class "tile--img__img" (That's the class they have for all images)
    const images = document.querySelectorAll('img.tile--img__img');
    const urls: any = [];
    // Does this for all initially loaded images (it a lot lol)
    images.forEach(image => {
      const src = image.getAttribute('src');
      urls.push(src);
    });
    // Returns the direct URLS to each image in an array of strings
    return urls;
  });
  // Makes sure things don't break
  await browser.close();
  return images;
}

// Calls scraper and returns only 5 images in array depending on a given question position (to avoid repeated images for the same interest)
async function getOrderedImages(position: number, interest: string){
  // Gets array of direct URLs to images
  let images: string = await scrapeImage(interest);
  let cutimages = [];
  // Loops through for 5 images since there're 5 questions at a time except it goes by a position so for the next 5 questions if prompt is ran again, the frontend will return a question position so it gives new images every time
  for (let i = 0;i < 5;i++){
    // Had to add https manually bc duckduckgo is weird and their frontend is like directly connected to their DB or smth so all URLS start with // instead of https:// idk
    cutimages[i] = "https:" + images[position];
    position++;
  }
  return cutimages;
}

/********************************************************************************************/

// Main AI Generation Function - NOTE: Input requires gradeLevel to be a string that's equal to one of these: ["kindergarten", "first", "second", "third", "fourth", "fifth"]; (I kept it as string for future expansion) 
async function generateJSON(promptFile: string, interest: string, gradeLevel: string, position: number) {
  try{
    // Init Gemini w/ api key from .env and setting AI model
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    // Reads proper prompt file depending on subject and sets a subject variable equal to the filepath without .txt extension
    let prompt = fs.readFileSync(("./prompts/" + promptFile), {"encoding": "utf-8"});
    let subject = promptFile.replace(/\.[^/.]+$/, "");
    // function call to make prompt actually good with the user inputted values
    prompt = saturatePrompt(prompt, interest, gradeLevel, subject);
    // Gets result from AI and returns it (next 4 lines found in Google's documentation) Also gets images and sets 5 of them equal to 5 postitions in array "images"
    const result = await model.generateContent(prompt);
    const response = await result.response;
    // Parses JSON response from AI to insert images for frontend and gets image URL array
    let questions = JSON.parse(response.text());
    let images: any = await getOrderedImages(position, interest);
    // Loops through image array and inserts the value into each question returned from the AI
    for (let i = 0; i < questions.questions.length; i++) {
      questions.questions[i].image = images[i];
      questions.questions[i].offset = i;
    }
    // Returns the restringified JSON (idk if that's a word)
    return JSON.stringify(questions);
  }
  catch (error){
    // Properly catches error with error type safety
    let message
    if (error instanceof Error) message = error.message
    else message = String(error)
    // returns error.. so sad :(
    return ({
      "success": "false",
      "message": "there was an error - This usually happens when either with the AI or it's response being formatted poorly",
      "error": message
    });
  }
}

/********************************************************************************************
 * ------------------------------------Request Handlers-------------------------------------*
 ********************************************************************************************/

app.use(express.json());

// Main
app.post("/generate/:interest", async (req: Request, res: Response) => {
  const { interest } = req.params;
  const gradeLevel: string = req.body.level;
  const promptFile: string = req.body.subject;
  const questionPosition: number = req.body.position;
  // API wouldn't wait for response before - now it does with 'await' thankfully (async carrying)
  let result = await generateJSON(promptFile, interest, gradeLevel, questionPosition);
  res.send(result);
});
// Funny
app.get("/", async (req: Request, res: Response) => {
  var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  res.send({
    "success": "nuh uh",
    "message": "How you even get here with CORS policy bro? You pentesting or smth???",
    "funny": `yk what?? I know who you are bro: ${ip}`
  });
});

// Start Server
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});