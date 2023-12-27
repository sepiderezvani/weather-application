const input = document.getElementById("input")
const city = document.getElementById("city")
const cityName = document.getElementById("cityName")
const temp = document.getElementById("temp")
const main = document.getElementById("main")
const description = document.getElementById("description")
const image = document.getElementById("image")
const loading = document.getElementById("loading")
const weatherContainer = document.getElementById("weatherContainer")

citiesApi = () => {
    const xhr_city_list = new XMLHttpRequest();
    xhr_city_list.open('POST', `https://countriesnow.space/api/v0.1/countries/cities`, false)
    const obj = {country: 'iran'}
    xhr_city_list.setRequestHeader('Content-type', 'application/json')
    xhr_city_list.send(JSON.stringify(obj));
    return JSON.parse(xhr_city_list.response)['data']
}

let cities = citiesApi()

let auto_complete_list = document.getElementById("city-list-auto-complete")


function getEventTarget(e) {
    e = e || window.event;
    return e.target || e.srcElement;
}

auto_complete_list.onclick = function (event) {
    var target = getEventTarget(event);
    city.value = target.innerHTML

    // Hide List
    auto_complete_list.innerHTML = ""

    weatherUpdate(city.value)
};

city.onkeyup = () => {
    let input = city.value.toLowerCase()
    let filtered_cities = cities.filter((item) => {
        return item.toLowerCase().startsWith(input)
    })

    auto_complete_list.innerHTML = ""
    let innerElement = '';
    filtered_cities.forEach((item) => {
        innerElement += `
            <li class="list-group-item">${item}</li>
            `
    });
    auto_complete_list.innerHTML = innerElement
}

var list_item = document.getElementsByClassName("list-group-item")
var currentLI =0;

city.oninput = () => {
    auto_complete_list.style.display = "block";
    resetActiveClass();
};
city.onkeydown = (event) => {
    auto_complete_list.style.display = "block";
    // currentLI = 0;
    switch (event.keyCode) {
        case 38:
            moveActiveListItem(-1);
            break;
        case 40:
            moveActiveListItem(1);
            break;
        case 13:
            if (event.keyCode === 13) {
                if (currentLI !== -1) {
                    city.value = list_item[currentLI].innerHTML;
                    weatherUpdate(city.value)
                    auto_complete_list.style.display ="none"
                }
            }
            break;
        default : return
    }
    event.preventDefault();
};

function moveActiveListItem(direction) {
        list_item[currentLI].classList.add("active");
    currentLI = (currentLI + direction + list_item.length) % list_item.length;
    addActiveWithDelay();
}

function addActiveWithDelay() {
    setTimeout(() => {
      list_item[currentLI].classList.add("active");
        synchroniseSuggestionsBox();
    }, 100);
}
function resetActiveClass() {
    if (list_item.length > 0) {
        list_item[currentLI].classList.remove("active");
        currentLI = 0;
        setTimeout(() => {
            list_item[currentLI].classList.add("active");
            synchroniseSuggestionsBox();
        }, 100);
    }
}
function synchroniseSuggestionsBox(){
    let sBoxHeight =auto_complete_list.clientHeight;
    let sOffsetTop = list_item[currentLI].offsetTop;
    let sHeight =list_item[currentLI].clientHeight;
    if ((sOffsetTop +sHeight -auto_complete_list.scrollTop) > sBoxHeight){
        auto_complete_list.scrollTop =sOffsetTop +sHeight -sBoxHeight
    }
    else if(auto_complete_list.scrollTop > sOffsetTop){
        auto_complete_list.scrollTop =sOffsetTop
    }
}
loading.style.display="none"
weatherUpdate = (city) => {
loading.style.display ="block"
    const xhr = new XMLHttpRequest()
    xhr.open("GET", `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=cad7ec124945dcfff04e457e76760d90`);
    xhr.send();
    xhr.onload = () => {
        loading.style.display ="none"
        if (xhr.status === 404) {
            alert("place not found")
        } else {
            var data = JSON.parse(xhr.response);
            cityName.innerHTML = data.name;
            temp.innerHTML = `${Math.round(data.main.temp - 273.15)}°C`;
            main.innerHTML = data.weather[0].main;
            description.innerHTML = data.weather[0].description;
            image.src = image.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        }
    }

}
input.onsubmit = (e) => {
    e.preventDefault();
    weatherUpdate(city.value);
    city.value = ""
    auto_complete_list.style.display = "none"
}
weatherUpdate("tehran")