const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureBtn = document.getElementById('capture');
const resetBtn = document.getElementById('reset');
const filterButtons = document.querySelectorAll('.filter-btn');

let currentFilter = 'none';

// Access the device camera and stream to video element
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        video.srcObject = stream;
        video.play();
    } catch (err) {
        alert('Error accessing camera: ' + err.message);
    }
}

// Capture the current frame from the video and draw it on the canvas
function capturePhoto() {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.filter = currentFilter;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.style.display = 'block';
    video.style.display = 'none';

    // Download the image to gallery
    canvas.toBlob(function(blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'selfie.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
}

// Reset to live video stream
function resetCamera() {
    canvas.style.display = 'none';
    video.style.display = 'block';
}

// Set filter on canvas or video depending on state
function setFilter(filter) {
    currentFilter = filter;
    if (canvas.style.display === 'block') {
        const context = canvas.getContext('2d');
        // Redraw the image with new filter
        context.filter = currentFilter;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
    } else {
        video.style.filter = currentFilter;
    }
}

// Event listeners
captureBtn.addEventListener('click', capturePhoto);
resetBtn.addEventListener('click', resetCamera);

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        setFilter(button.getAttribute('data-filter'));
    });
});

// Start the camera on page load
startCamera();
