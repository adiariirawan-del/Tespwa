// ==== IndexedDB Setup ====
const dbName = "videoDB";
let db;

const request = indexedDB.open(dbName, 1);
request.onupgradeneeded = (e) => {
  db = e.target.result;
  db.createObjectStore("videos", { keyPath: "name" });
};
request.onsuccess = (e) => {
  db = e.target.result;
  loadVideos();
};

// ==== Upload & Save ====
const input = document.getElementById("videoInput");
const saveBtn = document.getElementById("saveBtn");
const list = document.getElementById("videoList");
const player = document.getElementById("player");

saveBtn.addEventListener("click", () => {
  const file = input.files[0];
  if (!file) return alert("Pilih video terlebih dahulu");
  const reader = new FileReader();
  reader.onload = () => {
    const tx = db.transaction("videos", "readwrite");
    tx.objectStore("videos").put({ name: file.name, data: reader.result });
    tx.oncomplete = loadVideos;
  };
  reader.readAsArrayBuffer(file);
});

function loadVideos() {
  list.innerHTML = "";
  const tx = db.transaction("videos", "readonly");
  tx.objectStore("videos").openCursor().onsuccess = (e) => {
    const cursor = e.target.result;
    if (cursor) {
      const li = document.createElement("li");
      li.textContent = cursor.key;
      li.style.cursor = "pointer";
      li.onclick = () => playVideo(cursor.key);
      list.appendChild(li);
      cursor.continue();
    }
  };
}

function playVideo(name) {
  const tx = db.transaction("videos", "readonly");
  tx.objectStore("videos").get(name).onsuccess = (e) => {
    const blob = new Blob([e.target.result.data], { type: "video/mp4" });
    player.src = URL.createObjectURL(blob);
    player.play();
  };
}

// ==== PWA Service Worker ====
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}
