console.warn('loaded subscriber script');

const selectors = {
  gslide: {
    commentNodeClassName: 'punch-viewer-speaker-questions',
    listNodeSelector: '.punch-viewer-speaker-questions',
    extractFn: (el) => el.children[1].children[2],
  },
  zoom: {
    commentNodeClassName: 'ReactVirtualized__Grid__innerScrollContainer',
    listNodeSelector: '.ReactVirtualized__Grid__innerScrollContainer',
    extractFn: (el) => el,
  },
  slack: {
    commentNodeClassName: 'c-virtual_list__item',
    listNodeSelector: '.p-threads_flexpane_container .c-virtual_list__scroll_container[data-qa="slack_kit_list"]',
    extractFn: (el) => el,
  }
}

const subscribeComments = (platform, observeElement, sendResponse) => {
  const extractComment = (mutationRecords: MutationRecord[]): string[] => {
    console.warn(mutationRecords);
    const nodes = mutationRecords
      .filter((record) => {
        const element = record.target as Element;

        // zoom
        return element.className === selectors[platform].commentNodeClassName;
        // slack
        // return element['data-item-key'] != 'input';
      })
      .map((record) => record.addedNodes[0]);


    console.warn(nodes.length, 'nodes found');
    const comments = Array.from(nodes).map((node) => {
      const element = node as HTMLElement;
      const commentElement = selectors[platform].extractFn(element) as HTMLElement;

      return commentElement?.innerText;
    }).filter(r => r !== undefined);
    console.warn(comments);
    return comments;
  };

  const observer = new MutationObserver(function (records) {
    chrome.runtime.sendMessage({command: 'SendSubscribedComments', comments: extractComment(records)})
  });

  observer.observe(observeElement, { subtree: true, childList: true });

  sendResponse({ screenType: 'presenter', message: 'A listener has been added to the PRESENTER side.' });
};


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.command === 'Load') {
    const platform = message.platform;
    console.warn('platform',platform);
    console.warn(message);
  
    // slack
    // const observeElement = document.querySelector<HTMLDivElement>(selectors[platform].listNodeSelector);
    // zoom
    const observeElement = document.querySelector('.pwa-webclient__iframe')?.contentWindow.document.querySelector(selectors[platform].listNodeSelector)
  
    console.warn(observeElement);
  

    if (observeElement === null) {
      console.warn('not found node');
      
      return;
    }

    subscribeComments(platform, observeElement, sendResponse);
    console.warn('subscribe started');
    chrome.runtime.sendMessage({command: 'Load', from: 'subscriber', tabId: message.tabId})
  }
});