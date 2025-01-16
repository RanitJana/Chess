const showNotification = (content) => {
    // Check if the browser supports notifications
    if ("Notification" in window) {
        // Request permission
        Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
                new Notification("Chess.com", {
                    body: content,
                    icon: "/images/favicon.png", // Optional
                });
            }
        });
    } else {
        alert("Your browser does not support notifications.");
    }
};

export default showNotification;