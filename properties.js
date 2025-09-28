// Properties Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializePropertiesPage();
});

function initializePropertiesPage() {
    setupViewToggle();
    setupPropertyFilters();
    setupPropertySearch();
    setupLoadMore();
    setupPropertyInteractions();
    initializePropertyMap();
}

// View Toggle (Grid/List)
function setupViewToggle() {
    const viewButtons = document.querySelectorAll('.view-btn');
    const propertiesGrid = document.getElementById('properties-grid');

    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const view = this.dataset.view;

            // Update active button
            viewButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Update grid view
            if (view === 'list') {
                propertiesGrid.classList.add('list-view');
            } else {
                propertiesGrid.classList.remove('list-view');
            }

            // Animate change
            propertiesGrid.style.opacity = '0.7';
            setTimeout(() => {
                propertiesGrid.style.opacity = '1';
            }, 200);
        });
    });
}

// Property Filters
function setupPropertyFilters() {
    const filterSelects = document.querySelectorAll('.filter-group select');
    const searchBtn = document.querySelector('.search-btn');
    const propertyCards = document.querySelectorAll('.property-card');

    // Add change event listeners to all filter selects
    filterSelects.forEach(select => {
        select.addEventListener('change', debounceFilter);
    });

    // Search button click
    if (searchBtn) {
        searchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            filterProperties();
        });
    }

    // Debounced filter function
    const debounceFilter = PremierProperties.debounce(filterProperties, 300);

    function filterProperties() {
        const filters = getActiveFilters();

        // Add loading state
        const propertiesGrid = document.getElementById('properties-grid');
        propertiesGrid.classList.add('loading');

        setTimeout(() => {
            propertyCards.forEach(card => {
                if (matchesFilters(card, filters)) {
                    card.classList.remove('filtered-out');
                    card.classList.add('filtered-in');
                } else {
                    card.classList.add('filtered-out');
                    card.classList.remove('filtered-in');
                }
            });

            propertiesGrid.classList.remove('loading');
            updateResultsCount();
        }, 500);
    }

    function getActiveFilters() {
        return {
            location: document.getElementById('location').value,
            priceRange: document.getElementById('price-range').value,
            bedrooms: document.getElementById('bedrooms').value,
            propertyType: document.getElementById('property-type').value
        };
    }

    function matchesFilters(card, filters) {
        // Location filter
        if (filters.location && !card.dataset.location?.includes(filters.location)) {
            return false;
        }

        // Price range filter
        if (filters.priceRange) {
            const cardPrice = parseInt(card.dataset.price);
            if (!matchesPriceRange(cardPrice, filters.priceRange)) {
                return false;
            }
        }

        // Bedrooms filter
        if (filters.bedrooms) {
            const cardBedrooms = parseInt(card.dataset.bedrooms);
            const minBedrooms = parseInt(filters.bedrooms.replace('+', ''));
            if (cardBedrooms < minBedrooms) {
                return false;
            }
        }

        // Property type filter would go here if data attributes were added

        return true;
    }

    function matchesPriceRange(price, range) {
        switch (range) {
            case '5-10':
                return price >= 5000000 && price <= 10000000;
            case '10-20':
                return price >= 10000000 && price <= 20000000;
            case '20-50':
                return price >= 20000000 && price <= 50000000;
            case '50+':
                return price >= 50000000;
            default:
                return true;
        }
    }

    function updateResultsCount() {
        const visibleCards = document.querySelectorAll('.property-card:not(.filtered-out)');
        const count = visibleCards.length;

        // You could add a results counter here
        console.log(`Showing ${count} properties`);
    }
}

// Property Search
function setupPropertySearch() {
    // This would integrate with a search API
    // For now, it's handled by the filters
}

// Load More functionality
function setupLoadMore() {
    const loadMoreBtn = document.querySelector('.load-more .btn');

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // Simulate loading more properties
            this.textContent = 'Loading...';
            this.disabled = true;

            setTimeout(() => {
                // In a real app, this would fetch more properties from an API
                this.textContent = 'Load More Properties';
                this.disabled = false;

                // Show message that all properties are loaded
                this.textContent = 'All Properties Loaded';
                this.disabled = true;
            }, 2000);
        });
    }
}

// Property Interactions
function setupPropertyInteractions() {
    const propertyCards = document.querySelectorAll('.property-card');

    propertyCards.forEach(card => {
        // Add hover effect for property images
        const image = card.querySelector('.property-image img');
        if (image) {
            card.addEventListener('mouseenter', function() {
                image.style.transform = 'scale(1.05)';
            });

            card.addEventListener('mouseleave', function() {
                image.style.transform = 'scale(1)';
            });
        }

        // Handle overlay button clicks
        const viewDetailsBtn = card.querySelector('.property-overlay .btn:first-child');
        const scheduleTourBtn = card.querySelector('.property-overlay .btn:last-child');

        if (viewDetailsBtn) {
            viewDetailsBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                openPropertyDetails(card);
            });
        }

        if (scheduleTourBtn) {
            scheduleTourBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                scheduleTour(card);
            });
        }

        // Make entire card clickable
        card.addEventListener('click', function() {
            openPropertyDetails(this);
        });
    });
}

// Open property details (mock functionality)
function openPropertyDetails(propertyCard) {
    const propertyTitle = propertyCard.querySelector('h3').textContent;
    const propertyPrice = propertyCard.querySelector('.property-price').textContent;

    // In a real app, this would navigate to a detailed property page
    console.log(`Opening details for: ${propertyTitle} - ${propertyPrice}`);

    // Mock modal or navigation
    alert(`Property Details: ${propertyTitle}\nPrice: ${propertyPrice}\n\nThis would open a detailed property page in a real application.`);
}

// Schedule tour (mock functionality)
function scheduleTour(propertyCard) {
    const propertyTitle = propertyCard.querySelector('h3').textContent;

    // In a real app, this would open a tour scheduling form
    console.log(`Scheduling tour for: ${propertyTitle}`);

    // Mock action
    if (confirm(`Schedule a tour for ${propertyTitle}?\n\nThis would open a scheduling form in a real application.`)) {
        // Redirect to contact page with property info
        window.location.href = 'contact.html';
    }
}

// Property card animation on scroll
if ('IntersectionObserver' in window) {
    const propertyObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                propertyObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Initially hide property cards for animation
    const propertyCards = document.querySelectorAll('.property-card');
    propertyCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        propertyObserver.observe(card);
    });
}

// Property comparison functionality (future enhancement)
function setupPropertyComparison() {
    // This would allow users to compare multiple properties
    // Implementation would include:
    // - Checkbox on each property card
    // - Compare button that appears when properties are selected
    // - Comparison table/modal
}

// Property favorites functionality (future enhancement)
function setupPropertyFavorites() {
    // This would allow users to save favorite properties
    // Implementation would include:
    // - Heart icon on each property card
    // - Local storage or user account integration
    // - Favorites page
}

// Interactive Map Functionality - Leaflet with Real Markers
function initializePropertyMap() {
    console.log('Initializing Leaflet map...');

    // Wait for Leaflet to be available
    setTimeout(() => {
        if (typeof L !== 'undefined') {
            createLeafletMap();
        } else {
            console.log('Leaflet not loaded, retrying...');
            setTimeout(initializePropertyMap, 500);
        }
    }, 100);
}

function createLeafletMap() {
    const mapContainer = document.getElementById('properties-map');
    const locationItems = document.querySelectorAll('.location-item');

    if (!mapContainer) {
        console.log('Map container not found');
        return;
    }

    // Clear any existing content
    mapContainer.innerHTML = '';

    // Property locations with exact coordinates
    const propertyLocations = [
        {
            id: 'beverly-hills',
            name: 'Beverly Hills, CA',
            properties: 3,
            lat: 34.0736,
            lng: -118.4004
        },
        {
            id: 'malibu',
            name: 'Malibu, CA',
            properties: 1,
            lat: 34.0259,
            lng: -118.7798
        },
        {
            id: 'aspen',
            name: 'Aspen, CO',
            properties: 1,
            lat: 39.1911,
            lng: -106.8175
        },
        {
            id: 'manhattan',
            name: 'Manhattan, NY',
            properties: 1,
            lat: 40.7829,
            lng: -73.9654
        },
        {
            id: 'miami',
            name: 'Miami Beach, FL',
            properties: 1,
            lat: 25.7907,
            lng: -80.1300
        }
    ];

    try {
        // Create map
        const map = L.map(mapContainer, {
            center: [39.8283, -98.5795],
            zoom: 4,
            zoomControl: true,
            scrollWheelZoom: true
        });

        // Add tile layer with error handling
        const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 18
        });

        tileLayer.on('tileerror', function() {
            console.log('Tile loading error, trying backup...');
            // Try backup tile server
            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
                attribution: '© CARTO'
            }).addTo(map);
        });

        tileLayer.addTo(map);

        // Create custom icon
        const customIcon = L.divIcon({
            className: 'custom-marker',
            html: `<div style="
                width: 20px;
                height: 20px;
                background: #D4AF37;
                border: 4px solid white;
                border-radius: 50%;
                box-shadow: 0 2px 10px rgba(212, 175, 55, 0.6);
                position: relative;
            "></div>`,
            iconSize: [28, 28],
            iconAnchor: [14, 14]
        });

        // Add markers with real coordinates
        const markers = [];
        propertyLocations.forEach(location => {
            const marker = L.marker([location.lat, location.lng], {
                icon: customIcon
            }).addTo(map);

            // Create popup
            const popupContent = `
                <div style="text-align: center; padding: 8px; font-family: 'Montserrat', sans-serif; min-width: 150px;">
                    <h4 style="margin: 0 0 8px 0; color: #1a1a1a; font-size: 1rem;">${location.name}</h4>
                    <p style="margin: 0 0 8px 0; color: #D4AF37; font-weight: 600; font-size: 0.9rem;">${location.properties} Luxury Properties</p>
                    <button onclick="filterPropertiesByLocation('${location.id}')" style="
                        background: #D4AF37;
                        color: #1a1a1a;
                        border: none;
                        padding: 6px 12px;
                        border-radius: 15px;
                        font-weight: 600;
                        cursor: pointer;
                        font-size: 0.8rem;
                        font-family: inherit;
                    ">View Properties</button>
                </div>
            `;

            marker.bindPopup(popupContent);

            // Add click event
            marker.on('click', function() {
                highlightLocation(location.id, locationItems);
            });

            // Store location ID
            marker.locationId = location.id;
            markers.push(marker);
        });

        // Setup legend interactions
        locationItems.forEach(item => {
            item.addEventListener('click', function() {
                const locationId = this.dataset.location;

                // Find corresponding marker
                const marker = markers.find(m => m.locationId === locationId);
                if (marker) {
                    // Pan to marker and open popup
                    map.setView([marker.getLatLng().lat, marker.getLatLng().lng], 8);
                    marker.openPopup();
                }

                // Highlight legend item
                highlightLocation(locationId, locationItems);

                // Filter properties
                filterPropertiesByLocation(locationId);
            });
        });

        // Store map globally
        window.propertyMap = {
            map: map,
            markers: markers,
            locations: propertyLocations
        };

        console.log('Leaflet map with real moving markers created successfully!');

    } catch (error) {
        console.error('Error creating map:', error);
        createFallbackMap(mapContainer, locationItems);
    }
}

function createFallbackMap(mapContainer, locationItems) {
    console.log('Creating fallback map...');

    mapContainer.innerHTML = `
        <div style="
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #1a237e 0%, #3949ab 50%, #1a237e 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            text-align: center;
            font-family: 'Montserrat', sans-serif;
        ">
            <div>
                <h3 style="margin: 0 0 20px 0; color: #D4AF37;">🗺️ Premier Properties Locations</h3>
                <p style="margin: 0; opacity: 0.8;">Interactive map will load when available</p>
                <p style="margin: 10px 0 0 0; font-size: 0.9rem; opacity: 0.6;">Use the location list below to filter properties</p>
            </div>
        </div>
    `;
}



// Filter properties by location
function filterPropertiesByLocation(locationId) {
    const locationSelect = document.getElementById('location');
    if (locationSelect) {
        locationSelect.value = locationId;
        locationSelect.dispatchEvent(new Event('change'));
    }
}

function highlightLocation(location, locationItems) {
    // Remove active class from all items
    locationItems.forEach(item => item.classList.remove('active'));

    // Add active class to selected item
    const targetItem = document.querySelector(`[data-location="${location}"]`);
    if (targetItem) {
        targetItem.classList.add('active');
    }
}

// Export for potential use in other files
window.PropertiesPage = {
    openPropertyDetails,
    scheduleTour,
    initializePropertyMap,
    filterPropertiesByLocation
};