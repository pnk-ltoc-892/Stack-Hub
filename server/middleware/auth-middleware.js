import jwt from 'jsonwebtoken'

// export const authMiddleware = async (req, res, next) => {
//     try {
        
//         const token = req.cookies.token
//         // const token = req.cookies.token || "notoken"
//         // console.log(token);
//         if(!token){
//             ! Where Is Return Statement 
//             res.status(401).json({
//                 success: false,
//                 message: "Unauthorised user!",
//             });
//         }
//         const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
//         req.user = decodedToken // Better thing, verification if token id decoding
//         next()
//     }
//     catch (error) {
//         console.log("Error While Authenticating User\n Error: ", error);
//         res.status(401).json({
//             success: false,
//             message: "Unauthorised user!",
//         });
//     }
// }

export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token || "";

        // Check if token exists
        if (!token) {
            return res.status(201).json({
                success: false,
                message: "Unauthorized user!",
            });
        }

        // Verify token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedToken;  // Attach decoded token data to request

        // ! await helped with an error - no it was missing return statement at token check
        await next(); // Proceed to the next middleware or route handler
    } 
    catch (error) {
        console.log("Error While Authenticating User\nError:", error);

        // Send error response only once
        return res.status(401).json({
            success: false,
            message: "Unauthorized user!",
        });
    }
};
