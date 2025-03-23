
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { Phone, Lock } from 'lucide-react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';

const phoneSchema = z.object({
  phoneNumber: z.string().min(10, { message: 'Phone number must be at least 10 digits' }),
});

const otpSchema = z.object({
  otp: z.string().length(6, { message: 'OTP must be 6 digits' }),
});

type PhoneFormValues = z.infer<typeof phoneSchema>;
type OtpFormValues = z.infer<typeof otpSchema>;

const Login = () => {
  const { toast } = useToast();
  const [otpSent, setOtpSent] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  
  const phoneForm = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phoneNumber: '',
    },
  });
  
  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  });

  const onRequestOtp = async (data: PhoneFormValues) => {
    try {
      await axios.post('/api/auth/request-otp', { phoneNumber: data.phoneNumber });
      toast({
        title: "OTP Sent",
        description: "A one-time password has been sent to your phone number.",
      });
      setOtpSent(true);
      setPhoneNumber(data.phoneNumber);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send OTP. Please try again.",
      });
    }
  };

  const onVerifyOtp = async (data: OtpFormValues) => {
    try {
      const response = await axios.post('/api/auth/verify-otp', { 
        phoneNumber, 
        otp: data.otp 
      });
      
      // Store token in localStorage
      localStorage.setItem('token', response.data.data.token);
      
      toast({
        title: "Login Successful",
        description: "You have been logged in successfully.",
      });
      
      // Redirect to home or dashboard page
      window.location.href = '/';
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid OTP. Please try again.",
      });
    }
  };

  const handleResendOtp = async () => {
    try {
      await axios.post('/api/auth/request-otp', { phoneNumber });
      toast({
        title: "OTP Resent",
        description: "A new one-time password has been sent to your phone number.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to resend OTP. Please try again.",
      });
    }
  };

  const handleGoBack = () => {
    setOtpSent(false);
    otpForm.reset();
  };

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Welcome to ZingCab</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>{otpSent ? 'Verify OTP' : 'Login / Signup'}</CardTitle>
            <CardDescription>
              {otpSent 
                ? `Enter the 6-digit code sent to ${phoneNumber}` 
                : 'Enter your phone number to receive a one-time password'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!otpSent ? (
              <Form {...phoneForm}>
                <form onSubmit={phoneForm.handleSubmit(onRequestOtp)} className="space-y-4">
                  <FormField
                    control={phoneForm.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <div className="flex">
                            <div className="flex items-center bg-muted px-3 rounded-l-md border border-r-0 border-input">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <Input 
                              className="rounded-l-none" 
                              placeholder="Enter your phone number" 
                              type="tel" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    Get OTP
                  </Button>
                </form>
              </Form>
            ) : (
              <Form {...otpForm}>
                <form onSubmit={otpForm.handleSubmit(onVerifyOtp)} className="space-y-4">
                  <FormField
                    control={otpForm.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem className="space-y-4">
                        <FormLabel>One-Time Password</FormLabel>
                        <FormControl>
                          <div className="flex justify-center">
                            <InputOTP
                              maxLength={6}
                              value={field.value}
                              onChange={field.onChange}
                            >
                              <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                              </InputOTPGroup>
                            </InputOTP>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    <Lock className="mr-2 h-4 w-4" />
                    Verify & Login
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            {otpSent ? (
              <>
                <Button variant="ghost" onClick={handleGoBack}>
                  Change Number
                </Button>
                <Button variant="link" onClick={handleResendOtp}>
                  Resend OTP
                </Button>
              </>
            ) : (
              <div className="text-sm text-center w-full text-muted-foreground">
                We'll send you a 6-digit code to verify your phone number
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
