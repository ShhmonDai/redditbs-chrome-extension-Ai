import React, { useEffect, useState } from "react";
import { VscGear } from "react-icons/vsc";
import { PAGES } from "../utils/pages";
import { loadData } from "../utils/localStorage";
import { postChatGPTMessage } from "../utils/chatGPT";
import { prompt } from "../components/Prompt";

function Generator({ setPage, openAIKey }) {

    const [postContent, setPostContent] = useState("");
    const [aiReport, setAiReport] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Load post content from local storage on component mount
        const getPostContent = async () => {
            try {
                const content = await loadData("postContent");
                setPostContent(content);
            } catch (error) {
                console.error("Error while fetching post content", error);
            }
        };

        getPostContent();
    }, []);


    const generateReport = async () => {
        setIsLoading(true);

        try {
            // Create message to send to chatGPT API
            const message = `${prompt}\n\nREDDIT POST TO ANALYZE:\n${postContent}`;
            // Send message to chatGPT API and wait for response
            const chatGPTResponse = await postChatGPTMessage(message, openAIKey);
            // Update state with generated report
            setAiReport(chatGPTResponse);
        } catch (error) {
            console.error(error);
        } finally {
            // Set loading state to false once the process is complete (whether it was successful or not)
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col">
            <div className="flex flex-row justify-between mx-5 my-3 items-center">
                <button
                    disabled={isLoading}
                    onClick={generateReport}
                    className="border-2 border-solid border-blue-500 text-blue-500 text-lg font-bold rounded-md px-3 py-2 hover:text-white hover:bg-blue-500"
                >
                    {isLoading ? "Analyzing..." : "Analyze"}
                </button>
                <h2 className="text-2xl font-bold">Reddit Post BS Checker</h2>
                <button
                    onClick={() => setPage(PAGES.PROFILE)}
                    className="border mr-[1px] p-2 border-solid border-gray-600 rounded-[100%] hover:bg-gray-200 hover:border-2 hover:mr-0 transition duration-300 ease-in-out"
                >
                    <VscGear className="text-[150%] text-gray-500" />
                </button>
            </div>
            <div className="text-lg font-bold mx-5">
                {aiReport ? "Results:" : "Post content to be analyzed:"}
            </div>
            <div className="flex mx-5 text-gray-800 text-md">
                <textarea
                    rows={12}
                    className="block p-2.5 w-full text-sm text-gray-900 dark:text-gray-800 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder={postContent}
                    value={aiReport}
                    readOnly
                />
            </div>
        </div>
    );
}

export default Generator;