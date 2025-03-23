
import React from 'react';
import { Link } from 'react-router-dom';
import { Car, MapPin, Clock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/90 to-primary py-20 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Your Trusted Partner for Intercity Travel
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Book a comfortable, safe, and affordable ride for your intercity journeys and airport transfers.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild className="bg-white text-primary hover:bg-gray-100">
                <Link to="/booking">Book a Ride</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link to="/services">Explore Services</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We offer a range of services to meet your transportation needs, from airport transfers to outstation trips.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Car className="h-6 w-6" />
                </div>
                <CardTitle className="mb-2">Airport Transfers</CardTitle>
                <CardDescription>
                  Convenient and reliable airport pick-up and drop-off services.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <MapPin className="h-6 w-6" />
                </div>
                <CardTitle className="mb-2">Outstation Trips</CardTitle>
                <CardDescription>
                  Comfortable intercity travel with experienced drivers.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Clock className="h-6 w-6" />
                </div>
                <CardTitle className="mb-2">Hourly Rentals</CardTitle>
                <CardDescription>
                  Flexible car rentals by the hour for your local travel needs.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose ZingCab</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We pride ourselves on providing a service that's reliable, safe, and comfortable.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Safety First</h3>
              <p className="text-gray-600">
                All our drivers are verified and trained with safety protocols.
              </p>
            </div>
            
            <div className="text-center">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Punctuality</h3>
              <p className="text-gray-600">
                We value your time and ensure our drivers arrive on schedule.
              </p>
            </div>
            
            <div className="text-center">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Car className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Quality Vehicles</h3>
              <p className="text-gray-600">
                Well-maintained and comfortable cars for a pleasant journey.
              </p>
            </div>
            
            <div className="text-center">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Transparent Pricing</h3>
              <p className="text-gray-600">
                No hidden charges, with clear and upfront pricing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Book Your Ride?</h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Experience the comfort and reliability of ZingCab for your next journey.
          </p>
          <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
            Book Now
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
