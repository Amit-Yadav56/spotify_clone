console.log("js")
let songs
let currentFolder
let currentSong=new Audio();
function secondsToMinutesAndSeconds(seconds) {
    if(isNaN(seconds)||seconds<0){
        return "00:00"
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Ensure that both minutes and seconds have two digits
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getSongs(folder){
    currentFolder=folder
    let a= await fetch(`http://127.0.0.1:5500/songs/${currentFolder}/`);
    let response=await a.text();
    let div=document.createElement("div");
    div.innerHTML=response;
    let as=div.getElementsByTagName('a');
    songs=[]
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`songs/${currentFolder}/`)[1]);
        }
    }
    let songUL=document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML= ""
    for(const song of songs){
        songUL.innerHTML = songUL.innerHTML + `<li class="flex">
                            <img src="/images/music.svg" class="invert" alt="">
                            <div class="info">
                                <div > ${song.replaceAll("%20", " ")} </div>
                                <div >ME</div>
                            </div>
                            <div class="playNow">
                                <span>Play Now</span>
                                <img src="/images/play-song.svg" class="invert" alt="">
                                
                            </div>
                        </li>`;
    }
    //attach an event listener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName('li')).forEach( e=> {
        e.addEventListener("click",element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML.trim()); 
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());

        });

    });
    return songs;
}
const playMusic=(track,pause=false)=>{
    // let audio=new Audio("/songs/"+track)
    currentSong.src=`/songs/${currentFolder}/`+track
    if(!pause){
        currentSong.play()
        playsong.src="/images/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML=decodeURI(track)
    document.querySelector(".songtime").innerHTML=`00:00/00:00`

}
async function displayAlbums(){

    let a= await fetch(`http://127.0.0.1:5500/songs/`);
    let response=await a.text();
    let cardContainer=document.querySelector(".card-container")
    let div=document.createElement("div");
    div.innerHTML=response;
    let anchors=div.getElementsByTagName("a")
    let array =Array.from(anchors)
        
    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        
    
        if(element.href.includes("/songs/")){
            let folder=(element.href.split("/").slice(-1)[0])
            //get meta data of the folder
            let a= await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
            let response=await a.json();
            console.log(response)
            cardContainer.innerHTML=cardContainer.innerHTML+`<div data-folder="${folder}" class="card m-1 p-1 round">
            <img src="../images/play-button.svg" alt="" class="play">
            <img src="/songs/${folder}/cover.jpeg" alt="" > 
            <h2>${response.title}</h2>
            <p>${response.description}</p>
        </div>`
        }  
    } 
    

    //load the library when card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click",async item=>{
            songs =await getSongs(`${item.currentTarget.dataset.folder}`);
            
        })
    })
    console.log(anchors)

}
async function main(){
    
    // get list of all songs
    songs =await getSongs('my');
    playMusic(songs[0],true)
    // show all songs on playlist
    displayAlbums()

    //Attach a event listener for prev play next
    playsong.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play()
            playsong.src="/images/pause.svg"
        }
        else{
            currentSong.pause()
            playsong.src="/images/play-song.svg"
        }
    })

    //listen for  timeupdate event
        currentSong.addEventListener("timeupdate", ()=>{
            document.querySelector(".songtime").innerHTML=`${secondsToMinutesAndSeconds(currentSong.currentTime)}/${secondsToMinutesAndSeconds(currentSong.duration)}`
            document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration)*100+"%"
        })   
    // Add an event listener to seek bar
    
        document.querySelector(".seekBar").addEventListener("click",e=>{
            let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100
            document.querySelector(".circle").style.left=percent+"%";
            currentSong.currentTime=(currentSong.duration*percent)/100
        })
    //add event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left=0
    })
    //add event listener for close button 
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left=-120+"%"
    })
    //add event event listener to previous
    prevsong.addEventListener("click",()=>{
        console.log("Previous button clicked")
        let index = songs.indexOf((currentSong.src.split("/").slice(-1))[0])
        if((index-1)>=0){
            playMusic(songs[index-1])
        }
    })
    //add event event listener to next
    nextsong.addEventListener("click",()=>{
        console.log("next button clicked")
        let index = songs.indexOf((currentSong.src.split("/").slice(-1))[0])
        if((index+1)<songs.length){
            playMusic(songs[index+1])
        }
        else{
            playMusic(songs[0])
        }
        
        
    })
    //attach an event listener to volume button
    volume.addEventListener("click",()=>{
        let volumeRangeDisplay=document.querySelector(".volumeRange");
        if(volumeRangeDisplay.style.display=="none"){

            volumeRangeDisplay.style.display="block"
        }
        else{
            volumeRangeDisplay.style.display="none"
        }

    })
    //changing volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        currentSong.volume=parseInt(e.target.value)/100
    })

    

}
main();