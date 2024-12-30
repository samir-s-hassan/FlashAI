## Inspiration
- It takes me a while to study and I find myself taking time to even gather my studying material together
- It’d be a lot easier if my study material was already prepared for me and I could do the rest from there
- I want to be confident in the material I’m studying from
- I also want to understand how well I’m studying if I’m creating my study material
- Flashcards is my favorite way to study and learn

## What it does
- As a user, I can create detailed and specific flashcards for my specific needs
- As a user, I can able to create, read, update, and delete my flashcards
- As a user, I can test my knowledge with my created flashcards
- As a user, I can understand how well I’m learning and studying
- As a user, I can to save a collection of flashcards and load it as needed

## How to run
1. Open your terminal
2. Run "npm install" to make sure you have all the necessary dependencies/packages
3. Run "npx vite build"
4. Run "npx vite" and this will get our app started on a link
5. Click on the link present in your client terminal to open your front-end
6. Enjoy your app!

## How we built it
- We built our frontend using Vite js and utilized API gateways to communicate with our backend hosted on AWS Lambda, using the Bedrock agent to send signals to Claude 3. The output was returned back in a json format, which we converted into an interactive format to be displayed on the screen to the user

## Challenges we ran into
- We had a hard time incorporating file recognition into our project, turning pdfs into base 64 to send to the LLM model.
- We had some different views on the design of our web app, and we decided to focus on a minimatic and sleek design that is pleasing to the eye, yet simple enough for all users to navigate through
- It was very difficult to get pictures recognized as we spent a lot of time trying to sent it from our frontend for Claude to read it

## Accomplishments that we're proud of
- Our UI/UX
- The CRUD functionality in regards to our flashcards allows the user to take advantage of AI power while also adding their own personal touch
- The ability to read PDF files and offer flashcards based on them
- Our test feature, which allows users to see how well they’ve learned the information of their topic

## What we learned
- We learned how to effectively use AWS Lambda functions to handle server-side logic and automate processes. 
- Additionally, we explored how to utilize Amazon Bedrock to integrate with Claude, enabling seamless communication between the AI and Lambda. 
- On the front-end, we developed skills in creating a user-friendly interface (UI) to enhance the overall user experience. 
- Lastly, we gained experience using Amazon API Gateway to create secure and scalable APIs that link the front-end and back-end components of our application.
- The importance of MVP

## What's next for FlashAI
- Create functionality to print out the digital flashcards
      -	Creating feature to have communities based on learning topic to allow for peer-based learning


