const jwt=require('jsonwebtoken');

const jwtAuthMiddleware = (req, res, next) => {
    // Extract the JWT token from the request header.
    const token = req.headers.authorization.split(' ')[1];
    if (!token) return res.status(401).json({message: "Unauthorized"});

    try {
        // Verify the jwt token.
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded);
        // Attach the user info to the request object.
        req.user = decoded.user; // req.userPayload
        //console.log(req.user);
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({message: "Invalid token"});
    }
}

// Function to generate JWT token
const generateToken = (userData) => {
    console.log("Token payload:", { user: userData });
    return jwt.sign({user: userData}, process.env.JWT_SECRET, { expiresIn: '5h' });
}

module.exports={jwtAuthMiddleware,generateToken};