const form = document.querySelector("#signup-form");
const notyf = new Notyf();

const users = JSON.parse(localStorage.getItem("users")) || [];

class User {
    constructor(username, email, password) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.id = Date.now();
    }
}


const setData = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
}

const getData = (key) => {
    return JSON.parse(localStorage.getItem(key));
}

const signUpHandler = (e) => {
    e.preventDefault();
    const username = form.username.value;
    const email = form.email.value;
    const password = form.password.value;
    const confirmPassword = form["confirm-password"].value;
    if (username === "" || email === "" || password === "" || confirmPassword === "") {
        notyf.error("Please fill in all fields");
        return;
    }
    if (password.length < 6) {
        notyf.error("Password must be at least 6 characters");
        return;
    }
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
        notyf.error("Username is not valid.");
        return;
    }
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        notyf.error("Email is not valid.");
        return;
    }
    if (password !== confirmPassword) {
        notyf.error("Passwords do not match");
        return;
    }
    const isUserExists = users.some(user => user.email === email || user.username === username)
    if (isUserExists) {
        notyf.error("Email or username already exists");
        return;
    }
    const user = new User(form.username.value, form.email.value, form.password.value);
    users.push(user);
    setData("users", users);
    form.reset();
    notyf.success("Account created successfully.");
    setTimeout(() => {
        window.location.href = "../login/index.html";
    }, 1000);
}

form.addEventListener("submit", signUpHandler);