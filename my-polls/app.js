const currentUserId = JSON.parse(localStorage.getItem("currentUser")).id;
const pollsContainer = document.getElementById("polls-container");
const pollsfromLS = JSON.parse(localStorage.getItem("polls")) || [];
const notyf = new Notyf();
const addOptionBtn = document.getElementById("add-option-btn");
const modal = document.querySelector(".modal");

const userPolls = () => {
    return pollsfromLS.filter(poll => poll.createdBy == currentUserId);
}

const time = (time) => {
    return time.slice(0, 4) + time.slice(4 + 3);
}

const formatLongDateUTC = dateStr => {
    const date = new Date(dateStr);
    return date.toDateString() + " at " + time(date.toLocaleTimeString());
}

const polls = userPolls();
const displayPolls = () => {
    polls.forEach(poll =>
        pollsContainer.innerHTML += `<div class="mx-auto bg-white p-6 rounded-xl shadow-sm border border-gray-200 mt-4">
       <div class="flex justify-between">
          <div>
             <h2 class="text-xl font-semibold text-gray-800">${poll.title}</h2>
             <p class="text-gray-600 mt-1">${poll.description}</p>
          </div>
          <div class="flex gap-2">
             <button onclick="editPoll(${poll.id})" data-modal-target="crud-modal" data-modal-toggle="crud-modal" class="cursor-pointer rounded-md"><i class="fas fa-edit mr-2 text-gray-600 hover:text-gray-400"></i></button>
             <button onclick="deletePoll(${poll.id})" class="cursor-pointer rounded-md"><i class="fas fa-trash mr-2 text-red-600 hover:text-red-700"></i></button>
          </div>
       </div>
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-sm text-gray-600 mb-6">
                        <div class="flex items-center">
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span id="date">${formatLongDateUTC(poll.createdAt)}</span>
                        </div>
                        <div class="flex items-center">
                            <svg data-replit-metadata="client/src/pages/PollDetails.tsx:148:14"
                                data-component-name="svg" class="w-4 h-4 mr-1" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path data-replit-metadata="client/src/pages/PollDetails.tsx:149:16"
                                    data-component-name="path" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z">
                                </path>
                            </svg>
                            <span id="vote">${poll.votes.length} vote${poll.votes.length > 1 ? "s" : ""}</span>
                        </div>
                        <div>
                           <i class="fa-solid text-green-600 fa-tag"></i>
                           <span>Options ${poll.options.length}</span>
                        </div>
                    </div>
                    <hr class="text-gray-200 my-4" />
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
           ${poll.options.map((option, idx) => {
            const voteCount = poll.votes.filter(vote => vote.optionIndex === idx).length;
            return (
                `<div class="flex justify-between items-center px-6 py-3 rounded flex-1 bg-blue-50">
                  <span class="text-sm">${option}</span>
                  <span class="text-blue-600 text-sm font-medium">${voteCount} votes</span>
                </div>`
            )
        }).join(``)}
        </div>
        <div class="flex items-center gap-4 mt-4">
            <a href="../poll/index.html?pollId=${poll.id}" class="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition">View Poll</a>
        </div>
    </div>`
    );
}

const deletePoll = (id) => {
    const isConfirm = confirm("Do u really want to delete the poll?");
    if (!isConfirm) {
        return false;
    }
    const polls = pollsfromLS.filter(poll => poll.id !== id);
    localStorage.setItem("polls", JSON.stringify(polls));
    location.reload();
}

const editPoll = (id) => {
    const title = document.querySelector(".modal #title");
    const description = document.querySelector(".modal #description");
    let pollIdx = undefined;
    const poll = pollsfromLS.find((poll, idx) => {
        pollIdx = idx;
        return poll.id == id;
    });
    title.value = poll.title;
    description.value = poll.description;
    console.log(poll);
    console.log(pollIdx);
    addOption();
    addOption();
    modal.addEventListener("submit", () => updatePoll(pollIdx));
}

let optionCount = 0;
const pollOptionsContainer = document.getElementById("poll-options-container");

const addOption = () => {
    optionCount++;
    const div = document.createElement("div");
    div.className = "flex items-center";
    div.innerHTML = `   <div
                            class="border-1 border-gray-200 px-4 h-8 bg-gray-100 rounded-l-lg text-gray-500 text-sm flex justify-center items-center">
                            <span>${optionCount}</span>
                        </div>
                        <input required type="text" placeholder="Option ${optionCount}"
                            class="px-4 py-2 border-1 border-gray-200 rounded-lg w-full placeholder:text-sm placeholder:text-gray-400">
                        <button
                        onclick="deleteOption(this)"
                            class="border-1 border-gray-200 cursor-pointer px-2 h-8 text-red-400  bg-red-50 hover:bg-red-100 rounded-r-lg  text-sm flex justify-center items-center">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    `;
    pollOptionsContainer.appendChild(div);
}

const deleteOption = (btn) => {
    if (optionCount === 2) {
        notyf.error("Two options are necessary.");
        return;
    }
    btn.parentElement.remove();
    optionCount--;
    for (let i = 0; i < pollOptionsContainer.children.length; i++) {
        pollOptionsContainer.children[i].children[0].children[0].textContent = i + 1;
        pollOptionsContainer.children[i].children[1].placeholder = `Option ${i + 1}`;
    }
}

const updatePoll = (idx) => {
    console.log(idx);
    event.preventDefault();
    const title = document.querySelector(".modal #title").value;
    const description = document.querySelector(".modal #description").value;
    const optionsInp = document.querySelectorAll("#poll-options-container input");
    const options = [...optionsInp].map(inp => inp.value.trim());
    const poll = pollsfromLS[idx];
    debugger;
    pollsfromLS[idx] = { ...poll, title, description, options: options, votes: [] };
    console.log(pollsfromLS[idx]);
    debugger;
    localStorage.setItem("polls", JSON.stringify(pollsfromLS));
    console.log(options);
    location.reload();
}

const main = () => {
    if (!currentUserId) {
        window.location.href = "../authentication/login/index.html";
    }
    if (!polls.length) {
        pollsContainer.innerHTML = `<p class="text-center text-gray-500 mt-4">No polls found.</p>`;
        return;
    }
    displayPolls();
}

addOptionBtn.addEventListener("click", addOption);
main();