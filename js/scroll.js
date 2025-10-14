class UniversalDragScroller {
    constructor(element) {
        this.element = element;
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;
        this.scrollLeft = 0;
        this.scrollTop = 0;
        this.velocityX = 0;
        this.velocityY = 0;
        this.lastX = 0;
        this.lastY = 0;
        this.animationId = null;
        this.wheelScrollSpeed = 1.0;
        this.smoothWheelScroll = false;

        this.init();
    }

    init() {
        // Mouse events
        this.element.addEventListener('mousedown', this.onMouseDown.bind(this));
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        document.addEventListener('mouseup', this.onMouseUp.bind(this));

        // Touch events
        this.element.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });
        document.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
        document.addEventListener('touchend', this.onTouchEnd.bind(this));

        // Wheel event
        this.element.addEventListener('wheel', this.onWheel.bind(this), { passive: false });

        // Style the element
        this.element.style.cursor = 'grab';
        this.element.style.userSelect = 'none';
        this.element.style.webkitUserSelect = 'none';
    }

    onWheel(e) {
        if (this.shouldIgnoreEvent(e)) return;

        // Stop any ongoing momentum scrolling
        this.stopMomentum();

        const deltaX = e.deltaX * this.wheelScrollSpeed;
        const deltaY = e.deltaY * this.wheelScrollSpeed;

        if (this.smoothWheelScroll) {
            this.smoothScrollBy(deltaX, deltaY);
        } else {
            this.scrollBy(deltaX, deltaY);
        }

        e.preventDefault();
    }

    scrollBy(deltaX, deltaY) {
        const currentLeft = this.getElementScrollLeft();
        const currentTop = this.getElementScrollTop();
        
        const maxScrollX = this.getMaxScrollX();
        const maxScrollY = this.getMaxScrollY();
        
        const newScrollX = Math.max(0, Math.min(maxScrollX, currentLeft + deltaX));
        const newScrollY = Math.max(0, Math.min(maxScrollY, currentTop + deltaY));
        
        this.setElementScroll(newScrollX, newScrollY);
    }

    smoothScrollBy(deltaX, deltaY) {
        const startLeft = this.getElementScrollLeft();
        const startTop = this.getElementScrollTop();
        const targetLeft = startLeft + deltaX;
        const targetTop = startTop + deltaY;
        
        const duration = 200; // milliseconds
        const startTime = performance.now();

        const animateScroll = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            
            const currentLeft = startLeft + (targetLeft - startLeft) * easeOut;
            const currentTop = startTop + (targetTop - startTop) * easeOut;
            
            this.setElementScroll(currentLeft, currentTop);
            
            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            }
        };

        requestAnimationFrame(animateScroll);
    }

    onMouseDown(e) {
        if (this.shouldIgnoreEvent(e)) return;

        this.isDragging = true;
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.scrollLeft = this.getElementScrollLeft();
        this.scrollTop = this.getElementScrollTop();
        this.lastX = e.clientX;
        this.lastY = e.clientY;
        this.velocityX = 0;
        this.velocityY = 0;
        this.hasMoved = false;

        this.stopMomentum();
        this.element.style.cursor = 'grabbing';
        e.preventDefault();
    }

    onMouseMove(e) {
        if (!this.isDragging) return;

        const moveThreshold = 3;
        const deltaX = Math.abs(this.startX - e.clientX);
        const deltaY = Math.abs(this.startY - e.clientY);

        if (deltaX > moveThreshold || deltaY > moveThreshold) {
            this.hasMoved = true;
        }

        const scrollDeltaX = this.startX - e.clientX;
        const scrollDeltaY = this.startY - e.clientY;

        this.setElementScroll(
            this.scrollLeft + scrollDeltaX,
            this.scrollTop + scrollDeltaY
        );

        this.velocityX = e.clientX - this.lastX;
        this.velocityY = e.clientY - this.lastY;
        this.lastX = e.clientX;
        this.lastY = e.clientY;

        e.preventDefault();
    }

    onMouseUp(e) {
        if (!this.isDragging) return;

        if (!this.hasMoved) {
            const clickEvent = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true,
                clientX: this.startX,
                clientY: this.startY
            });
            e.target.dispatchEvent(clickEvent);
        }

        this.isDragging = false;
        this.element.style.cursor = 'grab';

        if (Math.abs(this.velocityX) > 1 || Math.abs(this.velocityY) > 1) {
            this.startMomentum();
        }
    }

    onTouchStart(e) {
        if (this.shouldIgnoreEvent(e)) return;

        this.isDragging = true;
        this.startX = e.touches[0].clientX;
        this.startY = e.touches[0].clientY;
        this.scrollLeft = this.getElementScrollLeft();
        this.scrollTop = this.getElementScrollTop();
        this.lastX = e.touches[0].clientX;
        this.lastY = e.touches[0].clientY;
        this.velocityX = 0;
        this.velocityY = 0;
        this.hasMoved = false;

        this.stopMomentum();
        e.preventDefault();
    }

    onTouchMove(e) {
        if (!this.isDragging) return;

        const moveThreshold = 3;
        const deltaX = Math.abs(this.startX - e.touches[0].clientX);
        const deltaY = Math.abs(this.startY - e.touches[0].clientY);

        if (deltaX > moveThreshold || deltaY > moveThreshold) {
            this.hasMoved = true;
        }

        const scrollDeltaX = this.startX - e.touches[0].clientX;
        const scrollDeltaY = this.startY - e.touches[0].clientY;

        this.setElementScroll(
            this.scrollLeft + scrollDeltaX,
            this.scrollTop + scrollDeltaY
        );

        this.velocityX = e.touches[0].clientX - this.lastX;
        this.velocityY = e.touches[0].clientY - this.lastY;
        this.lastX = e.touches[0].clientX;
        this.lastY = e.touches[0].clientY;

        e.preventDefault();
    }

    onTouchEnd(e) {
        if (!this.isDragging) return;

        if (!this.hasMoved && e.changedTouches && e.changedTouches[0]) {
            const touch = e.changedTouches[0];
            const clickEvent = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true,
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            e.target.dispatchEvent(clickEvent);
        }

        this.isDragging = false;

        if (Math.abs(this.velocityX) > 1 || Math.abs(this.velocityY) > 1) {
            this.startMomentum();
        }
    }

    getElementScrollLeft() {
        // Handle both window and regular elements
        if (this.element === document.body || this.element === document.documentElement) {
            return window.pageXOffset;
        }
        return this.element.scrollLeft;
    }

    getElementScrollTop() {
        // Handle both window and regular elements
        if (this.element === document.body || this.element === document.documentElement) {
            return window.pageYOffset;
        }
        return this.element.scrollTop;
    }

    setElementScroll(left, top) {
        // Handle both window and regular elements
        if (this.element === document.body || this.element === document.documentElement) {
            window.scrollTo(left, top);
        } else {
            this.element.scrollLeft = left;
            this.element.scrollTop = top;
        }
    }

    startMomentum() {
        const friction = 0.94;

        const animate = () => {
            this.velocityX *= friction;
            this.velocityY *= friction;

            const currentLeft = this.getElementScrollLeft();
            const currentTop = this.getElementScrollTop();

            const newScrollX = currentLeft - this.velocityX;
            const newScrollY = currentTop - this.velocityY;

            // Check boundaries
            const maxScrollX = this.getMaxScrollX();
            const maxScrollY = this.getMaxScrollY();

            const boundedX = Math.max(0, Math.min(maxScrollX, newScrollX));
            const boundedY = Math.max(0, Math.min(maxScrollY, newScrollY));

            this.setElementScroll(boundedX, boundedY);

            // Continue if still moving
            if ((Math.abs(this.velocityX) > 0.1 || Math.abs(this.velocityY) > 0.1) &&
                boundedX > 0 && boundedX < maxScrollX &&
                boundedY > 0 && boundedY < maxScrollY) {
                this.animationId = requestAnimationFrame(animate);
            }
        };

        this.animationId = requestAnimationFrame(animate);
    }

    getMaxScrollX() {
        if (this.element === document.body || this.element === document.documentElement) {
            return document.documentElement.scrollWidth - window.innerWidth;
        }
        return this.element.scrollWidth - this.element.clientWidth;
    }

    getMaxScrollY() {
        if (this.element === document.body || this.element === document.documentElement) {
            return document.documentElement.scrollHeight - window.innerHeight;
        }
        return this.element.scrollHeight - this.element.clientHeight;
    }

    stopMomentum() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    shouldIgnoreEvent(e) {
        const interactiveTags = ['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT'];
        return interactiveTags.includes(e.target.tagName) || e.target.isContentEditable;
    }
}

new UniversalDragScroller(document.body);
new UniversalDragScroller(document.querySelector('main'));