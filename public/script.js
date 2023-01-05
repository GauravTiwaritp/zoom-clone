var script = document.createElement("script");
script.src = "https://code.jquery.com/jquery-3.4.1.min.js";
script.type = "text/javascript";
document.getElementsByTagName("head")[0].appendChild(script);
const socket = io("/");
const peers = {};
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
myVideo.muted = false;
myVideo.width = 450;
myVideo.height = 450;
let Peer = window.Peer;
const peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "443",
});
let myVideoStream;
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    myVideoStream = stream;

    console.log(myVideoStream.audio);
    addVideoStream(myVideo, stream);
    peer.on("call", (call) => {
      call.answer(stream);
      const video1 = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video1, userVideoStream);
      });
    });
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
      scrollToBottom();
    });
  });
socket.on("user-disconnected", (userId) => {
  if (peers[userId]) peers[userId].close();
});
peer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
});

socket.on("user-connected", (userId) => {
  // Allow Self To Be Connected To Others
  console.log("User Connected: " + userId);
  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: true,
    })
    .then((stream) => {
      connectToNewUser(userId, stream);
    });
});

const connectToNewUser = (userId, stream) => {
  const call = peer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
  call.on("close", () => {
    // Other User Disconnects
    video.remove();
  });
  peers[userId] = call;
  console.log(userId);
};
const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  console.log(video.srcObject);
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.appendChild(video);
};
const scrollToBottom = () => {
  let d = $(".main_chat_window");
  d.srollTop(d.prop("scrollHeight"));
};

const Mute = document.getElementById("mute_button");
let mic_switch = true;
Mute.addEventListener("click", (e) => {
  console.log(Mute);
  console.log(e);
  myVideoStream
    .getAudioTracks()
    .forEach((track) => (track.enabled = !track.enabled));
  if (mic_switch) {
    Mute.classList.remove("fa-microphone");
    Mute.classList.add("fa-microphone-slash");
    mic_switch = !mic_switch;
  } else {
    Mute.classList.remove("fa-microphone-slash");
    Mute.classList.add("fa-microphone");
    mic_switch = !mic_switch;
  }
});

const stop_Video = document.getElementById("stop_Video");
let video_Switch = true;
stop_Video.addEventListener("click", (e) => {
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
  } else {
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
});
