document.addEventListener('DOMContentLoaded', function() {
    const loadingScreen = document.querySelector('.loading-screen');
    const progressBar = document.querySelector('.loading-progress');
    const resources = window.performance.getEntriesByType('resource');
    const totalResources = resources.length;
    let loadedResources = 0;
    
    function updateProgress() {
        loadedResources++;
        const progressPercent = Math.min(Math.round((loadedResources / totalResources) * 100), 100);
        
        progressBar.style.width = `${progressPercent}%`;
        
        if (progressPercent === 100) {
            completeLoading();
        }
    }
    
    function completeLoading() {
        progressBar.style.width = '100%';
        loadingScreen.style.opacity = '0';
        console.log("HERE");
        
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
    
    if (document.readyState === 'complete') {
        completeLoading();
    } else {
        window.addEventListener('load', completeLoading);
        document.querySelectorAll('img').forEach(img => {
            if (img.complete) {
                updateProgress();
            } else {
                img.addEventListener('load', updateProgress);
                img.addEventListener('error', updateProgress);
            }
        });
    }
});