import ChatBot from "./components/ChatBot";
import { Params } from "./types/Params";

import axios from "axios"; // You may need to install axios: npm install axios
const openAIEndpoint = 'https://gentai.instamart.ai:8448/query';
let response ="Hello";




function App() {

	// Serves as an example flow used during the development phase - covers all possible attributes in a block.
	// restore to default state before running selenium tests (or update the test cases if necessary)!
	const flow = {
		
		start: {
			message: "Hello! What is your name?",
			path: "ask_group",
		},
		ask_group: {
			message: (params: Params) => `Hey ${params.userInput}! Nice to meet you.Click on Any of the Options.`,
			options: ["Document", "OpenAI", "About Us","Our Product"],
			chatDisabled: true,
			path: (params: Params) => {
				// Check if the selected option is "About Us"
				if (params.userInput.toLowerCase() === "about us") {
					return "ask_aboutus";
				} else if (params.userInput.toLowerCase() === "our product"){
					// Default path for other options
					return "ask_product"; // Replace "default_path" with the appropriate path
				}
				else if (params.userInput.toLowerCase() === "document"){
					// Default path for other options
					return "ask_document"; // Replace "default_path" with the appropriate path
				}
			},
			// path: () => "ask_aboutus",
		},
		
		
		ask_aboutus: {
			message: (params: Params) => {
				if (params.prevPath == "incorrect_answer") {
					return;
				}
				return `I see you want ${params.userInput}. Let's do a quick test! What is 1 + 1?`
			},
			path: (params: Params) => {
				if (params.userInput != "2") {
					return "ask_group"
				} else {
					return "about_us";
				}
			},
		},
		about_us: {
			message: "At Instamrt, we are passionate about Work.Type Name Go Back to main Menu.",
			
            path: "ask_group",
			
		},


        ask_product: {
			message: (params: Params) => {
				if (params.prevPath == "incorrect_answer") {
					return;
				}
				return `I see you want know about  ${params.userInput}. Let's do a quick test! What is 1 + 1?`
			},
			path: (params: Params) => {
				if (params.userInput != "2") {
					return "ask_group"
				} else {
					return "product";
				}
			},
		},
		
		product: {
			message: "We Have Product 1) GenAI chatbot 2) DevOps Solution. Type Name Go Back to main Menu.",
			
            path: "ask_group",
			
		},

        
        ask_document: {
			message: (params: Params) => {
				if (params.prevPath == "incorrect_answer") {
					return;
				}
				return `Do you want ask questions from  ${params.userInput}.Type yes or no?`
			},
			path: (params: Params) => {
				if (params.userInput == "no") {
					return "ask_group"
				} if  (params.userInput == "yes"){
					return "document";
				}
				else{
					return "ask_group"
				}
			},
		},
		
		document: {
			message: "Please ask any question regarding your train documents",
			path: async (params: Params) => {
			  const query_text = params.userInput;
		  
			  try {
				const response = await axios.post(openAIEndpoint, { query_text });
		  
				console.log("API Response:", response.data);
		  
				// Assuming the structure is response.data[0]
				const answer = response.data.response;
		  
				if (answer) {
				  // Display the API response in the chat
				  params.injectMessage(answer);
				} else {
				  // Log the unexpected response
				  console.error("Unexpected API response:", response.data);
		  
				  // Log the entire response for further inspection
				  console.log("Full API Response:", response);
		  
				  params.injectMessage("Sorry, I couldn't retrieve the answer. Please try again.");
				}
			  } catch (error) {
				// Log the API call error
				console.error("Error calling the API:", error);
				params.injectMessage("Sorry, an error occurred while fetching the answer. Please try again later.");
			  }
		  
			  return "ask_document";
			},
		  },
		  
		  

			

		ask_favourite_pet: {
			// message: "Interesting! Pick any 2 pets below.",
			checkboxes: {items: ["Dog", "Cat", "Rabbit", "Hamster"], min:2, max: 2},
			function: (params: Params) => alert(`You picked: ${JSON.stringify(params.userInput)}!`),
			path: "ask_height",
		},
		ask_height: {
			message: "What is your height (cm)?",
			path: (params: Params) => {
				if (isNaN(Number(params.userInput))) {
					params.injectMessage("Height needs to be a number!");
					return;
				}
				return "ask_weather";
			}
		},


		ask_weather: {
			message: (params: Params) => {
				if (params.prevPath == "incorrect_answer") {
					return;
				}
				return "What's my favourite color? Click the button below to find out my answer!"
			},
			render: (
				<div style={{display: "flex", alignItems: "center", justifyContent: "center", marginTop: 10}}>
					<button 
						className="secret-fav-color"
						onClick={() => alert("black")}>
						Click me!
					</button>
				</div>
			),
			path: (params: Params) => {
				if (params.userInput.toLowerCase() != "black") {
					return "incorrect_answer"
				} else {
					params.openChat(false);
					return "close_chat";
				}
			},
		},
		close_chat: {
			message: "I went into hiding but you found me! Ok tell me, what's your favourite food?",
			path: "ask_image"
		},
		ask_image: {
			message: (params: Params) => `${params.userInput}? Interesting. Could you share an image of that?`,
			file: (params: Params) => console.log(params.files),
			path: "end"
		},
		end: {
			message: "Thank you for sharing! See you again!",
			path: "loop"
		},
		loop: {
			message: "You have reached the end of the conversation!",
			path: "loop"
		},
		incorrect_answer: {
			message: "Your answer is incorrect, try again!",
			transition: {duration: 0},
			path: (params: Params) => params.prevPath
		},
	}

	return (
		<div className="App">
			<header className="App-header">
				<div style={{display: "flex", justifyContent: "center", alignItems: "center", marginTop: `calc(20vh)`}}>
					<ChatBot
						flow={flow}
						options={{
							audio: {disabled: false},
							chatInput: {botDelay: 1000},
							userBubble: {showAvatar: true},
							botBubble: {showAvatar: true},
							voice: {disabled: false}
						}}
					></ChatBot>
				</div>
			</header>
		</div>
	);
}

export default App;
