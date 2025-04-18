const addOptionBtn = document.querySelector("#add-option-btn");
const pollOptionsContainer = document.querySelector("#poll-options-container");
const polls = JSON.parse(localStorage.getItem("polls")) || [];
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const createPollBtn = document.querySelector("#create-poll-btn");
const notyf = new Notyf();


// Add Poll Options
let optionCount = 0;
const addOptions = () => {
    optionCount++;
    const div = document.createElement("div");
    div.className = "flex items-center";
    div.innerHTML = `   <div
                            class="border-1 border-gray-200 px-4 h-8 bg-gray-100 rounded-l-lg text-gray-500 text-sm flex justify-center items-center">
                            <span>${optionCount}</span>
                        </div>
                        <input required type="text" placeholder="Option ${optionCount}"
                            class="px-4 py-2 border-1 border-t-gray-300 border-l-0 border-r-0 border-b-gray-300 w-full focus:outline-blue-500 placeholder:text-sm placeholder:text-gray-400">
                        <button
                        onclick="deleteOption(this)"
                            class="border-1 border-gray-200 cursor-pointer px-2 h-8 text-red-400  bg-red-50 hover:bg-red-100 rounded-r-lg  text-sm flex justify-center items-center">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    `;
    pollOptionsContainer.appendChild(div);
}

addOptions()
addOptions()

const deleteOption = (btn) => {
    if (optionCount === 2) {
        document.getElementById("error").classList.remove("hidden");
        return;
    } else {
        document.getElementById("error").classList.add("hidden");
    }

    btn.parentElement.remove();
    optionCount--;
    for (let i = 0; i < pollOptionsContainer.children.length; i++) {
        pollOptionsContainer.children[i].children[0].children[0].textContent = i + 1;
        pollOptionsContainer.children[i].children[1].placeholder = `Option ${i + 1}`;
    }
}

const setData = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
}

// // Create Poll
class Poll {
    constructor(title, description, options, userId, username) {
        this.title = title;
        this.description = description;
        this.options = options;
        this.id = Date.now();
        this.createdAt = new Date();
        this.createdBy = userId;
        this.createdByUsername = username;
        this.votes = [];
    }
}

const createPoll = () => {
    const title = document.querySelector("#poll-title").value;
    const description = document.querySelector("#poll-desc").value;
    const optionsInp = document.querySelectorAll("#poll-options-container input");
    const options = [...optionsInp].map(inp => inp.value.trim());

    if (title === "") {
        notyf.error("Please enter a title for your poll");
        return;
    }
    if (options.some(option => option === "")) {
        notyf.error("Please enter all options");
        return;
    }
    const poll = new Poll(title, description, options, currentUser.id, currentUser.username);
    polls.push(poll);

    setData("polls", polls);
    notyf.success("Poll created successfully");
    setTimeout(() => {
        window.location.href = "../polls/index.html";
    }, 1000);
}

addOptionBtn.addEventListener("click", addOptions);
createPollBtn.addEventListener("click", createPoll);