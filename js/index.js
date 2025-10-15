
// BACKGROUND GRID
function createGridItems() {
    const groups = document.querySelectorAll('main .group');
    const groupCount = groups.length;
    document.body.style.setProperty('--n-columns', groupCount);

    const gridColumns = document.querySelector('#default-grid .grid-columns');
    gridColumns.innerHTML = '';
    for (let i = 0; i < groupCount; i++) {
        const item = document.createElement('div');
        item.className = 'item';
        gridColumns.appendChild(item);
    }
}
// VISUALIZATION OPTIONS
function setupVisualizationOptions() {
    const options = document.querySelectorAll('#visualization .option');

    options.forEach(option => {
        option.addEventListener('click', function () {
            const modeType = this.getAttribute('data-type');
            document.body.classList.remove('mode-list', 'mode-catalog', 'mode-panoram');
            document.body.classList.add(`mode-${modeType}`);
            options.forEach(opt => opt.classList.remove('active'));
            document.getElementById("container").style.removeProperty('width');
            this.classList.add('active');
            equalizeTitleHeights();
        });
    });
}
// ZOOM IN PANORAM
function simpleZoomOutThenIn() {
    const main = document.querySelector('main');
    const container = document.getElementById('container');

    main.scrollLeft = (main.scrollWidth - main.clientWidth) / 2;
    main.scrollTop = (main.scrollHeight - main.clientHeight) / 2;

    const zoomLevelX = main.clientWidth / container.scrollWidth;
    const zoomLevelY = main.clientHeight / container.scrollHeight;
    const zoomOutLevel = Math.min(zoomLevelX, zoomLevelY);

    container.style.transform = `scale(${zoomOutLevel})`;
    container.style.transformOrigin = 'center center';

    setTimeout(() => {
        container.style.transition = 'transform 1.5s ease-out';
        container.style.transform = 'scale(1)';
    }, 1000);
}
// SEARCH OPTIONS
function setupTypeOptions() {
    const typeSpans = document.querySelectorAll('.item-type');
    
    typeSpans.forEach(span => {
        span.addEventListener('click', function() {
            typeSpans.forEach(s => s.classList.remove('active'));
            this.classList.add('active');
        });
    });
}
// SEARCH INPUT FOCUS
function setupInputBlur() {
    const searchItem = document.getElementById('search');
    const input = searchItem.querySelector('input[name="content"]');
    
    document.addEventListener('click', function(e) {
        if (!searchItem.contains(e.target)) {
            input.blur();
        }
    });
}
// TITLE HEIGHT
function equalizeTitleHeights() {
    const titles = document.querySelectorAll('#container .group .title');
    if (titles.length === 0) return;
    titles.forEach(title => title.style.height = 'auto');
    const maxHeight = Math.max(...Array.from(titles).map(title => title.offsetHeight));
    titles.forEach(title => {
        title.style.height = `${maxHeight}px`;
    });
}
// CONTAINER WIDTH
async function adjustContainerWidthPrecise() {
    const container = document.querySelector('.mode-panoram #container');
    const mainElement = document.querySelector('main'); // Adjust selector as needed
    const groups = container.querySelectorAll('.group');
    
    if (!mainElement || groups.length === 0) return;
    
    // Reset container width to measure natural dimensions
    container.style.width = '';
    
    // Get main element's aspect ratio
    const mainRect = mainElement.getBoundingClientRect();
    const mainAspectRatio = mainRect.width / mainRect.height;
    
    // Calculate group dimensions
    let totalGroupWidth = 0;
    let maxGroupHeight = 0;
    
    groups.forEach(group => {
        const rect = group.getBoundingClientRect();
        totalGroupWidth += rect.width;
        maxGroupHeight = Math.max(maxGroupHeight, rect.height);
    });
    
    // Get container styles for gaps
    const containerStyle = window.getComputedStyle(container);
    const gap = parseFloat(containerStyle.gap) || 0;
    
    // Calculate current layout
    const containerRect = container.getBoundingClientRect();
    const availableWidth = containerRect.width;
    const averageGroupWidth = totalGroupWidth / groups.length;
    
    // Estimate how many groups fit per row
    const groupsPerRow = Math.max(1, Math.floor((availableWidth + gap) / (averageGroupWidth + gap)));
    const numberOfRows = Math.ceil(groups.length / groupsPerRow);
    
    // Calculate total height with gaps
    const totalHeight = numberOfRows * maxGroupHeight + Math.max(0, numberOfRows - 1) * gap;
    
    // Calculate target width based on main element's aspect ratio
    const targetWidth = totalHeight * mainAspectRatio;
    
    // Apply the calculated width
    container.style.width = `${targetWidth}px`;
}
// CLICK GROUPS URL
// Keep track of your drag scroller instances
const dragScrollers = [];

function setupGroupClicks() {
    const groups = document.querySelectorAll('.group');
    
    groups.forEach(group => {
        group.addEventListener('click', function(e) {
            // Check if any drag scroller has moved
            const wasDragging = dragScrollers.some(scroller => scroller.hasMoved);
            
            if (wasDragging) {
                e.preventDefault();
                e.stopPropagation();
                // Reset the drag state for all scrollers
                dragScrollers.forEach(scroller => scroller.hasMoved = false);
                return;
            }
            
            const url = this.getAttribute('data-href');
            if (url) {
                window.location.href = url;
            }
        });
    });
}

// Initialize your drag scrollers and store references
document.addEventListener('DOMContentLoaded', function() {
    dragScrollers.push(new UniversalDragScroller(document.body));
    dragScrollers.push(new UniversalDragScroller(document.querySelector('main')));
    setupGroupClicks();
});

// EVENTS
window.addEventListener('load', async function(){
    createGridItems();
    setupVisualizationOptions();
    setupInputBlur();
    setupTypeOptions();
    equalizeTitleHeights();
    await adjustContainerWidthPrecise();
    simpleZoomOutThenIn();
});

window.addEventListener('resize', function() {
    adjustContainerWidthPrecise();
    equalizeTitleHeights();
});