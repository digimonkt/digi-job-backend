import jsonwebtoken from 'jsonwebtoken';

const verifyToken = async (req, res, next) => {
    const token = req.params.token || req.headers['x-access-token']
    console.log(token)
    if (!token) return res.status(401).json({ status: "error", message: "Access Denied" });
    try {
        const verified = jsonwebtoken.verify(token, process.env.TOKEN_HEADER_KEY);
        console.log(verified);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: "Invalid Token"
        });
    }
}

export default verifyToken;