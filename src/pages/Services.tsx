
import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Clock, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Services = () => {
  const serviceFeatures = {
    rental: [
      "Hourly packages available (4h/40km, 8h/80km, 12h/120km)",
      "Professional chauffeurs",
      "Well-maintained vehicles",
      "Multiple stops allowed",
      "Waiting time included",
      "No hidden charges"
    ],
    airport: [
      "24/7 airport pickup and drop service",
      "Flight tracking",
      "Free waiting time",
      "Meet and greet service",
      "Luggage assistance",
      "Fixed pricing"
    ],
    outstation: [
      "One-way and round trip options",
      "Multiple vehicle categories",
      "Experienced drivers familiar with routes",
      "Flexible booking options",
      "Safe and comfortable journey",
      "Transparent pricing"
    ]
  };

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">Our Services</h1>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          ZingCab offers a range of transportation services designed to meet your various travel needs.
        </p>

        <Tabs defaultValue="rental" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="rental">Rental</TabsTrigger>
            <TabsTrigger value="airport">Airport</TabsTrigger>
            <TabsTrigger value="outstation">Outstation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="rental">
            <Card>
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Clock className="h-6 w-6" />
                </div>
                <CardTitle>Hourly Rental Service</CardTitle>
                <CardDescription>
                  Perfect for local travel, meetings, shopping, and events where you need a car for a few hours.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {serviceFeatures.rental.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2 mt-1 text-green-500">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to="/booking/rental">Book Rental Service</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="airport">
            <Card>
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Car className="h-6 w-6" />
                </div>
                <CardTitle>Airport Transfer Service</CardTitle>
                <CardDescription>
                  Reliable airport pickup and drop services with flight tracking to ensure punctuality.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {serviceFeatures.airport.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2 mt-1 text-green-500">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to="/booking/airport">Book Airport Service</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="outstation">
            <Card>
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <MapPin className="h-6 w-6" />
                </div>
                <CardTitle>Outstation Service</CardTitle>
                <CardDescription>
                  Comfortable intercity travel with experienced drivers who know the routes well.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {serviceFeatures.outstation.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2 mt-1 text-green-500">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to="/booking/outstation">Book Outstation Service</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What types of vehicles are available?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  We offer a range of vehicles including Hatchbacks, Sedans, SUVs, and Premium Cars.
                  Each category is designed to meet different needs and budgets.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How do I pay for the service?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  We accept various payment methods including credit/debit cards, UPI, and cash.
                  Payment is typically made after the service is completed, though some services
                  may require advance payment.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I cancel or reschedule my booking?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Yes, you can cancel or reschedule your booking. For cancellations made at least
                  2 hours before the scheduled pickup, there is no charge. Late cancellations may
                  incur a fee. You can manage your bookings through your account or by contacting
                  our customer service.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Are there any additional charges?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  The price quoted at the time of booking covers the base fare. Additional charges
                  may apply for extra kilometers, waiting time beyond the included limit, toll taxes,
                  and parking fees.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
