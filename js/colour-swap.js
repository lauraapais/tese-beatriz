document.querySelectorAll('.colour-swap').forEach(container => {
    container.addEventListener('click', function (e) {
        const colourClass = e.target.dataset.colour;
        if (colourClass) {
            // Remove existing colour classes
            document.body.className = document.body.className.replace(/\bcolour-\d+/g, '');
            document.body.classList.add(colourClass);
            
            // Get all colour items within this container
            const colourItems = Array.from(container.querySelectorAll('[data-colour]'));
            const clickedIndex = colourItems.indexOf(e.target);
            
            // Determine if click was in first half or second half of items
            const totalItems = colourItems.length;
            const halfPoint = totalItems / 2; // This will be 6 for 12 items
            
            if (clickedIndex < halfPoint) {
                // First half (first 6 items)
                document.body.classList.remove('s-half');
                document.body.classList.add('f-half');
            } else {
                // Second half (last 6 items)
                document.body.classList.remove('f-half');
                document.body.classList.add('s-half');
            }
        }
    });
});