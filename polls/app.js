const pollsContainer = document.querySelector(".polls-container");
const polls = JSON.parse(localStorage.getItem("polls")) || [];
const searchPollInp = document.getElementById("search-poll-input");

const time = (time) => {
    return time.slice(0, 4) + time.slice(4 + 3);
}

const formatLongDateUTC = dateStr => {
    const date = new Date(dateStr);
    return date.toDateString() + " at " + time(date.toLocaleTimeString());
}

const displayPolls = (polls) => {
    pollsContainer.innerHTML = "";
    for (let poll of polls) {
        pollsContainer.innerHTML += `<div class="mx-auto bg-white p-6 rounded-xl shadow-sm border border-gray-200 mt-4">
    <h2 class="text-xl font-semibold text-gray-800">${poll.title}</h2>
    <p class="text-gray-600 mt-1">${poll.description}</p>
    <div class="flex gap-2 mt-3">
       ${poll.options.map(option => {
            return `<span class="bg-blue-100 text-blue-500 text-sm  px-3 py-1 rounded-full">${option}</span>`
        }).join("")}
    </div>
    <div class="flex justify-between items-center mt-6 flex-wrap gap-2 text-sm text-gray-500">
        <div>
            <p>Created by <span class="font-semibold text-gray-700">${poll.createdByUsername}</span></p>
            <p>${formatLongDateUTC(poll.createdAt)}</p>
        </div>

        <div class="flex items-center gap-4">
            <p class="text-gray-600">${poll.votes.length} votes</p>
            <a href="../poll/index.html?pollId=${poll.id}"
                class="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition">Vote
                Now</a>
        </div>
    </div>
</div>`;
    }
}

const searchPollsHandler = () => {
    const searchTerm = searchPollInp.value.trim().toLowerCase();
    const filteredPolls = polls.filter(poll =>
        poll.description.toLowerCase().includes(searchTerm) ||
        poll.title.toLowerCase().includes(searchTerm) ||
        poll.createdByUsername.toLowerCase().includes(searchTerm));
    return filteredPolls;
}


let timeout;
searchPollInp.addEventListener("input", () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        const polls = searchPollsHandler();
        if (!polls.length) {
            pollsContainer.innerHTML = `<p class="text-center text-gray-500 mt-4">No polls found.</p>`;
            return;
        }
        displayPolls(polls);
    }, 1000);
});


const main = () => {
    polls.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (!polls.length) {
        pollsContainer.innerHTML = `<p class="text-center text-gray-500 mt-4">No polls found.</p>`;
        return;
    }
    displayPolls(polls);
}

main();