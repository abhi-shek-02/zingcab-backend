
# ZingCab Backend API

A production-ready backend for ZingCab - an intercity and rental cab booking platform.

## Features

- OTP-based authentication
- Ride booking management (Rental, Airport, Outstation)
- Driver management
- Admin panel functionalities
- Contact form submissions

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Supabase account (for database)
- Twilio account (for OTP, optional)

### Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example`
4. Start the server: `npm run dev`

## API Documentation

### Authentication

- `POST /api/auth/request-otp` - Request OTP for login/registration
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/register` - Register a new user

### User Management

- `GET /api/user/profile` - Get current user profile
- `PUT /api/user/profile` - Update user profile
- `DELETE /api/user/account` - Delete user account
- `GET /api/user/bookings` - Get user's bookings

### Booking Management

- `POST /api/booking/calculate-price` - Calculate ride price
- `POST /api/booking/apply-coupon` - Apply coupon to ride
- `POST /api/booking/rental` - Create rental ride booking
- `POST /api/booking/airport` - Create airport ride booking
- `POST /api/booking/outstation` - Create outstation ride booking
- `GET /api/booking/:bookingId` - Get booking details
- `POST /api/booking/:bookingId/cancel` - Cancel booking

### Driver Management

- `POST /api/driver/request-otp` - Request OTP for driver login
- `POST /api/driver/verify-otp` - Verify driver OTP
- `GET /api/driver/bookings` - Get driver's bookings
- `POST /api/driver/bookings/:driverBookingId/start` - Start ride
- `POST /api/driver/bookings/:driverBookingId/complete` - Complete ride
- `POST /api/driver/bookings/:driverBookingId/no-show` - Mark ride as no-show

### Admin Management

- `POST /api/admin/login` - Admin login
- `GET /api/admin/bookings` - Get all bookings
- `POST /api/admin/bookings/assign-driver` - Assign driver to booking
- `POST /api/admin/drivers` - Register a new driver
- `GET /api/admin/drivers` - Get all drivers
- `POST /api/admin/cars` - Register a new car
- `GET /api/admin/cars` - Get all cars
- `POST /api/admin/cars/assign-driver` - Assign car to driver
- `GET /api/admin/contact-queries` - Get all contact queries

### Contact Form

- `POST /api/contact` - Submit a contact form

## Error Handling

The API uses standardized error responses:

```json
{
  "success": false,
  "message": "Error message",
  "errors": ["Detailed error information"]
}
```

## Rate Limiting

To prevent abuse, the API implements rate limiting:

- General API: 100 requests per 15 minutes
- Authentication routes: 10 requests per 15 minutes

## Security

- CORS protection
- Helmet for HTTP headers security
- JWT token-based authentication
- Input validation using Joi
