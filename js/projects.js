async function getMorgRepos() {
    try {
        // grabbing github data
        const res = await fetch (`https://api.github.com/users/knighmor/repos`);
        const data = await res.json();
        data.sort((a, b) => a.id - b.id);

        // collecting latest five projects
        const latestFive = data.slice(Math.max(data.length - 5, 0));
        console.log(latestFive);

        // defining the content element
        const Content = document.getElementById('content');

        // hopefully creating the entries
       const RenderItem = latestFive.forEach((i, content) => {
            const Project = document.createElement('section');
            const Header = document.createElement('h2');
            const HeaderLink = document.createElement('a');
            const BippyBox = document.createElement('ul');
            const DateCreatedUpdated = document.createElement('li');
            const Commits = document.createElement('li');
            const subCommit = document.createElement('a');
            const LanguagesUsed = document.createElement('li');
            const Details = document.createElement('p');

            // creating the section container
            Project.className = 'section';
            Project.id = `project-${i.id}`;

            // creating details container
            BippyBox.id = `project-${i.id}-details`;
            BippyBox.className = `details`;

            // filling HeaderLink
            HeaderLink.innerText = i.name;
            HeaderLink.title = i.name;
            HeaderLink.href = i.html_url;
            HeaderLink.className = `head-link`;

            // filling Date Created
            const Date1 = `Date Created: `;
            const Date2 = i.created_at.split("T")[0];
            const DateCreated = Date1.concat(Date2);

            // filling and adding Date Updated
            const Date3 = `Last Updated: `;
            const Date4 = i.updated_at.split("T")[0];
            const DateUpdated = Date3.concat(Date4);
            DateCreatedUpdated.innerText = DateCreated.concat(`, `, DateUpdated);
            DateCreatedUpdated.className = `dates`;

            //#region -- Number of Commits/Most Recent Commit Area
            async function GetCommitBullshit() {
                try {
                    const url = i.commits_url.split("{")[0];
                    const res = await fetch(url);
                    const commits = await res.json();

                    let Commit1 = function() {
                        let count = 0;
                        commits.forEach((i) => (
                            i.author.login === 'knighmor' && count++
                            ));
                        return count;
                    };

                    let myCommits = commits.filter(i => i.author.login === 'knighmor').sort();
                    let mostRecentCommit = myCommits[0];

                    subCommit.innerText = mostRecentCommit.commit.author.date.split("T")[0];
                    subCommit.href = mostRecentCommit.html_url;

                    Commits.innerText = `Number of Morgaine's Commits: `.concat(Commit1()).concat(`, Most Recent Commit: `);
                    Commits.className = `commits`;
                    Commits.appendChild(subCommit);

                }
                catch (error) {
                    console.error(error);
                }
            }
            GetCommitBullshit(); 
            //#endregion

            //#region -- Languages Used retrieval and creation function
            async function getLanguagesUsed() {
                try {
                    const res = await fetch(i.languages_url);
                    const languages = await res.json();
                    
                    const languages1 = `Coding Languages Used: `;
                    LanguagesUsed.innerText = languages1.concat(Object.keys(languages).join(`, `));
                    LanguagesUsed.className = `languages`;
                }
                catch (error) {
                    console.error(error);
                }
            }
            getLanguagesUsed();
            //#endregion

            // filling Details
            Details.innerText = i.description;
            Details.className = `description`;

            // putting it all together
            Project.appendChild(Header);
            Header.appendChild(HeaderLink);
            Project.appendChild(BippyBox);
            BippyBox.appendChild(DateCreatedUpdated);
            BippyBox.appendChild(LanguagesUsed);
            BippyBox.appendChild(Commits);
            Project.appendChild(Details);

            Content.appendChild(Project);
        }) 

    }
    catch (error) {
        console.error(error);
    }
}

getMorgRepos();