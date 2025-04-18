const form = document.querySelector("#login-form");
const notyf = new Notyf();
const users = JSON.parse(localStorage.getItem("users")) || [];

const findUserByEmailOrUsername = (username) => {
    return users.find(user => user.email === username || user.username === username);
}

const setData = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
}

const loginHandler = (e) => {
    e.preventDefault();
    const username = form.username.value;
    const password = form.password.value;
    if (username === "" || password === "") {
        notyf.error("Please fill in all fields");
        return;
    }
    const user = findUserByEmailOrUsername(username);
    if (!user) {
        notyf.error("Invalid username or email.");
        return;
    }

    if (user.password !== password) {
        notyf.error("Invalid password");
        return;
    }
    notyf.success("Login successful");
    setData("currentUser", user);
    setTimeout(() => {
        window.location.href = "../../home/index.html";
    }, 1000);
}

form.addEventListener("submit", loginHandler);
