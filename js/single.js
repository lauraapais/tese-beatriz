function equalizeHeights() {
    const container = document.querySelector('.row-content.images');
    const firstImg = container.querySelector('.fill img');
    const otherImgs = container.querySelectorAll('.span-2:not(.fill) img');
    
    if (firstImg && otherImgs.length > 0) {
        const firstImgHeight = firstImg.clientHeight;
        
        // Only apply if we have a valid height
        if (firstImgHeight > 0) {
            otherImgs.forEach(img => {
                img.style.height = `${firstImgHeight}px`;
            });
        }
    }
}

function initEqualizeHeights() {
    const container = document.querySelector('.row-content.images');
    const allImages = container.querySelectorAll('img');
    let loadedCount = 0;

    // Check if images are already loaded
    allImages.forEach(img => {
        if (img.complete) {
            loadedCount++;
        } else {
            img.addEventListener('load', () => {
                loadedCount++;
                if (loadedCount === allImages.length) {
                    equalizeHeights();
                }
            });
        }
    });

    // If all images are already loaded or no images found
    if (loadedCount === allImages.length || allImages.length === 0) {
        equalizeHeights();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initEqualizeHeights);
window.addEventListener('resize', equalizeHeights);