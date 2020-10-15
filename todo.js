editting = false;

function addEvent(){
  const myList = document.getElementById("myList");
  const newEvent = document.getElementById("newEvent");

  const li = document.createElement("li");
  li.classList.add("listEntry");
  const textEntry = document.createElement("div");
  textEntry.classList.add("textEntry");
  const text = newEvent.value;
  textEntry.append(text);
  const deleteButton = document.createElement("div");
  deleteButton.classList.add("deleteButton");
  deleteButton.innerHTML = "<img src='svgs/trash.svg'>";
  const editButton = document.createElement("div");
  editButton.classList.add("editButton");
  editButton.innerHTML = "<img src='svgs/pencil.svg'>";

  myList.appendChild(li).append(textEntry,deleteButton,editButton);

  listenDeleteEntry(deleteButton);
  listenEditEntry(editButton);

  newEvent.value = "";

  updateStorage();
}

function updateDate(){
  const date = new Date();
  const dateField = document.getElementById("date");
  const weekDays = {1:"Monday",2:"Tuesday",3:"Wednesday",4:"Thursday",5:"Friday",6:"Saturday",7:"Sunday"};
  const monthNames = {1:"January",2:"February",3:"March",4:"April",5:"May",6:"June",7:"July",8:"August",9:"September",10:"October",11:"November",12:"December"};

  var dateWeekDay = date.getDay();
  var dateDay = date.getDate();
  var dateMonth = date.getMonth();
  var dateYear = date.getFullYear();

  function dateSuffix(day){
    const strDay = day.toString();
    const lastDigit = strDay.charAt(strDay.length-1);

    if (lastDigit == 1){
      return "st";
    } else if (lastDigit == 2){
      return "nd";
    } else if (lastDigit == 3){
      return "rd";
    } else {
      return "th";
    }
  }

  dateField.innerHTML = `<h2>Today is ${weekDays[dateWeekDay]} the ${dateDay+dateSuffix(dateDay)} of ${monthNames[dateMonth+1]} ${dateYear}</h2>`;
}

function emptyList(){

  if (confirm("Are you sure you would like to delete your todo list?")){
    localStorage.clear();
    const myList = document.getElementById("myList");

    myList.innerHTML = "";
  } else {
    //pass
  }
}

function listenDeleteEntry(entry){
    entry.addEventListener("click",(event) => {
        entry.parentElement.remove();
        event.stopPropagation();
        updateStorage();
    });
}

function listenEditEntry(entry){
  entry.addEventListener("click",(event)=>{
    editting = true;
    var editField = entry.previousSibling.previousSibling;
    const oldText = editField.innerHTML;
    editField.innerHTML = `<input type='textarea' class='newEvent' id='editTextarea' value='${oldText}'>`;
    document.getElementById("editTextarea").select();
    listenEditEntryButton(editField);
  })
}

function listenEditEntryButton(entry){
  entry.addEventListener("keypress",(e)=>{
    if ((e.keyCode === 13)&&(editting===true)){
      const newText = document.getElementById("editTextarea").value;
      entry.innerHTML = newText;
      updateStorage();
      editting = false;
    }
  })
}

function pageOnLoad(){
  updateDate();
  const locationSearchField = document.getElementById("locationSearch");
  var location = "London";

  const apiWeather = `http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=9731e3dcd0c42168ed8b8bf3d795a120`;
  const apiTime = `http://worldtimeapi.org/api/timezone/Europe/${location}`;

  // add try - catch
  fetch(apiWeather).then((response)=>{
    return response.json()
  }).then((data)=>{
    var temp = parseInt(data["main"]["temp"]-273.15);
    var weather = data["weather"][0]["main"];
    var country = data["sys"]["country"].toLowerCase();
    const tempDiv = document.getElementById("temperature");
    const locDiv = document.getElementById("location");
    const weatherDiv = document.getElementById("weatherAnimation");
    const weatherBlock = document.getElementById("weatherBlock");
    const flagDiv = document.getElementById("flag");
    tempDiv.innerHTML = temp+"°C";
    locDiv.innerHTML = location;
    flagDiv.innerHTML = "<img src=https://www.countryflags.io/"+country+"/shiny/64.png>";

    body = document.body;

    if (weather === "Clouds"){
      weatherDiv.innerHTML = '<img src="svgs/clouds.svg">';
      weatherBlock.classList.remove(...weatherBlock.classList);
      weatherBlock.classList.add("cloudy");
      body.classList.add("cloudy");
      weatherBlock.classList.add("weatherBlock");
    } else if (weather === "Rain"){
      weatherDiv.innerHTML = '<img src="svgs/rain.svg">';
      weatherBlock.classList.remove(...weatherBlock.classList);
      weatherBlock.classList.add("rainy");
      body.classList.add("rainy");
      weatherBlock.classList.add("weatherBlock");
    } else if (weather === "Clear"){
      weatherDiv.innerHTML = '<img src="svgs/sun.svg">';
      weatherBlock.classList.remove(...weatherBlock.classList);
      weatherBlock.classList.add("sunny");
      body.classList.add("sunny");
      weatherBlock.classList.add("weatherBlock");
    } else if (weather === "Mist"){
      weatherDiv.innerHTML = '<img src="svgs/mist.svg">';
      weatherBlock.classList.remove(...weatherBlock.classList);
      weatherBlock.classList.add("misty");
      body.classList.add("misty");
      weatherBlock.classList.add("weatherBlock");
    } else if (weather === "snow"){
      weatherDiv.innerHTML = '<img src="svgs/snow.svg">';
      weatherBlock.classList.remove(...weatherBlock.classList);
      weatherBlock.classList.add("snowy");
      body.classList.add("snowy");
      weatherBlock.classList.add("weatherBlock");
    } else if (weather === "thunderstorm"){
      weatherDiv.innerHTML = '<img src="svgs/thunderstorm.svg">';
      weatherBlock.classList.remove(...weatherBlock.classList);
      weatherBlock.classList.add("thunderstormy");
      body.classList.add("thunderstormy");
      weatherBlock.classList.add("weatherBlock");
    } else if (weather === "drizzle"){
      weatherDiv.innerHTML = '<img src="svgs/rain.svg">';
      weatherBlock.classList.remove(...weatherBlock.classList);
      weatherBlock.classList.add("rainy");
      body.classList.add("rainy");
      weatherBlock.classList.add("weatherBlock");
    } else {
      weatherDiv.innerHTML = '<img src="svgs/mist.svg">';
      weatherBlock.classList.remove(...weatherBlock.classList);
      weatherBlock.classList.add("misty");
      body.classList.add("misty");
      weatherBlock.classList.add("weatherBlock");
    }
  })

  fetch(apiTime).then((response)=>{
    return response.json()
  }).then((data)=>{
    console.log(data);
  })

  if (!localStorage.getItem("listEntries")){
    localStorage.setItem("listEntries",[]);
  } else {
    const myList = document.getElementById("myList");
    var listEntries = localStorage.getItem("listEntries");

    listEntries = listEntries ? listEntries.split(',') : [];
    listEntries.map(function(entry){

      const li = document.createElement("li");
      li.classList.add("listEntry");
      const textEntry = document.createElement("div");
      textEntry.classList.add("textEntry");
      const text = entry;
      textEntry.append(text);
      const deleteButton = document.createElement("div");
      deleteButton.classList.add("deleteButton");
      deleteButton.innerHTML = "<img src='svgs/trash.svg'>";
      const editButton = document.createElement("div");
      editButton.classList.add("editButton");
      editButton.innerHTML = "<img src='svgs/pencil.svg'>";

      myList.appendChild(li).append(textEntry,deleteButton,editButton);

      listenDeleteEntry(deleteButton);
      listenEditEntry(editButton);
    });
  }
}

function updateStorage(){

  localStorage.clear();

  var listEntries = localStorage.getItem("listEntries");
  listEntries = listEntries ? listEntries.split(',') : [];

  const myList = document.getElementById("myList");
  const entries = Array.from(myList.children);

  entries.map((entry)=>{
    listEntries.push(entry.children[0].innerText);
    localStorage.setItem("listEntries",listEntries);
  });
}

function handleEnter(e){
  const newEvent = document.getElementById("newEvent").value;
    if ((e.keyCode === 13)&&(editting === false)&&(newEvent!=="")){
      addEvent();
    }
}

function loadWeather(){
  function updateLocation(e){
    if ((e.keyCode === 13)){
      const locationSearchField = document.getElementById("locationSearch");
      var location = locationSearchField.value;

      if (location == ""){
        location = "London";
      }

      const apiWeather = `http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=9731e3dcd0c42168ed8b8bf3d795a120`;

      // add try - catch
      fetch(apiWeather).then((response)=>{
        return response.json()
      }).then((data)=>{
        var temp = parseInt(data["main"]["temp"]-273.15);
        var weather = data["weather"][0]["main"];
        var country = data["sys"]["country"].toLowerCase();
        const tempDiv = document.getElementById("temperature");
        const locDiv = document.getElementById("location");
        const weatherDiv = document.getElementById("weatherAnimation");
        const weatherBlock = document.getElementById("weatherBlock");
        const flagDiv = document.getElementById("flag");
        tempDiv.innerHTML = temp+"°C";
        locDiv.innerHTML = location;
        flagDiv.innerHTML = "<img src=https://www.countryflags.io/"+country+"/shiny/64.png>";
        body = document.body;

        if (weather === "Clouds"){
          weatherDiv.innerHTML = '<img src="svg/clouds.svg">';
          weatherBlock.classList.remove(...weatherBlock.classList);
          body.classList.remove(...body.classList);
          weatherBlock.classList.add("cloudy");
          body.classList.add("cloudy");
          weatherBlock.classList.add("weatherBlock");
        } else if (weather === "Rain"){
          weatherDiv.innerHTML = '<img src="svgs/rain.svg">';
          weatherBlock.classList.remove(...weatherBlock.classList);
          body.classList.remove(...body.classList);
          weatherBlock.classList.add("rainy");
          body.classList.add("rainy");
          weatherBlock.classList.add("weatherBlock");
        } else if (weather === "Clear"){
          weatherDiv.innerHTML = '<img src="svgs/sun.svg">';
          weatherBlock.classList.remove(...weatherBlock.classList);
          body.classList.remove(...body.classList);
          weatherBlock.classList.add("sunny");
          body.classList.add("sunny");
          weatherBlock.classList.add("weatherBlock");
        } else if (weather === "Mist"){
          weatherDiv.innerHTML = '<img src="svgs/mist.svg">';
          weatherBlock.classList.remove(...weatherBlock.classList);
          body.classList.remove(...body.classList);
          weatherBlock.classList.add("misty");
          body.classList.add("misty");
          weatherBlock.classList.add("weatherBlock");
        } else if (weather === "snow"){
          weatherDiv.innerHTML = '<img src="svgs/snow.svg">';
          weatherBlock.classList.remove(...weatherBlock.classList);
          body.classList.remove(...body.classList);
          weatherBlock.classList.add("snowy");
          body.classList.add("snowy");
          weatherBlock.classList.add("weatherBlock");
        } else if (weather === "thunderstorm"){
          weatherDiv.innerHTML = '<img src="svgs/thunderstorm.svg">';
          weatherBlock.classList.remove(...weatherBlock.classList);
          body.classList.remove(...body.classList);
          weatherBlock.classList.add("thunderstormy");
          body.classList.add("thunderstormy");
          weatherBlock.classList.add("weatherBlock");
        } else if (weather === "drizzle"){
          weatherDiv.innerHTML = '<img src="svgs/rain.svg">';
          weatherBlock.classList.remove(...weatherBlock.classList);
          body.classList.remove(...body.classList);
          weatherBlock.classList.add("rainy");
          body.classList.add("rainy");
          weatherBlock.classList.add("weatherBlock");
        } else {
          weatherDiv.innerHTML = '<img src="svgs/mist.svg">';
          weatherBlock.classList.remove(...weatherBlock.classList);
          body.classList.remove(...body.classList);
          weatherBlock.classList.add("misty");
          body.classList.add("misty");
          weatherBlock.classList.add("weatherBlock");
        }
      })
    }
  }
  document.addEventListener("keypress",updateLocation);
}

document.getElementById("addEvent").addEventListener("click",addEvent,"false");
document.getElementById("clearList").addEventListener("click",emptyList,"false");
document.getElementById("locationSearch").addEventListener("focus",loadWeather,"false");
document.addEventListener("DOMContentLoaded",pageOnLoad);
document.addEventListener("keypress",handleEnter,"false");
