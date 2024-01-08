console.log("js")
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
async function main(){
    let songs =await getSongs();
    console.log(songs)
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

    var audio = new Audio(songs[0]);
    audio.play();
    audio.addEventListener("loadeddata",()=>{
        console.log(audio.duration,audio.currentSrc,audio.currentTime);
    })
}
main();