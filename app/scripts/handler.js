function onRequest(request, sender, callback) {
    if (request.action === 'sort_click') {
        callback();
    }
}

// Wire up the listener.
chrome.extension.onRequest.addListener(onRequest);
