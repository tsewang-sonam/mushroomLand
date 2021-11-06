
let counter = 0;
function remove (){
    var remove = document.getElementById();
    remove.removeChild(removeChildNodes[0])
}


function inputPics(picture, block){
    counter += 1;
   let image = document.createElement('img');
   block.innerHTML += `<img src = "${picture.url}  "  width = "200 px" heigth = "200 px"  />   `;
 
   image.onclick =fadeout;
    


function fadeout (){
    //var img = document.createElement('div');
    let opacity = Number(window.getComputedStyle(picture).getPropertyValue("opacity"));
let limit = setInterval(() => {
    if(opacity > 0){
        opacity= opacity-0.2;
        picture.style.opacity =opacity;
    }
    else{
        clearInterval(limit);
        picture.remove();
        counter = counter-1;
    }
  },20);
}
}

let block = document.getElementById('grid-container');
if(block){
    let fetchURL = "https://jsonplaceholder.typicode.com/albums/2/photos"
    fetch(fetchURL)
    .then((data) => data.json())
    .then ((photos) => {
        let innerHTML = "";
        photos.forEach((photos) => {
            inputPics(photos, block);
           
        });
        document.getElementById('counts').innerHTML = ` there is ${photos.length} photo`;
    })
}