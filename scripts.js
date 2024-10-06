document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');

    hamburger.addEventListener('click', function() {
        nav.classList.toggle('active');
    });
});
document.addEventListener('DOMContentLoaded', function() {
    const coordinatesElement = document.getElementById('coordinates');
    const mapElement = document.getElementById('map');

    // Check if Geolocation is available
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            // Display coordinates
            coordinatesElement.textContent = `Latitude: ${latitude}, Longitude: ${longitude}`;

            // Create Google Maps iframe URL
            const mapUrl = `https://www.google.com/maps/embed/v1/place?q=${latitude},${longitude}&key=AIzaSyAOVYRIgupAurZup5y1PRh8Ismb1A3lLao`;

            // Set iframe source to show Google Maps
            mapElement.innerHTML =`<iframe
                width="100%"
                height="100%"
                frameborder="0"
                style="border:0"
                src="${mapUrl}"
                allowfullscreen
                aria-hidden="false"
                tabindex="0">
                </iframe>`;
        }, function(error) {
            console.error('Error getting location:', error);
            coordinatesElement.textContent = 'Unable to retrieve your location.';
        });
    } else {
        coordinatesElement.textContent = 'Geolocation is not supported by this browser.';
    }
});
document.addEventListener('DOMContentLoaded', function() {
    const postForm = document.getElementById('postForm');
    const postsContainer = document.getElementById('posts');
    
    // Load user data from local storage
    const userData = {
        username: localStorage.getItem('username') || '',
        profilePicture: localStorage.getItem('profilePicture') || ''
    };
    
    // Initialize username and profile picture fields
    document.getElementById('username').value = userData.username;
    document.getElementById('profilePicture').value = userData.profilePicture;
    
    postForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Get form data
        const username = document.getElementById('username').value;
        const profilePicture = document.getElementById('profilePicture').value;
        const postContent = document.getElementById('postContent').value;
        const attachment = document.getElementById('attachment').files[0];
        
        // Create post object
        const post = {
            username,
            profilePicture,
            content: postContent,
            attachment: attachment ? URL.createObjectURL(attachment) : null,
            comments: [],
            likes: 0
        };
        
        // Save the post data to local storage (append to existing posts)
        let posts = JSON.parse(localStorage.getItem('posts')) || [];
        posts.push(post);
        localStorage.setItem('posts', JSON.stringify(posts));
        
        // Clear the form
        postForm.reset();
        
        // Display the posts
        displayPosts();
    });
    
    function displayPosts() {
        postsContainer.innerHTML = '';
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        
        posts.forEach((post, index) => {
            const postDiv = document.createElement('div');
            postDiv.classList.add('post');
            
            const profilePicture = post.profilePicture ? `<img src="${post.profilePicture}" alt="${post.username}'s profile picture" class="profile-picture">` : '';
            const attachment = post.attachment ? `<a href="${post.attachment}" target="_blank">View Attachment</a>` : '';
            
            postDiv.innerHTML = `
                <div>
                    ${profilePicture}<span class="username">${post.username}</span>
                </div>
                <div class="content">${post.content}</div>
                ${attachment ? `<div class="attachment">${attachment}</div>` : ''}
                <div class="comments">
                    <button class="like-btn" data-index="${index}">Like (${post.likes})</button>
                    <div>
                        <textarea placeholder="Add a comment"></textarea>
                        <button class="comment-btn" data-index="${index}">Comment</button>
                    </div>
                    ${post.comments.map(comment => `<div class="comment">${comment}</div>`).join('')}
                </div>
            `;
            
            postsContainer.appendChild(postDiv);
        });
    }
    
    // Load and display posts on page load
    displayPosts();
    
    // Event delegation for like and comment buttons
    postsContainer.addEventListener('click', function(event) {
        if (event.target.classList.contains('like-btn')) {
            const index = event.target.dataset.index;
            const posts = JSON.parse(localStorage.getItem('posts'));
            posts[index].likes++;
            localStorage.setItem('posts', JSON.stringify(posts));
            displayPosts();
        }
        
        if (event.target.classList.contains('comment-btn')) {
            const index = event.target.dataset.index;
            const commentTextarea = event.target.previousElementSibling;
            const comment = commentTextarea.value.trim();
            
            if (comment) {
                const posts = JSON.parse(localStorage.getItem('posts'));
                posts[index].comments.push(comment);
                localStorage.setItem('posts', JSON.stringify(posts));
                displayPosts();
            }
        }
    });
});
document.addEventListener('DOMContentLoaded', function () {
    // Initialize the map
    const map = L.map('map').setView([51.505, -0.09], 13);

    // Add tile layer to the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Define a custom yellow marker icon
    const yellowIcon = L.divIcon({
        className: 'yellow-icon',
        html: '<div style="background-color: yellow; width: 24px; height: 24px; border-radius: 50%; border: 2px solid orange;"></div>',
        iconSize: [24, 24]
    });

    // Add a custom yellow marker
    const marker = L.marker([51.505, -0.09], { icon: yellowIcon }).addTo(map);

    // Add a circle overlay with the desired color and radius
    const circle = L.circle([51.505, -0.09], {
        color: 'blue', // Circle border color
        fillColor: '#30f', // Circle fill color
        fillOpacity: 0.3, // Opacity of the fill color
        radius: 500 // Radius of the circle in meters
    }).addTo(map);

    // Update coordinates on map click
    map.on('click', function (e) {
        const lat = e.latlng.lat.toFixed(4);
        const lng = e.latlng.lng.toFixed(4);
        document.getElementById('coordinates').textContent = `Latitude: ${lat}, Longitude: ${lng}`;
        marker.setLatLng([lat, lng]);
        circle.setLatLng([lat, lng]);
    });
});
