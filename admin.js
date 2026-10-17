const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

router.get('/api/bookings', async (req, res) => {
    try {
        await req.connectToDatabase(); // Ensure DB is connected
        const Booking = mongoose.models.Booking;
        const bookings = await Booking.find().sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Admin Dashboard | Sparkle Dental</title>
            <style>
                body { font-family: 'Segoe UI', sans-serif; background: #f4f7f6; margin: 0; padding: 20px; }
                .container { max-width: 1000px; margin: auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
                h1 { color: #0077b6; text-align: center; border-bottom: 2px solid #eee; padding-bottom: 10px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { padding: 15px; border-bottom: 1px solid #ddd; text-align: left; }
                th { background-color: #0077b6; color: white; }
                tr:hover { background-color: #f1f1f1; }
                .status { padding: 5px 10px; border-radius: 20px; font-size: 12px; font-weight: bold; background: #ffd166; color: #333; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Sparkle Dental Care - Admin Dashboard</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Patient Name</th>
                            <th>Phone</th>
                            <th>Service</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody id="booking-list">
                        <tr><td colspan="6" style="text-align: center;">Loading bookings...</td></tr>
                    </tbody>
                </table>
            </div>

            <script>
                async function loadBookings() {
                    const tbody = document.getElementById('booking-list');
                    try {
                        const response = await fetch('/admin/api/bookings');
                        const bookings = await response.json();
                        
                        if(bookings.error) {
                            tbody.innerHTML = \`<tr><td colspan="6" style="color:red; text-align:center;">Database Error: \${bookings.error}</td></tr>\`;
                            return;
                        }

                        tbody.innerHTML = '';
                        if(bookings.length === 0) {
                            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No bookings yet.</td></tr>';
                            return;
                        }

                        bookings.forEach(b => {
                            const tr = document.createElement('tr');
                            tr.innerHTML = \`
                                <td>\${b.patientName}</td>
                                <td>\${b.phone}</td>
                                <td>\${b.service}</td>
                                <td>\${b.date}</td>
                                <td>\${b.time}</td>
                                <td><span class="status">\${b.status}</span></td>
                            \`;
                            tbody.appendChild(tr);
                        });
                    } catch (err) {
                        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: red;">Error loading bookings.</td></tr>';
                    }
                }
                loadBookings();
            </script>
        </body>
        </html>
    `);
});

module.exports = router;
