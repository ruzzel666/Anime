const modal = () => {
    const modal = document.querySelector('.search-model')
    const modalBtn = document.querySelector('.icon_search')
    const modalClose = modal.querySelector('.search-close-switch')
    const searchInput = document.getElementById('search-input')
    const searchResults = document.getElementById('search-results')

    let animeData = []

    // Загрузка данных об аниме
    async function loadAnimeData() {
        try {
            const response = await fetch('db.json')
            const data = await response.json()
            animeData = data.anime || []
        } catch (error) {
            console.error('Ошибка загрузки данных:', error)
        }
    }

    // Функция поиска
    function searchAnime(query) {
        if (!query.trim()) {
            searchResults.innerHTML = ''
            return
        }

        const lowerQuery = query.toLowerCase().trim()

        const filtered = animeData.filter(anime => {
            const title = (anime.title || '').toLowerCase()
            const originalTitle = (anime['original-title'] || '').toLowerCase()
            const genre = (anime.ganre || '').toLowerCase()
            const tags = (anime.tags || []).map(tag => tag.toLowerCase())

            return title.includes(lowerQuery) ||
                originalTitle.includes(lowerQuery) ||
                genre.includes(lowerQuery) ||
                tags.some(tag => tag.includes(lowerQuery))
        })

        displayResults(filtered, lowerQuery)
    }

    // Отображение результатов
    function displayResults(results, query) {
        if (results.length === 0) {
            searchResults.innerHTML = `
                <div class="search-no-results">
                    <p>Ничего не найдено по запросу "${query}"</p>
                </div>
            `
            return
        }

        const resultsHTML = results.map(anime => `
            <a href="anime-details.html?itemId=${anime.id}" class="search-result-item">
                <div class="search-result-image">
                    <img src="${anime.image}" alt="${anime.title}" onerror="this.src='img/no-image.png'">
                </div>
                <div class="search-result-info">
                    <h4 class="search-result-title">${highlightMatch(anime.title, query)}</h4>
                    <p class="search-result-genre">${anime.ganre || ''}</p>
                    <div class="search-result-meta">
                        <span class="search-result-year">${anime.date || ''}</span>
                        <span class="search-result-rating">★ ${anime.rating || ''}</span>
                    </div>
                </div>
            </a>
        `).join('')

        searchResults.innerHTML = `
            <div class="search-results-header">
                <p>Найдено: ${results.length} аниме</p>
            </div>
            <div class="search-results-list">
                ${resultsHTML}
            </div>
        `
    }

    // Подсветка совпадений
    function highlightMatch(text, query) {
        if (!text) return ''
        const regex = new RegExp(`(${query})`, 'gi')
        return text.replace(regex, '<mark>$1</mark>')
    }

    // Инициализация модального окна
    modalBtn.addEventListener('click', () => {
        modal.style.display = 'block'
        searchInput.value = ''
        searchResults.innerHTML = ''
        searchInput.focus()
        loadAnimeData()
    })

    modalClose.addEventListener('click', () => {
        modal.style.display = 'none'
        searchResults.innerHTML = ''
        searchInput.value = ''
    })

    // Поиск при вводе
    searchInput.addEventListener('input', (e) => {
        searchAnime(e.target.value)
    })

    // Закрытие по клику вне формы
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none'
            searchResults.innerHTML = ''
            searchInput.value = ''
        }
    })

    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none'
            searchResults.innerHTML = ''
            searchInput.value = ''
        }
    })
}

modal()
