const polls = JSON.parse(localStorage.getItem("polls")) || [];
const optionsContainer = document.getElementById("poll-options");
const submitVoteBtn = document.getElementById("submit-vote-btn");
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const notyf = new Notyf();
const pollVotes = document.getElementById("poll-votes");
const pollResults = document.getElementById("poll-results");
let pollIdx = undefined;

const getPollId = () => {
    const params = new URLSearchParams(location.search);
    return params.get("pollId");
}

const formatLongDateUTC = dateStr => {
    const date = new Date(dateStr);
    return date.toDateString() + " at " + date.toLocaleTimeString();
}

const findPollById = () => {
    const pollId = getPollId();
    return polls.find((poll, idx) => {
        pollIdx = idx;
        return poll.id == pollId;
    });
}

const isVoted = () => {
    const poll = findPollById();
    return poll.votes.some(vote => vote.userId === currentUser.id);
}

const displayPoll = () => {
    const poll = findPollById();
    document.getElementById("poll-title").innerHTML = poll.title;
    document.getElementById("poll-desc").innerHTML = poll.description;
    document.getElementById("username").textContent = poll.createdByUsername;
    document.getElementById("date").textContent = formatLongDateUTC(poll.createdAt);
    document.getElementById("vote").textContent = `${poll.votes.length} votes`;
    if (isVoted()) {
        pollResults.classList.remove("hidden");
        pollVotes.classList.add("hidden");
        pollResult();
    } else {
        pollVotes.classList.remove("hidden");
        pollResults.classList.add("hidden");
        displayPollsOptions();
    }
}

const displayPollsOptions = () => {
    console.log("displayPollsOptions called.")
    const options = findPollById().options;
    options.forEach(option => {
        optionsContainer.innerHTML += `
        <label class="block p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
            <div class="flex items-center">
                <input type="radio" name="poll-option" class="poll-option form-radio h-4 w-4 text-blue-500">
                <span class="ml-3">${option}</span>
            </div>
        </label>`;
    });
}

const pollResult = () => {
    console.log("pollResult called.")
    const poll = findPollById();
    const pollResultsContainer = document.getElementById("poll-results-container");
    pollResultsContainer.innerHTML = "";
    poll.options.forEach((option, idx) => {
        const voteCount = poll.votes.filter(vote => vote.optionIndex === idx).length;
        const votePercentage = Math.round((voteCount / poll.votes.length) * 100);;
        pollResultsContainer.innerHTML += `
         <div class="border-1 border-gray-200 rounded-lg p-4">
                                    <div class="flex justify-between">
                                        <p class="font-semibold text-blue-500">${option}</p>
                                        <div class="space-x-2">
                                            <span class="text-gray-600 text-sm">${voteCount > 1 ? voteCount + " votes" : voteCount + " vote"}</span>
                                            <span
                                                class="text-blue-600 font-semibold px-2 py-1 bg-blue-100 text-sm rounded">${votePercentage}%</span>
                                        </div>
                                    </div>
                                    <div class="w-full bg-gray-200 h-2 mt-2 rounded-full">
                                        <div class="bg-blue-500 h-2 rounded-full w-[${votePercentage}%]"></div>
                                    </div>
         </div>
   `;
    });
}


const submitVote = () => {
    const options = document.querySelectorAll(".poll-option");
    const msg = document.getElementById("msg");
    const selectedOption = [...options].findIndex(opt => opt.checked);
    if (selectedOption === -1) {
        msg.classList.remove("hidden");
        return;
    }
    msg.classList.remove("hidden");
    msg.innerHTML = `<div class="flex items-center gap-2 bg-green-50 p-4 rounded-lg">
                        <div class="border-green-500 w-7 h-7 flex justify-center border-2 items-center rounded-full mr-2">
                            <i class="fa-solid fa-check text-green-500"></i>
                        </div>
                        <p class="text-green-600">Thank you for voting!</p>
                    </div>`;
    const vote = { userId: currentUser.id, optionIndex: selectedOption };
    polls[pollIdx].votes.push(vote);
    localStorage.setItem("polls", JSON.stringify(polls));
    pollResults.classList.remove("hidden");
    pollVotes.classList.add("hidden");
    pollResult();
}

submitVoteBtn.addEventListener("click", submitVote);
displayPoll();