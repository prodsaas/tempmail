import { useState, useEffect } from "react";
import useCreateEmail from "../../hooks/useCreateEmail";
import useMailStore from "../../store/mailStore";

const calculateSeconds = (targetTime) => {
    if (!targetTime) return 0;
    return Math.max(0, Math.floor((new Date(targetTime).getTime() - Date.now()) / 1000));
};

const formatExpiryText = (timeLeft) => {
    if (timeLeft <= 0) return "Email expired. Changing email...";

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const parts = [];

    if (minutes > 0) {
        const unit = minutes === 1 ? (seconds === 0 ? "minute" : "min") : "mins";
        parts.push(`${minutes} ${unit}`);
    }

    if (seconds > 0) {
        const unit = seconds === 1 ? "second" : "seconds";
        parts.push(`${seconds} ${unit}`);
    }

    return `Email will expire in ${parts.join(" ")}`;
};

const EmailCountdown = () => {
    const { createEmail } = useCreateEmail();

    const expiresAt = useMailStore((state) => state.email.expiresAt);

    const [prevExpiresAt, setPrevExpiresAt] = useState(expiresAt);
    const [timeLeft, setTimeLeft] = useState(() => calculateSeconds(expiresAt));

    if (expiresAt !== prevExpiresAt) {
        setPrevExpiresAt(expiresAt);
        setTimeLeft(calculateSeconds(expiresAt));
    }

    useEffect(() => {
        if (!expiresAt) return;

        if (timeLeft <= 0) {
            createEmail();
            return;
        }

        const intervalId = setInterval(() => {
            const secondsLeft = calculateSeconds(expiresAt);
            setTimeLeft(secondsLeft);

            if (secondsLeft <= 0) {
                clearInterval(intervalId);
                createEmail();
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, [expiresAt, timeLeft, createEmail]);

    if (!expiresAt) return null;
    return formatExpiryText(timeLeft);
}

export default EmailCountdown