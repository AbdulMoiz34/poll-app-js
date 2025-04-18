const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const notyf = new Notyf();

if (!currentUser) {
    location = "/authentication/login/index.html";
}

const logoutBtn = document.querySelector("#logout-btn");

const logoutHandler = () => {
    localStorage.removeItem("currentUser");
    notyf.success("Logout successful");
    setTimeout(() => {
        window.location.href = "/index.html";
    }, 1000);
}

document.querySelector("#username-display").textContent = currentUser.username;
logoutBtn.addEventListener("click", logoutHandler);
