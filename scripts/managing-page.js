
// Create car class to assign cars information
class Car {
    constructor(img, id, brand, model, year, meterage, price, color, sellerName, sellerPhone, sellerEmail) {
        this.img = img; 
        this.id = id;
        this.brand = brand;
        this.model = model;
        this.year = parseInt(year);
        this.meterage = meterage ? parseInt(meterage) : 0;
        this.price = parseInt(price);
        this.color = color;
        this.seller = {
            name: sellerName,
            phone: sellerPhone,
            email: sellerEmail
        };
        this.listingDate = new Date().toISOString();
    }
}

// Function to preview the image
function previewImage(event) {
    const preview = document.getElementById('preview');
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        }
        reader.readAsDataURL(file);
    } else {
        preview.style.display = 'none';
    }
}

// Helper function to compress image
function compressImage(base64String, callback) {
    const img = new Image();
    img.onload = function() {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 600;
        
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
            if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
            }
        } else {
            if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
            }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        callback(compressedBase64);
    };
    
    img.src = base64String;
}

// Function to submit car data and save to localStorage
function submitCar() {
    const imgInput = document.getElementById('img');
    const preview = document.getElementById('preview');
    const id = document.getElementById('idcar').value;
    const brand = document.getElementById('brand').value;
    const model = document.getElementById('model').value;
    const year = document.getElementById('year').value;
    const meterage = document.getElementById('meterage').value;
    const price = document.getElementById('price').value;
    const color = document.getElementById('color').value;
        const sellerName = document.getElementById('seller-name').value;
        const sellerPhone = document.getElementById('seller-phone').value;
        const sellerEmail = document.getElementById('seller-email').value;
        
        // Validating entries
        if (!id || !brand || !model || !year || !price || !color || !sellerName || !sellerEmail) {
            alert('Please fill in all required fields');
            return;
        }
        
        // Check if no image was selected
        if (imgInput.files.length === 0) {
            alert('Please select an image for the car');
            return;
        }
        
        // Check if ID already exists
        const existingCars = getCars();
        if (existingCars.some(car => car.id === id)) {
            alert('Car ID already exists. Please use a unique ID.');
            return;
        }
        
        // Read the image file
        const reader = new FileReader();
        
        reader.onload = function(e) {
            // Compress the image before storing
            compressImage(e.target.result, function(compressedImageData) {
                // Create new car object with the properly loaded Base64 image data
                const newCar = new Car(
                    compressedImageData,
                    id,
                    brand,
                    model,
                    year,
                    meterage,
                    price,
                    color,
                    sellerName,
                    sellerPhone,
                    sellerEmail
                );
                
                try {
                    // Save to localStorage
                    saveCar(newCar);
                    
                    // Reset form
                    document.getElementById('carForm').reset();
                    preview.style.display = 'none';
                    
                    // Update the displayed cars
                    displayCars();
                    
                    alert('Car information saved successfully!');
                } catch (e) {
                    // Handle localStorage quota exceeded
                    if (e.name === 'QuotaExceededError' || e.toString().includes('quota')) {
                        alert('Storage quota exceeded. Try using smaller images or clearing some saved cars.');
                    } else {
                        alert('Error saving car: ' + e.message);
                    }
                }
            });
        };
        
        // Read the image file as a data URL (Base64)
        reader.readAsDataURL(imgInput.files[0]);
}
// Function to save car to localStorage
function saveCar(car) {
    // Get existing cars from localStorage
    let cars = getCars();
    
    // Push new car entry
    cars.push(car);
    
    // Save to localStorage
    localStorage.setItem('cars', JSON.stringify(cars));
    
    // Update active cars list for the main page
    updateActiveCars();
}
// Function to get cars stored in localStorage
function getCars() {
    const carsJson = localStorage.getItem('cars');
    return carsJson ? JSON.parse(carsJson) : [];
}
// Function to get active cars IDs
function getActiveCars() {
    const activeCarsJson = localStorage.getItem('activeCars');
    return activeCarsJson ? JSON.parse(activeCarsJson) : [];
}
// Function to update active cars list
function updateActiveCars() {
    const cars = getCars();
    // All cars are automatically active on the homepage
    const activeCars = cars.map(car => car.id);
    localStorage.setItem('activeCars', JSON.stringify(activeCars));
}
// Function to display all cars from localStorage
function displayCars() {
    const carsContainer = document.getElementById('container');
    const cars = getCars();
    carsContainer.innerHTML = '';
    
    cars.forEach((car, index) => {
        const carElement = document.createElement('div');
        carElement.className = 'car-item';
        
        // Car display
        carElement.innerHTML = `
            <img src="${car.img}" alt="${car.brand} ${car.model}" class="car-image">
            <div class="car-details">
                <h3>${car.brand} ${car.model} (${car.year})</h3>
                <p><strong>ID:</strong> ${car.id}</p>
                <p><strong>Color:</strong> ${car.color}</p>
                <p><strong>Price:</strong> $${car.price}</p>
                <p><strong>Meterage:</strong> ${car.meterage} km</p>
                <p><strong>Seller:</strong> ${car.seller.name} (${car.seller.email})</p>
                <div class="car-actions">
                    <button onclick="deleteCar(${index})">Delete</button>
                    <button onclick="editCar(${index})">Edit</button>
                </div>
            </div>
        `;
        
        carsContainer.appendChild(carElement);
    });
    
    // If no entries exist
    if (cars.length === 0) {
        carsContainer.innerHTML = '<p>No cars saved yet.</p>';
    }
}
// Function to delete a car
function deleteCar(index) {
    if (!confirm('Are you sure you want to delete this car?')) {
        return;
    }
    
    // Get cars from localStorage
    let cars = getCars();
    
    // Remove the car at the specified index
    cars.splice(index, 1);
    
    // Save back to localStorage
    localStorage.setItem('cars', JSON.stringify(cars));
    
    // Update active cars
    updateActiveCars();
    
    // Update display
    displayCars();
}

// Function to edit a car
function editCar(index) {
    // Get cars from localStorage
    let cars = getCars();
    
    // Get the car to edit
    const car = cars[index];
    
    // Populate the form with the car's data
    document.getElementById('idcar').value = car.id;
    document.getElementById('brand').value = car.brand;
    document.getElementById('model').value = car.model;
    document.getElementById('year').value = car.year;
    document.getElementById('meterage').value = car.meterage;
    document.getElementById('price').value = car.price;
    document.getElementById('color').value = car.color;
    document.getElementById('seller-name').value = car.seller.name;
    document.getElementById('seller-phone').value = car.seller.phone;
    document.getElementById('seller-email').value = car.seller.email;
    
    // Show the current image in preview
    const preview = document.getElementById('preview');
    preview.src = car.img;
    preview.style.display = 'block';
    // Update the submit button to editing
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.textContent = 'Update';
    submitBtn.onclick = function() {
        updateCar(index);
    };
}

// Function to update an existing car
function updateCar(index) {
    const imgInput = document.getElementById('img');
    const preview = document.getElementById('preview');
    const id = document.getElementById('idcar').value;
    const brand = document.getElementById('brand').value;
    const model = document.getElementById('model').value;
    const year = document.getElementById('year').value;
    const meterage = document.getElementById('meterage').value;
    const price = document.getElementById('price').value;
    const color = document.getElementById('color').value;
    const sellerName = document.getElementById('seller-name').value;
    const sellerPhone = document.getElementById('seller-phone').value;
    const sellerEmail = document.getElementById('seller-email').value;
    
    // Validating entries
    if (!id || !brand || !model || !year || !price || !color || !sellerName || !sellerEmail) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Get cars from localStorage
    let cars = getCars();
    
    if (imgInput.files.length > 0) {
        // New image selected, process it
        const reader = new FileReader();
        reader.onload = function(e) {
            compressImage(e.target.result, function(compressedImageData) {
                updateCarData(index, cars, compressedImageData);
            });
        };
        reader.readAsDataURL(imgInput.files[0]);
    } else {
        // No new image, keep the existing one
        updateCarData(index, cars, cars[index].img);
    }
}

function updateCarData(index, cars, imgData) {
    const id = document.getElementById('idcar').value;
    const brand = document.getElementById('brand').value;
    const model = document.getElementById('model').value;
    const year = document.getElementById('year').value;
    const meterage = document.getElementById('meterage').value;
    const price = document.getElementById('price').value;
    const color = document.getElementById('color').value;
    const sellerName = document.getElementById('seller-name').value;
    const sellerPhone = document.getElementById('seller-phone').value;
    const sellerEmail = document.getElementById('seller-email').value;
    
    // Check if ID exists in another car (not the one we're editing)
    const otherCars = [...cars];
    otherCars.splice(index, 1);
    if (otherCars.some(car => car.id === id)) {
        alert('Car ID already exists. Please use a unique ID.');
        return;
    }
    
    // Update car data
    cars[index].img = imgData;
    cars[index].id = id;
    cars[index].brand = brand;
    cars[index].model = model;
    cars[index].year = parseInt(year);
    cars[index].meterage = meterage ? parseInt(meterage) : 0;
    cars[index].price = parseInt(price);
    cars[index].color = color;
    cars[index].seller = {
        name: sellerName,
        phone: sellerPhone,
        email: sellerEmail
    };
    
    // Save updated cars array
    localStorage.setItem('cars', JSON.stringify(cars));
    
    // Update active cars
    updateActiveCars();
    
    // Reset form
    document.getElementById('carForm').reset();
    document.getElementById('preview').style.display = 'none';
    
    // Reset button text and onclick
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.textContent = 'Submit';
    submitBtn.onclick = submitCar;
    
    // Update display
    displayCars();
    
    alert('Car information updated successfully!');
}
// Initialize active cars
function initializeActiveCars() {
    const cars = getCars();
    const activeCars = cars.map(car => car.id);
    localStorage.setItem('activeCars', JSON.stringify(activeCars));
}

// Display cars on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeActiveCars();
    displayCars();
});