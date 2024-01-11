console.log("js")
let currentSong=new Audio();
function secondsToMinutesAndSeconds(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Ensure that both minutes and seconds have two digits
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getSongs(){
    let songs = [];
    let a= await fetch("http://127.0.0.1:5500/songs/");
    let response=await a.text();
    let div=document.createElement("div");
    div.innerHTML=response;
    let as=div.getElementsByTagName('a');
    
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split("/songs/")[1]);
        }
    }
    return songs;
}
const playMusic=(track,pause=false)=>{
    // let audio=new Audio("/songs/"+track)
    currentSong.src="/songs/"+track
    if(!pause){
        currentSong.play()
        playsong.src="/images/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML=decodeURI(track)
    document.querySelector(".songtime").innerHTML=`00:00`

}
async function main(){
    
    // get list of all songs
    let songs =await getSongs();
    playMusic(songs[0],true)
    // show all songs on playlist
    let songUL=document.querySelector(".songlist").getElementsByTagName("ul")[0]
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
            console.log(e.querySelector(".info").firstElementChild.innerHTML); 
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());

        });
    });

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
}
main();