import React, { Component } from "react";

export class ChatBot extends Component {
    constructor() {
        super();
        this.state = {
            messages: [], // To hold the chat conversation
            userInput: "", // To store the user's input
            loading: false, // To show loading state while waiting for the bot's response
        };
    }

    // Function to send a message to GPT and get a response
    sendMessage = async () => {
        if (this.state.userInput.trim() === "") return; // Do nothing if input is empty

        const newMessage = {
            role: "user",
            content: this.state.userInput,
        };

        // Add the user message to the chat
        this.setState((prevState) => ({
            messages: [...prevState.messages, newMessage],
            userInput: "",
            loading: true,
        }));

        try {

            const apiKey = process.env.NEXT_PUBLIC_OPENAI_KEY;
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: "gpt-4", // GPT model to use
                    messages: this.state.messages.concat(newMessage), // Send entire conversation history
                }),
            });

            const data = await response.json();

            // Check if the response contains a valid message
            if (data.choices && data.choices.length > 0) {
                const botMessage = {
                    role: "assistant",
                    content: data.choices[0].message.content,
                };

                // Add the bot response to the chat
                this.setState((prevState) => ({
                    messages: [...prevState.messages, botMessage],
                    loading: false,
                }));
            } else {
                console.error("No valid response from API");
                this.setState({ loading: false });
            }
        } catch (error) {
            console.error("Error:", error);
            this.setState({ loading: false });
        }
    };

    // Handle input field changes
    handleInputChange = (event) => {
        this.setState({ userInput: event.target.value });
    };

    render() {
        return (
            <div className="w-full h-full flex flex-col bg-gray-800 text-white select-none">
                {/* Chat Header */}
                <div className="flex items-center justify-between w-full bg-gray-700 p-3">
                    <span className="font-bold">ChatBot</span>
                </div>

                {/* Chat Messages */}
                <div className="flex-grow flex flex-col justify-end overflow-y-auto p-4">
                    {this.state.messages.length === 0 ? (
                        <div className="text-center text-gray-400">
                            Start the conversation!
                        </div>
                    ) : (
                        this.state.messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`${msg.role === "user" ? "text-right" : "text-left"
                                    } mb-2`}
                            >
                                <span
                                    className={`${msg.role === "user" ? "bg-blue-500" : "bg-green-500"
                                        } text-white p-2 rounded-md`}
                                >
                                    {msg.content}
                                </span>
                            </div>
                        ))
                    )}

                    {/* Loading Indicator */}
                    {this.state.loading && (
                        <div className="text-center text-gray-400">Bot is typing...</div>
                    )}
                </div>

                {/* Chat Input */}
                <div className="flex items-center p-3 bg-gray-700">
                    <input
                        type="text"
                        value={this.state.userInput}
                        onChange={this.handleInputChange}
                        className="flex-grow p-2 bg-gray-600 text-white rounded-l-md"
                        placeholder="Type a message..."
                    />
                    <button
                        onClick={this.sendMessage}
                        className="bg-blue-500 px-4 py-2 text-white rounded-r-md"
                    >
                        Send
                    </button>
                </div>
            </div>
        );
    }
}

export default ChatBot;

export const displayBot = () => {
    return <ChatBot />;
};
