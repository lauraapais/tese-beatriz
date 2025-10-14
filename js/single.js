function equalizeHeights() {
    const container = document.querySelector('.row-content.images');
    const firstImg = container.querySelector('.fill img');
    const otherImgs = container.querySelectorAll('.span-2:not(.fill) img');
    
    if (firstImg && otherImgs.length > 0) {
        const firstImgHeight = firstImg.clientHeight;
        
        otherImgs.forEach(img => {
            img.style.height = `${firstImgHeight}px`;
        });
    }
}

document.addEventListener('DOMContentLoaded', equalizeHeights);

window.addEventListener('resize', equalizeHeights);