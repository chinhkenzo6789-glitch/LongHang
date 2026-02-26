// ===== LOAD IMAGES =====
const gallery = document.getElementById("gallery");

const imageList = [
    "001.jpg","002.jpg","003.jpg","004.jpg","005.jpg",
    "006.jpg","007.jpg","008.jpg","009.jpg","010.jpg",
    "011.jpg","012.jpg","014.jpg","015.jpg","016.jpg",
    "017.jpg","018.jpg"
];

imageList.forEach(file => {
    const img = document.createElement("img");
    img.src = "assets/images/" + file;
    img.loading = "lazy";
    gallery.appendChild(img);
});


// ===== SCROLL ANIMATION =====
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
        }
    });
}, { threshold: 0.15 });

setTimeout(() => {
    document.querySelectorAll(".masonry img").forEach(img => {
        observer.observe(img);
    });
}, 300);


// ===== PREMIUM LIGHTBOX =====
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const closeBtn = document.getElementById("closeBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const counter = document.getElementById("counter");
const downloadBtn = document.getElementById("downloadBtn");

let currentIndex = 0;

function showImage(index){
    currentIndex = index;
    const fileName = imageList[index];
    const fullPath = "assets/images/" + fileName;

    lightboxImg.src = fullPath;
    counter.textContent = (index+1) + " / " + imageList.length;

    // cập nhật link tải mỗi lần đổi ảnh
    if(downloadBtn){
        downloadBtn.onclick = () => {
            const link = document.createElement("a");
            link.href = fullPath;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };
    }
}

// mở lightbox
gallery.addEventListener("click", e=>{
    if(e.target.tagName === "IMG"){
        const src = e.target.src.split("/").pop();
        currentIndex = imageList.indexOf(src);
        showImage(currentIndex);

        lightbox.style.display = "flex";
        setTimeout(()=> lightbox.classList.add("show"),10);
    }
});

// đóng
closeBtn.onclick = ()=>{
    lightbox.classList.remove("show");
    setTimeout(()=> lightbox.style.display="none",300);
};

lightbox.onclick = e=>{
    if(e.target === lightbox) closeBtn.onclick();
};

// ===== SMOOTH NEXT / PREV (IMPROVED) =====
let isAnimating = false;
const duration = 400; // 400ms đồng bộ với CSS

function nextImage(){
    if(isAnimating) return;
    isAnimating = true;

    // 1️⃣ trượt ảnh cũ sang trái
    lightboxImg.style.transition = `transform ${duration}ms cubic-bezier(.22,.61,.36,1)`;
    lightboxImg.style.transform = "translateX(-100%)";

    setTimeout(()=>{
        // 2️⃣ đổi ảnh khi ảnh cũ đã ra ngoài
        currentIndex = (currentIndex+1) % imageList.length;
        showImage(currentIndex);

        // 3️⃣ đặt ảnh mới ở bên phải (không animation)
        lightboxImg.style.transition = "none";
        lightboxImg.style.transform = "translateX(100%)";

        requestAnimationFrame(()=>{
            // 4️⃣ trượt ảnh mới vào giữa
            lightboxImg.style.transition = `transform ${duration}ms cubic-bezier(.22,.61,.36,1)`;
            lightboxImg.style.transform = "translateX(0)";
        });

    }, duration);

    setTimeout(()=>{
        isAnimating = false;
    }, duration * 2);
}

function prevImage(){
    if(isAnimating) return;
    isAnimating = true;

    // 1️⃣ trượt ảnh cũ sang phải
    lightboxImg.style.transition = `transform ${duration}ms cubic-bezier(.22,.61,.36,1)`;
    lightboxImg.style.transform = "translateX(100%)";

    setTimeout(()=>{
        // 2️⃣ đổi ảnh
        currentIndex = (currentIndex-1+imageList.length) % imageList.length;
        showImage(currentIndex);

        // 3️⃣ đặt ảnh mới bên trái
        lightboxImg.style.transition = "none";
        lightboxImg.style.transform = "translateX(-100%)";

        requestAnimationFrame(()=>{
            // 4️⃣ trượt vào giữa
            lightboxImg.style.transition = `transform ${duration}ms cubic-bezier(.22,.61,.36,1)`;
            lightboxImg.style.transform = "translateX(0)";
        });

    }, duration);

    setTimeout(()=>{
        isAnimating = false;
    }, duration * 2);
}

nextBtn.onclick = nextImage;
prevBtn.onclick = prevImage;

// phím bàn phím
document.addEventListener("keydown", e=>{
    if(lightbox.style.display === "flex"){
        if(e.key === "ArrowRight") nextImage();
        if(e.key === "ArrowLeft") prevImage();
        if(e.key === "Escape") closeBtn.onclick();
    }
});

// ===== SMOOTH SWIPE =====
let startX = 0;
let currentTranslate = 0;
let isDragging = false;

lightboxImg.addEventListener("touchstart", e=>{
    startX = e.touches[0].clientX;
    isDragging = true;
    lightbox.classList.add("swiping");
});

lightboxImg.addEventListener("touchmove", e=>{
    if(!isDragging) return;

    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;

    currentTranslate = diff;
    lightboxImg.style.transform = `translateX(${diff}px)`;
});

lightboxImg.addEventListener("touchend", ()=>{
    isDragging = false;
    lightbox.classList.remove("swiping");

    const threshold = 80;

    if(currentTranslate < -threshold){
        lightboxImg.style.transform = "translateX(-100%)";
        setTimeout(()=>{
            nextImage();
            lightboxImg.style.transform = "translateX(0)";
        },200);

    } else if(currentTranslate > threshold){
        lightboxImg.style.transform = "translateX(100%)";
        setTimeout(()=>{
            prevImage();
            lightboxImg.style.transform = "translateX(0)";
        },200);

    } else {
        lightboxImg.style.transform = "translateX(0)";
    }

    currentTranslate = 0;
});
// ===== MUSIC =====
const music = document.getElementById("bgMusic");
const toggleBtn = document.getElementById("musicToggle");

function tryPlay() {
    music.play().catch(() => {
        document.body.addEventListener("click", () => {
            music.play();
        }, { once: true });
    });
}
tryPlay();

toggleBtn.addEventListener("click", () => {
    if (music.paused) {
        music.play();
        toggleBtn.textContent = "🔊";
    } else {
        music.pause();
        toggleBtn.textContent = "🔇";
    }
});


// ===== MASONRY FIXED (CHUẨN KHÔNG LỖI) =====

function resizeMasonryItem(item){
    const grid = document.querySelector(".masonry");

    const rowHeight = parseInt(
        window.getComputedStyle(grid).getPropertyValue("grid-auto-rows")
    );

    const rowGap = parseInt(
        window.getComputedStyle(grid).getPropertyValue("gap")
    );

    const rowSpan = Math.ceil(
        (item.getBoundingClientRect().height + rowGap) /
        (rowHeight + rowGap)
    );

    item.style.gridRowEnd = "span " + rowSpan;
}

function resizeAllMasonryItems(){
    document.querySelectorAll(".masonry img").forEach(item=>{
        resizeMasonryItem(item);
    });
}

// tính khi ảnh load xong
gallery.querySelectorAll("img").forEach(img=>{
    if(img.complete){
        resizeMasonryItem(img);
    }else{
        img.onload = ()=> resizeMasonryItem(img);
    }
});

// resize lại khi đổi chiều màn hình
window.addEventListener("resize", ()=>{
    resizeAllMasonryItems();
});
// ===== SHARE BUTTON (NEW) =====
const shareBtn = document.getElementById("shareBtn");

if(shareBtn){
    shareBtn.addEventListener("click", async () => {

        const url = window.location.href;
        const title = document.title;

        if (navigator.share) {
            try {
                await navigator.share({ title: title, url: url });
            } catch {}
        } else {

            const zalo = `https://zalo.me/share?url=${encodeURIComponent(url)}`;
            const fb = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

            const choice = prompt(
`Chọn nền tảng:
1 - Zalo
2 - Facebook
3 - Sao chép liên kết`
            );

            if (choice === "1") window.open(zalo, "_blank");
            else if (choice === "2") window.open(fb, "_blank");
            else if (choice === "3") {
                navigator.clipboard.writeText(url);
                alert("Đã sao chép liên kết");
            }
        }
    });
}


// ===== FALLING ICON EFFECT =====
const container = document.createElement("div");
container.className = "fall-container";
document.body.appendChild(container);

function createIcon(){
    const icon = document.createElement("img");
    icon.src = "assets/images/icon.png";
    icon.className = "fall-icon";

    const size = Math.random() * 30 + 30;
    icon.style.width = size + "px";
    icon.style.left = Math.random() * window.innerWidth + "px";

    const duration = Math.random() * 10 + 15;
    icon.style.animationDuration = duration + "s";

    container.appendChild(icon);

    setTimeout(() => {
        icon.remove();
    }, duration * 1000);
}

setInterval(createIcon, 1500);