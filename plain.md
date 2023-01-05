# plan of action

- initialize our nodejs project
- initialize our first view
- create a room id
- add the ability to view our own video
- add ability to allow others to stream their own video
- add styling
- add abilty to create message
- add mute button
- add stop video button

//backup
const peerServer = ExpressPeerServer(server, {
debug: true,
});
app.use("/peerjs", peerServer);

//backup1
document.addEventListener("keydown", (e) => {
if (e.code == 13) {
if (msg) {
//alert(e.);
console.log(msg);
socket.emit("message", msg.value());
msg.value(" ");
} else {
console.log("galat");
console.log(msg);
}
}
let text = $("input");
$("html").keydown((e) => {
if (e.which == 13 && text.val().length != 0) {
console.log(text.val());
socket.emit("message", text.val());
text.val(" ");
}
});
socket.on("createMessage", (message) => {
$("ul").append(`<li class="message"><b>user</b><br>${message}</li>`);
});

const muteUnmute = () => {
console.log(myVideoStream);
const enabled = myVideoStream.getAudioTracks()[0].enabled;
if (enabled) {
myVideoStream.getAudioTracks()[0].enabled = false;
setUnmuteButton();
} else {
setMuteButton();
myVideoStream.getAudioTracks()[0].enabled = true;
}
};

const setMuteButton = () => {
const html = `<span> <i class=" main_mute_button"></i> MUTE</span>`;
document.querySelector(".unmute fas fa-microphone-slash").innerHTML = html;
};
const setUnmuteButton = () => {
const html = `<span> <i class="main_mute_button"></i> MUTE</span>`;
document.querySelector(".fas fa-microphone").innerHTML = html;
};
};
