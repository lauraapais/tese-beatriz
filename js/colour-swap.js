document.querySelectorAll('.colour-swap').forEach(container => {
    container.addEventListener('click', function (e) {
        const colourClass = e.target.dataset.colour;
        if (colourClass) {
            document.body.className = document.body.className.replace(/\bcolour-\d+/g, '');
            document.body.classList.add(colourClass);
        }
    });
});