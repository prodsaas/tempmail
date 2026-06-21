const getDomain = () => {
    try {
        const clientUrl = process.env.CLIENT_URL;
        if (!clientUrl) return "localhost";

        const parsedUrl = new URL(clientUrl);
        return parsedUrl.hostname.toLowerCase();
    }
    catch (error) {
        return "localhost";
    }
};

module.exports = { DOMAIN: getDomain() };