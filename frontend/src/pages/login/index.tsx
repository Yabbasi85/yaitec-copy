import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  VStack,
  useToast,
  Icon,
  Stack,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';
import axios, { AxiosError } from 'axios';
import { useAuth } from '../../auth/AuthProvider';
import { Rocket } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';

// Stripe configuration
const stripePromise = loadStripe('pk_test_51Lz3WXEXP7kKkSU8r4rZSJ18VDDiTnfieymVmkwzfitfp2jpdOLejQB8Nr2cbTc6oI7uQivyRptFlTcMPywZEg5600ydtPBIyy');

const MotionBox = motion(Box);

const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const toast = useToast();

  const apiUrl = import.meta.env.VITE_API_URL;
  const googleClientId = '836199087703-jktkff373784579rbd48hdacpic8ocq5.apps.googleusercontent.com';

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Google Login Handler
  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    try {
      const token = credentialResponse.credential;

      // Enviar token do Google para o backend
      const response = await axios.post(`${apiUrl}/auth/google?token=${token}`);

      // Verifica se o backend retornou sucesso e se o usuário existe
      if (response.status === 200) {
        const { user_id } = response.data;

        // Verifique se o user_id foi retornado corretamente
        if (user_id) {
          setSuccessMessage('Google login successful!');
          toast({
            title: 'Login successful.',
            description: 'Welcome back, explorer!',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });

          localStorage.setItem('token', response.data.access_token);

          window.location.replace('/');
        }
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response && error.response.status === 400 && error.response.data.detail === "User not found") {
        // Se o backend retornar 400 e o usuário não for encontrado, sugerir registro
        setErrorMessage('User not found. Please register to continue.');
        toast({
          title: 'User not found.',
          description: 'It looks like you do not have an account. Please register to continue.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } else {
        setErrorMessage('Error during Google login.');
        toast({
          title: 'Login error.',
          description: 'An error occurred during Google login. Please try again.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  // Google Register Handler
  const handleGoogleRegister = async (credentialResponse: CredentialResponse) => {
    try {
      const token = credentialResponse.credential;

      // Define a URL dinâmica dependendo da existência de um plano
      const url = selectedPlan
        ? `${apiUrl}/auth/google-register?token=${token}&plan=${selectedPlan}`
        : `${apiUrl}/auth/google-register?token=${token}`;

      const response = await axios.post(url);

      if (response.status === 200) {
        if (response.data.checkout_session_url) {
          // Redireciona para o Stripe se houver plano
          window.location.href = response.data.checkout_session_url;
        } else {
          // Mostra mensagem de sucesso se não houver plano
          toast({
            title: 'Registration successful.',
            description: 'Your cosmic account has been created.',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          // Redireciona para a página de login
          setTimeout(() => {
            window.location.href = '/login';
          }, 3000);
        }

      }
    } catch (error) {
      setErrorMessage('Error during Google registration.');
      toast({
        title: 'Registration error.',
        description: 'Error during Google registration. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };


  // Email/Password Login Handler
  const handleLogin = async () => {
    const errorMessage = await login(email, password);
    if (errorMessage) {
      toast({
        title: "Login error",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } else {
      setSuccessMessage('Login successful!');
      toast({
        title: "Login successful",
        description: "Welcome back!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Stripe Checkout Handler
  const handleCheckout = async () => {
    try {
      const response = await axios.post(`${apiUrl}/create-checkout-session/`, {
        email,
        password,
        price_id: selectedPlan,
      });

      const { sessionId } = response.data;

      const stripe = await stripePromise;

      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId });

        if (error) {
          setErrorMessage('Error during checkout. Please try again.');
        }
      } else {
        setErrorMessage('Stripe is not initialized.');
      }
    } catch (error) {
      setErrorMessage('Error during checkout.');
    }
  };


  const handleRegister = async () => {
    try {
      const response = await axios.post(`${apiUrl}/register`, {
        email,
        password
      });

      if (response.status === 200) {
        setSuccessMessage("User registered successfully! You can now login.");
        setIsRegister(false);
      }
    } catch (error) {
      console.log('Error', error)
    }
  };


  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    if (isRegister) {
      if (!selectedPlan) {
        await handleRegister();
      }
      if (selectedPlan) {
        await handleCheckout();
      }
    } else {
      await handleLogin();
    }
  };

  // Available Plans
  const plans = [
    { id: 'price_1Q1ur7EXP7kKkSU8jttRLEZ3', name: 'Basic Plan', price: '$10 / month', description: 'Good for personal use' },
    { id: 'price_1Q1urxEXP7kKkSU8HvG927tp', name: 'Intermediate Plan', price: '$20 / month', description: 'Perfect for small teams' },
    { id: 'price_1Q1ussEXP7kKkSU8BxXj0vOB', name: 'Advanced Plan', price: '$30 / month', description: 'Best for growing businesses' },
  ];

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <Flex
        minHeight="100vh"
        width="full"
        align="center"
        justifyContent="center"
        bgGradient="linear(to-r, #5541ff, #082a46)"
      >
        <MotionBox
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          bg="#082a46"
          p={8}
          rounded="xl"
          shadow="2xl"
          w="full"
          maxW="md"
        >
          <VStack spacing={8} align="stretch">
            <VStack spacing={2}>
              <Icon as={Rocket} w={16} h={16} color="#00ff89" />
              <Heading
                bgGradient="linear(to-r, #5541ff, #00ff89)"
                bgClip="text"
                fontSize="4xl"
                fontWeight="extrabold"
              >
                Bland Voice
              </Heading>
              <Heading color="white" size="lg">
                {isRegister ? 'Join the Universe' : 'Welcome Back, Explorer'}
              </Heading>
              <Text color="gray.400" fontSize="sm">
                {isRegister
                  ? 'Create your cosmic account today!'
                  : 'Sign in to explore the galaxy'}
              </Text>
            </VStack>

            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                {errorMessage && <Text color="red.400">{errorMessage}</Text>}
                {successMessage && <Text color="green.400">{successMessage}</Text>}
                <FormControl>
                  <FormLabel color="white">Email address</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    bg="whiteAlpha.200"
                    borderColor="whiteAlpha.300"
                    color="white"
                    _hover={{ borderColor: '#5541ff' }}
                    _focus={{
                      borderColor: '#5541ff',
                      boxShadow: '0 0 0 1px #5541ff',
                    }}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel color="white">Password</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    bg="whiteAlpha.200"
                    borderColor="whiteAlpha.300"
                    color="white"
                    _hover={{ borderColor: '#5541ff' }}
                    _focus={{
                      borderColor: '#5541ff',
                      boxShadow: '0 0 0 1px #5541ff',
                    }}
                  />
                </FormControl>

                {isRegister && (
                  <Box>
                    <Text color="white" fontWeight="bold" mb={4}>  Select a Plan (optional):</Text>
                    <Stack spacing={4}>
                      {plans.map((plan) => (
                        <Box
                          key={plan.id}
                          borderWidth={2}
                          borderColor={selectedPlan === plan.id ? '#00ff89' : 'gray.600'}
                          borderRadius="lg"
                          p={4}
                          cursor="pointer"
                          onClick={() => setSelectedPlan(plan.id)}
                          transition="all 0.2s"
                          _hover={{ borderColor: '#00ff89', transform: 'translateY(-2px)' }}
                          bg={selectedPlan === plan.id ? 'whiteAlpha.200' : 'transparent'}
                        >
                          <Flex justify="space-between" align="center">
                            <VStack align="start" spacing={1}>
                              <Text color="white" fontWeight="bold">{plan.name}</Text>
                              <Text color="gray.300" fontSize="sm">{plan.description}</Text>
                            </VStack>
                            <Text color="#00ff89" fontWeight="bold">{plan.price}</Text>
                          </Flex>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                )}

                <Button
                  type="submit"
                  bg="#5541ff"
                  color="white"
                  width="full"
                  _hover={{ bg: '#4826d1' }}
                  _active={{ bg: '#3b21b8' }}
                >
                  {isRegister ? 'Launch Your Journey' : 'Embark'}
                </Button>
              </VStack>
            </form>

            <GoogleLogin
              onSuccess={isRegister ? handleGoogleRegister : handleGoogleLogin}
              onError={() => setErrorMessage('Google login/registration failed.')}
              useOneTap
            />

            <Button
              variant="link"
              color="#00ff89"
              onClick={() => {
                setIsRegister(!isRegister);
                setSelectedPlan(null);
                setErrorMessage('');
              }}
              _hover={{ color: '#00cc75' }}
            >
              {isRegister
                ? 'Already have a cosmic account? Sign in'
                : 'New to the galaxy? Create an account'}
            </Button>
          </VStack>
        </MotionBox>
      </Flex>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;
