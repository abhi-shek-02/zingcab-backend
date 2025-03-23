
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

Below are curl examples for all API endpoints. Replace the variables with your actual values.

### Authentication

**Request OTP for login/registration**
```bash
curl -X POST http://localhost:5000/api/auth/request-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "9876543210"}'
```

**Verify OTP**
```bash
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "9876543210", "otp": "123456"}'
```

**Register User (after OTP verification)**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "9876543210",
    "otp": "123456",
    "name": "John Doe",
    "gender": "Male",
    "email": "john@example.com"
  }'
```

### User Management

**Get User Profile**
```bash
curl -X GET http://localhost:5000/api/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Update User Profile**
```bash
curl -X PUT http://localhost:5000/api/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Updated",
    "email": "updated@example.com",
    "gender": "Male"
  }'
```

**Delete User Account**
```bash
curl -X DELETE http://localhost:5000/api/user/account \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Get User Bookings**
```bash
curl -X GET http://localhost:5000/api/user/bookings \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Booking Management

**Calculate Ride Price**
```bash
curl -X POST http://localhost:5000/api/booking/calculate-price \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "pickupLocation": "Location A",
    "dropLocation": "Location B",
    "cabType": "Sedan"
  }'
```

**Apply Coupon**
```bash
curl -X POST http://localhost:5000/api/booking/apply-coupon \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "couponId": "COUPON_ID",
    "currentPrice": 1500
  }'
```

**Create Rental Ride Booking**
```bash
curl -X POST http://localhost:5000/api/booking/rental \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "pickupLocation": "Location A",
    "rentalPackage": "8h/80km",
    "pickupDate": "2023-06-15",
    "pickupTime": "10:00:00",
    "cabType": "SUV",
    "distance": 0,
    "finalPrice": 1200,
    "couponId": "COUPON_ID"
  }'
```

**Create Airport Ride Booking**
```bash
curl -X POST http://localhost:5000/api/booking/airport \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "pickupLocation": "Location A",
    "dropLocation": "Airport",
    "pickupDate": "2023-06-15",
    "pickupTime": "10:00:00",
    "cabType": "Sedan",
    "distance": 25,
    "finalPrice": 500,
    "couponId": "COUPON_ID"
  }'
```

**Create Outstation Ride Booking**
```bash
curl -X POST http://localhost:5000/api/booking/outstation \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "pickupLocation": "Location A",
    "dropLocation": "Location B",
    "pickupDate": "2023-06-15",
    "pickupTime": "10:00:00",
    "cabType": "SUV",
    "dropOffDate": "2023-06-16",
    "distance": 150,
    "finalPrice": 3000,
    "couponId": "COUPON_ID"
  }'
```

**Get Booking Details**
```bash
curl -X GET http://localhost:5000/api/booking/BOOKING_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Cancel Booking**
```bash
curl -X POST http://localhost:5000/api/booking/BOOKING_ID/cancel \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Driver Management

**Request OTP for Driver**
```bash
curl -X POST http://localhost:5000/api/driver/request-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "9876543210"}'
```

**Verify OTP for Driver**
```bash
curl -X POST http://localhost:5000/api/driver/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "9876543210", "otp": "123456"}'
```

**Get Driver Bookings**
```bash
curl -X GET http://localhost:5000/api/driver/bookings \
  -H "Authorization: Bearer DRIVER_TOKEN"
```

**Start Ride**
```bash
curl -X POST http://localhost:5000/api/driver/bookings/DRIVER_BOOKING_ID/start \
  -H "Authorization: Bearer DRIVER_TOKEN"
```

**Complete Ride**
```bash
curl -X POST http://localhost:5000/api/driver/bookings/DRIVER_BOOKING_ID/complete \
  -H "Authorization: Bearer DRIVER_TOKEN"
```

**Mark Ride as No-Show**
```bash
curl -X POST http://localhost:5000/api/driver/bookings/DRIVER_BOOKING_ID/no-show \
  -H "Authorization: Bearer DRIVER_TOKEN"
```

### Admin Management

**Admin Login**
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin_password"
  }'
```

**Get All Bookings**
```bash
curl -X GET http://localhost:5000/api/admin/bookings \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**Assign Driver to Booking**
```bash
curl -X POST http://localhost:5000/api/admin/bookings/assign-driver \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bookingId": "BOOKING_ID",
    "driverId": "DRIVER_ID"
  }'
```

**Register Driver**
```bash
curl -X POST http://localhost:5000/api/admin/drivers \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Driver Name",
    "phoneNumber": "9876543210",
    "drivingLicense": "DL123456789"
  }'
```

**Get All Drivers**
```bash
curl -X GET http://localhost:5000/api/admin/drivers \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**Register Car**
```bash
curl -X POST http://localhost:5000/api/admin/cars \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "roNumber": "MH01AB1234",
    "model": "Swift Dzire",
    "type": "Sedan"
  }'
```

**Get All Cars**
```bash
curl -X GET http://localhost:5000/api/admin/cars \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**Assign Car to Driver**
```bash
curl -X POST http://localhost:5000/api/admin/cars/assign-driver \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "carId": "CAR_ID",
    "driverId": "DRIVER_ID"
  }'
```

**Get All Contact Queries**
```bash
curl -X GET http://localhost:5000/api/admin/contact-queries \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### Contact Form

**Submit Contact Form**
```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "phoneNumber": "9876543210",
    "email": "john@example.com",
    "message": "I have a question about your service."
  }'
```

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
