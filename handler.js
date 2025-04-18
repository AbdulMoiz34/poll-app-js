const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const paths = ["login", "signUp", "/"];
paths.forEach(path => {
    if (window.location.pathname.includes(path)) {
        if (currentUser) {
            location = "/home/index.html";
        }
    }
});