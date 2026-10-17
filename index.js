const express = require('express');
const mongoose = require('mongoose');
const adminRoutes = require('./admin');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;
if (MONGODB_URI) {
    mongoose.connect(MONGODB_URI)
        .then(() => console.log('Connected to MongoDB'))
        .catch(err => console.error('MongoDB connection error:', err));
} else {
    console.warn("MONGODB_URI environment variable is missing.");
}

// Define Booking Schema
const bookingSchema = new mongoose.Schema({
    patientName: String,
    phone: String,
    service: String,
    date: String,
    time: String,
    status: { type: String, default: 'Pending' }
}, { timestamps: true });

// Prevent Mongoose from recompiling the model upon Vercel Serverless cold starts
const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

// Mount Admin Routes
app.use('/admin', adminRoutes);

// API Route to submit a booking
app.post('/api/book', async (req, res) => {
    try {
        const newBooking = new Booking(req.body);
        await newBooking.save();
        res.status(201).json({ success: true, message: 'Booking successfully confirmed!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error. Please try again.' });
    }
});

// Serve Client UI
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Sparkle Dental Care | Book an Appointment</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f8ff; margin: 0; padding: 0; color: #333; }
                header { background: #0077b6; color: white; padding: 30px 20px; text-align: center; }
                header h1 { margin: 0; font-size: 32px; }
                header p { margin: 5px 0 0; font-size: 18px; opacity: 0.9; }
                .container { max-width: 900px; margin: 30px auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); }
                .info-section { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 20px; margin-bottom: 30px; border-bottom: 1px solid #eee; padding-bottom: 20px; }
                .clinic-info h3 { margin-top: 0; color: #0077b6; }
                .clinic-info p { margin: 5px 0; line-height: 1.6; }
                .rating { display: inline-block; background: #ffb703; color: #fff; padding: 3px 8px; border-radius: 4px; font-weight: bold; }
                .gallery { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px; }
                .gallery img { width: 100%; height: 160px; object-fit: cover; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
                .booking-form h3 { color: #0077b6; }
                form { display: flex; flex-direction: column; gap: 15px; }
                input, select { padding: 12px; font-size: 16px; border: 1px solid #ccc; border-radius: 6px; }
                button { padding: 14px; font-size: 18px; font-weight: bold; background: #0077b6; color: white; border: none; border-radius: 6px; cursor: pointer; transition: 0.3s; }
                button:hover { background: #005f8c; }
                #message { margin-top: 15px; text-align: center; font-weight: bold; }
            </style>
        </head>
        <body>
            <header>
                <h1>Sparkle Dental Care (स्पार्कल डेंटल केयर)</h1>
                <p>Expert Dental Treatments by Dr. Kiran</p>
            </header>
            
            <div class="container">
                <div class="gallery">
                    <img src="https://lh3.googleusercontent.com/gps-cs-s/ANWiy9SpEM_k7u13i94RPSSHxVohYVzxpyj0ljRJRoZNGsRqAhkn936tO-RjSWRVu5G2dpSNjDCEeiY4tlYRtSq2owM1dqGKLHvId5buyyYr4ZoTJbRi5btO7eOjl7tmpZh6KikJWt_8Ig=w402-h298-k-no" alt="Dental Care 1">
                    <img src="https://lh3.googleusercontent.com/gps-cs-s/ANWiy9TAkRrn_NeZA3u3-Pp9K-tb51E0Ymv1W7UQa5TEQ65Q-M704Ce29ZocWimDSYDzGIWldfEOwHsj9lFanzpg0MwK4IHpYtpxyXThR5On43vdNAsL1q95XZqh7mCkfNbw1-_5AznPHg=w224-h302-k-no" alt="Dental Care 2">
                    <img src="https://lh3.googleusercontent.com/gps-cs-s/ANWiy9QnjD5B55QN70b9SKvyLS53CWG53CRJJuS-u7Lw46Mmmei-reI7c95CELk17RkVpdiIPasPQLvo6eLeVwqSjtes1NZjE8t4f6Et6eD7VtD-VvYBBfQyOg9QXWaBVPB6u8rpT1X0Qg=w224-h298-k-no-pi-0-ya137.20001-ro-0-fo100" alt="Dental Care 3">
                    <img src="https://lh3.googleusercontent.com/grass-cs/AABkmLeiJR1sKnika8JUPjdtq-Oh9HBz4zy-fQ9zpcctVcgNtrUkXo_0wnI8G-ZdavegaJJuP2HY9KX3kLL5nyiVHOwq6TPrmDYxT4afaUju7s5uJbJjP1_60FqBKqJCLjHa4M8i4QQS4Q=w408-h302-k-no" alt="Dental Care 4">
                </div>

                <div class="info-section">
                    <div class="clinic-info">
                        <h3>About Our Clinic</h3>
                        <p>📍 <b>Address:</b> Milan Building, 189, Perin Nariman St, near Paras Guest House, Borabazar Precinct, Fort, Mumbai 400001</p>
                        <p>📞 <b>Phone:</b> +91 98693 41311</p>
                        <p>⭐ <b>Rating:</b> <span class="rating">4.9 ★</span> (831 reviews)</p>
                        <p>⏰ <b>Hours:</b> Opens 10 AM Saturday</p>
                    </div>
                </div>

                <div class="booking-form">
                    <h3>Book an Appointment</h3>
                    <form id="bookForm">
                        <input type="text" id="patientName" placeholder="Full Name" required>
                        <input type="tel" id="phone" placeholder="Phone Number" required>
                        <select id="service" required>
                            <option value="" disabled selected>Select a Service...</option>
                            <option value="General Consultation">General Consultation</option>
                            <option value="Tooth Extraction">Tooth Extraction</option>
                            <option value="Root Canal">Root Canal</option>
                            <option value="Dental Implants">Dental Implants</option>
                            <option value="OPG (Dental X-ray)">OPG (Dental X-ray)</option>
                        </select>
                        <input type="date" id="date" required>
                        <input type="time" id="time" required>
                        <button type="submit">Confirm Appointment</button>
                    </form>
                    <div id="message"></div>
                </div>
            </div>

            <script>
                document.getElementById('bookForm').addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const btn = e.target.querySelector('button');
                    const msgDiv = document.getElementById('message');
                    btn.innerText = 'Booking...';
                    
                    const data = {
                        patientName: document.getElementById('patientName').value,
                        phone: document.getElementById('phone').value,
                        service: document.getElementById('service').value,
                        date: document.getElementById('date').value,
                        time: document.getElementById('time').value
                    };

                    try {
                        const response = await fetch('/api/book', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(data)
                        });
                        const result = await response.json();
                        
                        if(result.success) {
                            msgDiv.style.color = 'green';
                            msgDiv.innerText = result.message;
                            e.target.reset();
                        } else {
                            msgDiv.style.color = 'red';
                            msgDiv.innerText = 'Failed to book. Try again.';
                        }
                    } catch(err) {
                        msgDiv.style.color = 'red';
                        msgDiv.innerText = 'Server error. Try again later.';
                    }
                    btn.innerText = 'Confirm Appointment';
                });
            </script>
        </body>
        </html>
    `);
});

// Support for running locally
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(\`Server running locally on port \${PORT}\`));
}

// Export for Vercel
module.exports = app;
