import rateLimit from 'express-rate-limit';

export const limitadorIPsCliente = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 minute
	max: 5, // Limit each IP to 5 requests per `window` (here, per 1 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {message: 'Solo puedes hacer 5 peticiones cada minuto'},
    
});

// Apply the rate limiting middleware to all requests