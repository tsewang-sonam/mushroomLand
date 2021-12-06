

function setFlashMessageFadeOut(flashMessageElement){
    setTimeout(() => {
        let currentOpacity = 1.0;
        let timer = setInterval(() =>{
            if(currentOpacity < 0.05){
                clearInterval(timer);
                flashMessageElement.remove();
            }
        
            currentOpacity = currentOpacity - .08;
            flashMessageElement.style.opacity = currentOpacity;
        }, 80);
    }, 3000);
}

function addFlashFromFrontEnd(message){
    let flashMessageDiv = document.createElement("div");
    let innerFlashDiv = document.createElement("div");
    let innerTextNode = document.createTextNode(message);
    innerFlashDiv.appendChild(innerTextNode);
    flashMessageDiv.appendChild(innerFlashDiv);
    flashMessageDiv.setAttribute("id", "flash-message");
    innerFlashDiv.setAttribute("class", "alert alert-info");
    document.getElementsByTagName("body")[0].appendChild(flashMessageDiv);
    setFlashMessageFadeOut(flashMessageDiv);
}

function createCard(postData){
    return `<div id ="post-${postData.id} " class = "card">
    <img class= "card-img "  src ="${postData.thumbnail}"  alt="Missing Image">
    <div class="card-body">
        <p class = "card-title"> ${postData.title} </p>
        <p class = "card-text">${postData.description} </p>
        <a href="/post/${postData.id} " class= "anchor-button">Post Detail </a>

    </div>
</div>`;
}
let flashElement = document.getElementById('flash-message');
if(flashElement){
    setFlashMessageFadeOut(flashElement);
}
function executeSearch(){
    let searchTerm = document.getElementById('search').value;
    if(!searchTerm){
        location.replace('/viewpost');
        return;
    }
    let mainContent = document.getElementById('contain-inside');
    let searchURL=`/posts/search?search=${searchTerm}`;
    fetch(searchURL)
    .then((data) => {
        return data.json();
       
    })
    .then((data_json)=>{
       let newMainContentHTML = '';
       data_json.results.forEach((row)=>{
           newMainContentHTML += createCard(row);
       })
       mainContent.innerHTML = newMainContentHTML;
       if(data_json.message){
           addFlashFromFrontEnd();
       }
    })
    .catch((err)=> console.log(err));
}
let searchButton = document.getElementById('search-button');
if(searchButton){
    searchButton.onclick = executeSearch;
}