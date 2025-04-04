// Start button event
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
        p.style.display = 'none';
    });
    const page = document.getElementById(pageId);
    page.style.display = 'block';
    setTimeout(() => page.classList.add('active'), 50);
}

document.getElementById("startButton").addEventListener("click", function() {
    showPage("cameraPage");
    startCamera();
});

// Camera setup
const video = document.getElementById("camera");
const canvas = document.getElementById("canvas");
const captureButton = document.getElementById("captureButton");
const mirrorToggle = document.getElementById("mirrorToggleButton");
let isMirrored = false;
let selectedFilter = "none";

async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
    } catch (error) {
        console.error("Error accessing the camera: ", error);
    }
}

// Mirror toggle
mirrorToggle.addEventListener("click", function() {
    isMirrored = !isMirrored;
    video.style.transform = isMirrored ? "scaleX(-1)" : "scaleX(1)";
});

// Capture photo
captureButton.addEventListener("click", function() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");

    if (isMirrored) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const photoData = canvas.toDataURL("image/png");
    showFilterPage(photoData);
});

// Filter selection
function showFilterPage(photoData) {
    showPage("filterPage");
    const filterImage = document.getElementById("filterImage");
    filterImage.src = photoData;
    filterImage.style.filter = selectedFilter;
    window.photoData = photoData;
}

function applyFilter(filter) {
    selectedFilter = filter;
    document.getElementById("filterImage").style.filter = filter;
}

function confirmFilter() {
    const filterImage = document.getElementById("filterImage");
    const finalCanvas = document.createElement("canvas");
    const ctx = finalCanvas.getContext("2d");
    finalCanvas.width = filterImage.width;
    finalCanvas.height = filterImage.height;

    ctx.filter = selectedFilter;
    ctx.drawImage(filterImage, 0, 0);

    const finalPhotoURL = finalCanvas.toDataURL("image/png");
    showTemplatePage(finalPhotoURL);
}

// Template selection
function showTemplatePage(photoData) {
    showPage("templatePage");
    window.photoData = photoData;
}

function applyTemplate(templateId) {
    let finalImage = new Image();
    finalImage.src = window.photoData;

    finalImage.onload = function() {
        const finalCanvas = document.createElement("canvas");
        const ctx = finalCanvas.getContext("2d");
        finalCanvas.width = finalImage.width;
        finalCanvas.height = finalImage.height;

        ctx.filter = selectedFilter;
        ctx.drawImage(finalImage, 0, 0);

        const finalPhotoURL = finalCanvas.toDataURL("image/png");
        showDownloadPage(finalPhotoURL);
    };
}

// Show Download Page
function showDownloadPage(finalPhotoURL) {
    showPage("downloadPage");
    document.getElementById("finalPhoto").src = finalPhotoURL;
}

// Download photo
document.getElementById("downloadButton").addEventListener("click", function() {
    const finalPhoto = document.getElementById("finalPhoto");
    const link = document.createElement("a");
    link.href = finalPhoto.src;
    link.download = "photobooth.png";
    link.click();
});

// Load the click sound
const clickSound = new Audio("click-sound.mp3"); // Add your click sound file
