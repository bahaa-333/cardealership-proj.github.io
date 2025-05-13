
// Get car data from local storage
function getCarData() {
    const storedCars = localStorage.getItem('cars');
    return storedCars ? JSON.parse(storedCars) : [];
}

// Display cars
function displayCars(cars) {
    const carList = document.getElementById('car-list');
    carList.innerHTML = '';

    cars.forEach(car => {
        const carCard = document.createElement('div');
        carCard.className = 'car-card';
        carCard.innerHTML = `
            <div class="car-img">
                <img src="${car.img}" alt="${car.brand} ${car.model}">
            </div>
            <div class="car-info">
                <div class="car-title">${car.brand} ${car.model}</div>
                <div class="car-meta">${car.year} | ${car.meterage} miles</div>
                <div class="car-meta">Color: ${car.color}</div>
                <div class="car-price">${car.price}</div>
                <button class="quick-view-btn" data-id="${car.id}">Quick View</button>
            </div>
        `;
        carList.appendChild(carCard);
    });

    // Add event listeners to quick view buttons
    document.querySelectorAll('.quick-view-btn').forEach(button => {
        button.addEventListener('click', function() {
            const carId = this.getAttribute('data-id');
            openCarcard(carId);
        });
    });
}

// Filter cars
function filterCars() {
    const carData = getCarData();
    const brandFilter = document.getElementById('brand-filter').value.toLowerCase();
    const modelFilter = document.getElementById('model-filter').value.toLowerCase();
    const yearFilter = document.getElementById('year-filter').value;
    const colorFilter = document.getElementById('color-filter').value;

    let filteredCars = carData;

    if (brandFilter) {
        filteredCars = filteredCars.filter(car => car.brand.toLowerCase() == brandFilter);
    }

    if (modelFilter) {
        filteredCars = filteredCars.filter(car => car.model.toLowerCase() == modelFilter);
    }

    if (yearFilter) {
        filteredCars = filteredCars.filter(car => car.year == yearFilter);
    }

    if (colorFilter) {
        filteredCars = filteredCars.filter(car => car.color == colorFilter);
    }

    displayCars(filteredCars);
}

// filter dropdowns
function dropdownFilters() {
    const carData = getCarData();
    const brands = [...new Set(carData.map(car => car.brand.toLowerCase()))];
    const models = [...new Set(carData.map(car => car.model.toLowerCase()))];
    const years = [...new Set(carData.map(car => car.year))];
    const colors = [...new Set(carData.map(car => car.color))];

    const brandFilter = document.getElementById('brand-filter');
    const modelFilter = document.getElementById('model-filter');
    const yearFilter = document.getElementById('year-filter');
    const colorFilter = document.getElementById('color-filter');

    // Clear existing options (except the first "All" option)
    while (brandFilter.options.length > 1) {
        brandFilter.remove(1);
    }
    while (modelFilter.options.length > 1) {
        modelFilter.remove(1);
    }
    while (yearFilter.options.length > 1) {
        yearFilter.remove(1);
    }
    while (colorFilter.options.length > 1) {
        colorFilter.remove(1);
    }

    // brand filter options
    brands.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand.toLowerCase();
        option.textContent = brand;
        brandFilter.appendChild(option);
    });

    // model filter options
    models.forEach(model => {
        const option = document.createElement('option');
        option.value = model.toLowerCase();
        option.textContent = model;
        modelFilter.appendChild(option);
    });

    // year filter options
        years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
    });

    // color filter options
    colors.forEach(color => {
        const option = document.createElement('option');
        option.value = color;
        option.textContent = color;
        colorFilter.appendChild(option);
    });

    // Add event listeners to filters
    brandFilter.addEventListener('change', filterCars);
    modelFilter.addEventListener('change', filterCars);
    yearFilter.addEventListener('change', filterCars);
    colorFilter.addEventListener('change', filterCars);
}

     
function openCarcard(carId) {
    const carData = getCarData();
    const car = carData.find(car => car.id == carId);
    const modal = document.getElementById('car-modal');
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <div class="modal-car-img" style="flex: 1;">
            <img src="${car.img}" alt="${car.brand} ${car.model}">
            <div class="modal-car-specs" style="margin-top:20px;">
                <p><strong>Year:</strong> ${car.year}</p>
                <p><strong>Color:</strong> ${car.color}</p>
                <p><strong>Meterage:</strong> ${car.meterage} miles</p>
                <p><strong>Price:</strong> ${car.price}</p>
                <p><strong>Listed on:</strong>  ${car.listingDate ? new Date(car.listingDate).toLocaleString() : ''}</p>
            </div>
        </div>
        <div class="contact-form" style="flex: 1;">
            <h3>Contact Seller</h3>
            <form id="contact-form">
                <div class="form-group">
                    <label for="name">Name</label>
                    <input type="text" id="name" required>
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" required>
                </div>
                <div class="form-group">
                    <label for="phone">Phone</label>
                    <input type="tel" id="phone">
                </div>
                <div class="form-group">
                    <label for="message">Message</label>
                    <textarea id="message" required>I'm interested in the ${car.year} ${car.brand} ${car.model}.</textarea>
                </div>
                <button type="submit" class="submit-btn" onclick="consl()">Send Message</button>
            </form>
        </div>
    `;
    
    modal.style.display = 'block';
    // Add event listener to form submission
    document.getElementById('contact-form').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Your message has been sent! A representative will contact you soon.');
        modal.style.display = 'none';
    });
}

    // Close pop-up when clicking on X
    document.querySelector('.close-modal').addEventListener('click', function() {
        document.getElementById('car-modal').style.display = 'none';
    });
    // Close pop-up when clicking outside the pop-up content
    window.addEventListener('click', function(event) {
        if (event.target === document.getElementById('car-modal')) {
            document.getElementById('car-modal').style.display = 'none';
        }
    });
    // Hamburger Menu Toggle
    document.querySelector('.hamburger-menu').addEventListener('click', function() {
        this.classList.toggle('active');
        document.querySelector('.nav-links').classList.toggle('active');
    });
    // Initialize the page
    window.onload = function() {
        const carData = getCarData();
        
        // If no cars in local storage, show a message
        if (carData.length === 0) {
            const carList = document.getElementById('car-list');
            carList.innerHTML = '<p style="text-align: center; width: 100%;">No cars available. Please add cars in the managing page.</p>';
        } else {
            displayCars(carData);
            dropdownFilters();
        }
    };
    function consl(){
        const n = document.getElementById('name').value;
        const t = document.getElementById('message').value;
        console.log(n + " has sent you a message:" + t);
    };
