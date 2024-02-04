const projects = [
    {id:1, name:"The Top 11 IDEs for Embedded Applications", image:"1.jpg", desc:"", price:3500, category:1},
    {id:2, name:"Only NAND Flash Meets the Data-Driven Demands of Next-Gen AVs and EVs", image:"2.jpg", desc:"", price:2500, category:4},
    {id:3, name:"Driving the Green Revolution in Transportation", image:"3.jpg", desc:"", price:1500, category:2},
    {id:4, name:"My Hands-On Trial Run with Jetson AGX Orin", image:"4.jpg", desc:"", price:4000, category:1},
    {id:5, name:"Moving from Domains to Zones: The Auto Architecture Revolution", image:"5.jpg", desc:"", price:2500, category:2},
    {id:6, name:"Working with High-Level-Language Debuggers in RISC-V", image:"6.jpg", desc:"", price:5000, category:3},
    {id:7, name:"How to Successfully Connect and Disconnect a Supply Voltage Line", image:"1.jpg", desc:"", price:6500, category:3},
    {id:8, name:"Secure Automotive Ethernet Switch Adds Lockstep Dual-Core", image:"2.jpg", desc:"", price:2500, category:4},
    {id:9, name:"Meeting Space-Grade Requirements for Mission Critical", image:"3.jpg", desc:"", price:1500, category:2},
    {id:10, name:"The Most Frequently Asked MIPI I3C Questions—Answered", image:"4.jpg", desc:"", price:3000, category:3},
    {id:11, name:"Meeting Space-Grade Requirements for Mission Critical", image:"5.jpg", desc:"", price:1500, category:2},
    {id:12, name:"The Most Frequently Asked MIPI I3C Questions—Answered", image:"6.jpg", desc:"", price:3000, category:3},
]

const course = {
    title:"Sio kila demu unae mkuta beach ni bitch, kila mganga ni whitch",
    thumb:"5.jpg",
    data:[
      {cover:"5.jpg",video:"video4.mp4",source:"https://archive.org/download/78_jailhouse-rock_elvis-presley-jerry-leiber-mike-stoller_gbia0080595b/Jailhouse%20Rock%20-%20Elvis%20Presley%20-%20Jerry%20Leiber-restored.mp3",label:"Episode 1",title:"Utangulizi wa kozi hii"},
      {cover:"5.jpg",video:"video2.mp4",source:"https://archive.org/download/1MyHeartWillGoOnLoveThemeFromTitanic/1%20-%20My%20Heart%20Will%20Go%20On%20%28Love%20Theme%20from%20_Titanic_%29.mp3",label:"Episode 2",title:"Anza kwa maelekezo"},
      {cover:"5.jpg",video:"video3.mp4",source:"https://archive.org/download/tntvillage_323140/John%20Lennon%20-%20Imagine/01%20Imagine.mp3",label:"Episode 3",title:"Fatilia kozihii kwa umakini"},
      {cover:"5.jpg",video:"video4.mp4",source:"https://archive.org/download/TakeMeHomeCountryRoad/JohnDenver-TakeMeHomeCountryRoad.mp3",label:"Episode 4",title:"Kama utaki acha"},
      {cover:"5.jpg",video:"video1.mp4",source:"https://archive.org/download/01.TheFinalCountdown/01.%20The%20Final%20Countdown.mp3",label:"Episode 5",title:"Nenda beach kigamboni"},
      {cover:"5.jpg",video:"video2.mp4",source:"https://archive.org/download/OldPop_256/VillagePeople-Y.m.c.a.mp3",label:"Episode 6",title:"Ukashangae pisi"},
      {cover:"5.jpg",video:"video3.mp4",source:"https://archive.org/download/tntvillage_323140/John%20Lennon%20-%20Imagine/01%20Imagine.mp3",label:"Episode 7",title:"Ukitoka salama shkuru"}
    ]

}

var userInfo = {isLoged:false,user:{}}

var upload_path = "../new_forum/public"
//var upload_path = "/home/akildtvw/akiliforum/uploads"

module.exports = {projects, course, userInfo, upload_path }