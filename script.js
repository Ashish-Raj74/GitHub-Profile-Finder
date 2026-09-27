// your code goes here
const username = document.querySelector("#username");
const searchBtn = document.querySelector("#searchBtn");
const message = document.querySelector("#message");
const profile = document.querySelector("#profile");
const repositories = document.querySelector("#repositories");
const repoTitle = document.querySelector("#repoTitle");

searchBtn.addEventListener("click", getProfile);

username.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        getProfile();
    }
});

async function getProfile() {
    const user = username.value.trim();

    if (user === "") {
        message.textContent = "Please enter a username.";
        return;
    }

    message.textContent = "Loading...";
    profile.innerHTML = "";
    repositories.innerHTML = "";
    repoTitle.textContent = "";

    try {
        const response = await fetch(`https://api.github.com/users/${user}`);

        if (!response.ok) {
            throw new Error("User not found");
        }

        const data = await response.json();

        profile.innerHTML = `
            <div class="profile-container">
                <img src="${data.avatar_url}" alt="Profile">
                <h2>${data.name || data.login}</h2>
                <p>@${data.login}</p>
                <p class="bio">${data.bio || "No bio available"}</p>

                <div class="stats">
                    <div>Followers<br>${data.followers}</div>
                    <div>Following<br>${data.following}</div>
                    <div>Repositories<br>${data.public_repos}</div>
                </div>

                <a class="visit" href="${data.html_url}" target="_blank">
                    View GitHub Profile
                </a>
            </div>
        `;

        const repoResponse = await fetch(
            `https://api.github.com/users/${user}/repos?sort=updated&per_page=6`
        );

        const repos = await repoResponse.json();

        repoTitle.textContent = "Latest Repositories";

        if(repos.length == 0){
            repoTitle.textContent = "No Public repositories found."
        }
        repos.forEach(repo => {
            repositories.innerHTML += `
                <div class="repo-card">
                    <h3>${repo.name}</h3>
                    <p>${repo.description || "No description available"}</p>
                    
                    <a class="repo-link" href="${repo.html_url}" target="_blank">
                        View Repository
                    </a>
                </div>
            `;
        });

        message.textContent = "";

    } catch (error) {
        message.textContent = "GitHub user not found.";
    }
}