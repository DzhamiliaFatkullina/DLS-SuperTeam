document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const clearBtn = document.getElementById('clear-btn');
    const loading = document.getElementById('loading');
    const results = document.getElementById('results');
    
    let searchTimeout = null;
    
    // Initialize page
    resetPage();

    // Clear results on page load
    results.innerHTML = '';
    searchInput.value = '';
    
    // Mock movie database
    const movieDatabase = [
        {
            title: "The Matrix",
            genre: "Sci-Fi, Action",
            plot: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers."
        },
        {
            title: "Blade Runner 2049",
            genre: "Sci-Fi, Drama",
            plot: "A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard, who's been missing for thirty years."
        },
        {
            title: "Ex Machina",
            genre: "Sci-Fi, Thriller",
            plot: "A young programmer is selected to participate in a ground-breaking experiment in synthetic intelligence by evaluating the human qualities of a highly advanced humanoid A.I."
        },
        {
            title: "Her",
            genre: "Sci-Fi, Romance",
            plot: "In a near future, a lonely writer develops an unlikely relationship with an operating system designed to meet his every need."
        },
        {
            title: "The Terminator",
            genre: "Sci-Fi, Action",
            plot: "A human soldier is sent from 2029 to 1984 to stop an almost indestructible cyborg killing machine, sent from the same year, which has been programmed to execute a young woman whose unborn son is the key to humanity's future salvation."
        }
    ];
    
    // Event listeners
    searchBtn.addEventListener('click', searchMovies);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchMovies();
    });
    
    // Clear input functionality
    searchInput.addEventListener('input', () => {
        clearBtn.classList.toggle('hidden', searchInput.value === '');
    });
    
    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearBtn.classList.add('hidden');
        searchInput.focus();
    });
    
    function searchMovies() {
        const query = searchInput.value.trim();
        if (!query) return;

        // Cancel any pending search
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        
        // Show loading
        results.innerHTML = '';
        loading.classList.remove('hidden');
        
        // Simulate API call delay (5 seconds)
        setTimeout(() => {
            // Hide loading
            loading.classList.add('hidden');
            
            // Display results
            displayResults(query);
        }, 5000);
    }
    
    function displayResults(query) {
        const isSciFiQuery = query.toLowerCase().includes('ai') || 
                             query.toLowerCase().includes('apocalyptic') ||
                             query.toLowerCase().includes('future');
        
        const matchedMovies = isSciFiQuery ? 
            movieDatabase.filter(movie => movie.genre.includes('Sci-Fi')) : 
            movieDatabase.slice(0, 2);
        
        if (matchedMovies.length === 0) {
            results.innerHTML = `<p>No movies found matching your description. Try something like "AI controlling humans" or "post-apocalyptic world".</p>`;
            return;
        }
        
        results.innerHTML = `<h2>Movies matching: "${query}"</h2>`;
        
        matchedMovies.forEach(movie => {
            const movieEl = document.createElement('div');
            movieEl.className = 'movie';
            movieEl.innerHTML = `
                <h3>${movie.title}</h3>
                <span class="genre">${movie.genre}</span>
                <p class="plot">${movie.plot}</p>
            `;
            results.appendChild(movieEl);
        });
    }

    function resetPage() {
        // Clear input
        searchInput.value = '';
        clearBtn.classList.add('hidden');
        
        // Cancel any pending search
        if (searchTimeout) {
            clearTimeout(searchTimeout);
            searchTimeout = null;
        }
        
        // Hide loading and clear results
        loading.classList.add('hidden');
        results.innerHTML = '';
        
        // Focus back on input
        searchInput.focus();
    }
});