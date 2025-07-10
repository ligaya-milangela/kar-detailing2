const express = require('express');
const jwt = require('jsonwebtoken');
const Booking = require('../models/Booking');
const User = require('../models/User');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Missing token" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

router.post('/', auth, async (req, res) => {
  try {
    const { name, contact, date, time, service, notes } = req.body;

    const booking = await Booking.create({
      name,
      contact,
      date,
      time,
      service,
      notes,
      user: req.user.id,
      status: "Pending"
    });

    res.status(201).json(booking);
  } catch (err) {
    console.error("Booking creation error:", err);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({}).sort({ date: -1 });
    const bookingsWithStatus = bookings.map(b => ({
      ...b.toObject(),
      status: b.status || "Pending"
    }));

    res.json(bookingsWithStatus);
  } catch (err) {
    console.error("Booking fetch error:", err);
    res.status(500).json({ error: 'Failed to load bookings' });
  }
});

router.put('/status/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    booking.status = "Completed";
    await booking.save();

    res.json({ message: "Booking marked as completed", status: "Completed" });
  } catch (err) {
    console.error("Update status error:", err);
    res.status(500).json({ error: "Failed to update status" });
  }
});

module.exports = router;
