console.log('loaded streamer script');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message);
  
  if (message.command === 'Load') {
    chrome.runtime.sendMessage({command: 'Load', from: 'streamer', tabId: message.tabId})
    sendResponse({ screenType: 'streamer', message: 'A listener has been added.' });
  }

  if (message.command === 'SendSubscribedComments') {
    const iframeElement: HTMLIFrameElement = document.querySelector('.punch-present-iframe');
    // google slide
    const boxElement = iframeElement.contentWindow.document.querySelector('.punch-viewer-content');
    // example.com
    // const boxElement = document.querySelector('div');

    const addComment = (comment: string) => {
      console.log('add comment');
      
      const element = document.createElement('p');
      element.innerText = comment;

      boxElement.appendChild(element);
    };

    const comments = message.comments.filter((comment) => !comment.match(/^[8８]+$/));

    comments.forEach((comment) => addComment(comment));
  }
});