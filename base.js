let page = 1;
let h = document.getElementById("error");
let firstSearch = false;
let text ="";
let tags ="";
let pageNum = document.getElementById("pageNumber");

let picturePerPage;

const protocol = "https://";

document.getElementById("srcButton").addEventListener("click", function () {
    CreateSearchURL();
});
document.getElementById("per_page").addEventListener("click", function () {
    if (document.getElementById("per_page").value != picturePerPage) {
        CreateSearchURL();
    }

});
document.getElementById("pageSubmit").addEventListener("click", function () {
    CreateSearchURL();
});



function BackVisible() {
    if (page == 1) {

        document.getElementsByClassName("page")[0].style.display = "none";

    } else if (page > 1) {

        document.getElementsByClassName("page")[0].style.display = "inline";
    }

}

document.getElementById("buttonBack").addEventListener("click", async function () {
    if (page > 1) {
        page--;
        await CreateSearchURL();

        BackVisible();
    }
});

document.getElementById("buttonNext").addEventListener("click", async function () {
    page++;
    await CreateSearchURL();
});


let currentPics = document.getElementById("pics");

let lightbox = document.createElement("div");
lightbox.id = "lightbox";
document.body.appendChild(lightbox);

lightbox.addEventListener("click", x => {
    if (x.target != x.currentTarget) {
        return
    } else {
        lightbox.classList.remove("show");
    }
});

async function CreateSearchURL() {

    picturePerPage = document.getElementById("per_page").value;

    let firstPart = "api.flickr.com/services/rest?method=flickr.photos.search&api_key=4a49c401238a5b79de8fa229859d0ed2&text="

    if (text != document.getElementById("input").value) {
        page = 1;
    }
    text = document.getElementById("input").value;

    tags = SearchTags();

    const curPage = "&page=" + page;
    let lastPart = "&per_page=" + picturePerPage + "&sort=relevance&format=json&nojsoncallback=1";

    const finalPart = protocol + firstPart + text + tags + curPage + lastPart;

    await SearchPics(finalPart);
}


function PicPages(data) {
    BackVisible();

    if (data.photos.pages == page || data.photos.pages == 0) {

        document.getElementsByClassName("page")[1].style.display = "none";
    } else {

        document.getElementsByClassName("page")[1].style.display = "inline";
    }
}

async function SearchPics(URL) {

    const result = await fetch(URL);

    const data = await result.json();

    while (currentPics.firstChild) {
        currentPics.removeChild(currentPics.firstChild);
    }

    if (text == "" && tags == "&tags=") {

        h.innerText = "Both your search boxes can't be blank!";
        
        h.style.display = "inline";
        BackVisible();
        document.getElementsByClassName("page")[1].style.display = "none";
        pageNum.style.display = "none";

    }
    

    else {

        console.log(text + tags);

        if (data.photos.total == 0) {
            h.innerText = "There are no pictures referred to your specified search";
            h.style.display = "inline";
            document.getElementsByClassName("page")[1].style.display = "none";
            pageNum.style.display = "none";
        }

       else{ h.style.display = "none"
        BackVisible();
    

        for (let pics of data.photos.photo) {
            const serverID = pics.server;
            const photoID = pics.id;
            const secret = pics.secret;
            const farm = pics.farm;
            const size = "q";
            let img = document.createElement("img");
            img.src = `https://farm${farm}.staticflickr.com/${serverID}/${photoID}_${secret}_${size}.jpg`;
            const src = document.getElementById("pics");
            img.addEventListener("click", x => {
                lightbox.classList.add("show");
                let image = document.createElement("img");

                image.src = img.src.slice(0, -6);
                image.src += ".jpg";
                console.log(image.src);
                while (lightbox.firstChild) {
                    lightbox.removeChild(lightbox.firstChild);
                }
                lightbox.appendChild(image);
            })
            src.appendChild(img);

        }

        PicPages(data);
        firstSearch = true;
        pageNum = document.getElementById("pageNumber");
        pageNum.style.display = "block";
        pageNum.innerHTML = "Page:" + page;
    }
}}


function SearchTags() {

    let tags = document.getElementById("tags").value + "";

    const splitTags = tags.split(" ");

    let comTag = "&tags="

    for (let i = 0; i < splitTags.length; i++) {

        if (i < splitTags.length - 1) {
            comTag += splitTags[i] + ",";
        } else {
            comTag += splitTags[i]
        }

    }

    return comTag;
}