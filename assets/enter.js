document.addEventListener('DOMContentLoaded', function() {
    const enterButton = document.getElementById('enter');
    const overlay = document.getElementById('overlay');
    const backgroundMusic = document.getElementById('music');

    overlay.style.display = 'flex';

    enterButton.addEventListener('click', function() {
        backgroundMusic.play();

        overlay.style.opacity = '0';
        overlay.style.visibility = 'hidden';

        setTimeout(() => {
            overlay.style.display = 'none';
        }, 500);
    });
});
