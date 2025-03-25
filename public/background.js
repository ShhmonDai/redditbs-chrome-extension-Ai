/*global chrome*/

console.log("Background working");

// Declaring constants to store Reddit URLs.
const redditNew = "https://www.reddit.com/r";
const redditOld = "https://old.reddit.com/r";

// This function returns the appropriate post content class based on the URL.
function getPostContentClassName(url) {
    // If the URL starts with the LinkedIn list view URL, return the list view class name, else return the detail view class name.
    return url.startsWith(redditNew)
        ? "#t3_1jgdaez-post-rtjson-content"
        : "#siteTable .md";
}

// This function grabs the post content text from the web page.
function grabPostContent(className) {
    const postContentContainer = document.body.querySelector(`${className}`);
    const postContent = postContentContainer.textContent;
    const cleanedPostContent = postContent.replace(/\s\s+/g, " ");
    console.log("cleanedPostContent", cleanedPostContent);
    return cleanedPostContent;
}

// This is an event listener that runs when a tab is updated in Chrome.
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    console.log("EventListener Triggered");
    // Check if the tab is fully loaded and active.
    if (changeInfo.status === "complete" && tab.active) {
        // Check if the URL of the tab matches the Reddit new or old URL.
        if (
            tab.url?.startsWith(redditNew) ||
            tab.url?.startsWith(redditOld)
        ) {
            // Execute the grabPostContent function on the current tab and store the result in local storage.
            chrome.scripting
                .executeScript({
                    target: { tabId: tabId },
                    func: grabPostContent,
                    args: [getPostContentClassName(tab.url)],
                })
                .then((queryResult) => {
                    chrome.storage.local.set({ postContent: queryResult[0].result });
                });
        } else {
            chrome.storage.local.set({ postContent: 'No post available. Visit a text Reddit post to preview or try refreshing the page'});
        }
    }
});