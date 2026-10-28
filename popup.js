// Treści są generowane przez AI na podstawie promptów Vincenque (https://github.com/Vincenque)

document.addEventListener("DOMContentLoaded", function() {
    let toggleSwitch;
    
    toggleSwitch = document.getElementById("toggle-extension");

    chrome.storage.local.get(["isExtensionEnabled"], function(result) {
        toggleSwitch.checked = result.isExtensionEnabled !== false;
    });

    toggleSwitch.addEventListener("change", function() {
        let isEnabled;
        
        isEnabled = toggleSwitch.checked;
        
        chrome.storage.local.set({ "isExtensionEnabled": isEnabled }, function() {
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                let activeTab;
                
                activeTab = tabs[0];
                if (activeTab && activeTab.url && activeTab.url.includes("allegro.pl")) {
                    chrome.tabs.reload(activeTab.id);
                }
            });
        });
    });
});