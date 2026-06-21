const getCookie = (req) => {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) return undefined;

    const cookie = cookieHeader.split(";").find(c => c.trim().startsWith("emailId="));
    if (!cookie) return undefined;

    const parts = cookie.split("=");
    return parts[1] ? parts[1].trim() : undefined;
};

const setCookie = (res, emailId, ttlInSeconds) => {
    res.cookie("emailId", emailId, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: ttlInSeconds * 1000
    });
};

module.exports = { getCookie, setCookie };