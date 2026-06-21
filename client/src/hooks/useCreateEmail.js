import { useRef, useCallback } from "react";
import useMailStore from "../store/mailStore";

export default function useCreateEmail() {
    const setEmailLoading = useMailStore((state) => state.setEmailLoading);
    const setEmailData = useMailStore((state) => state.setEmailData);

    const isCreatingRef = useRef(false);

    const createEmail = useCallback(async () => {
        if (isCreatingRef.current) return;
        isCreatingRef.current = true;
        setEmailLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/create-email`, { credentials: "include" });
            if (!response.ok) {
                throw new Error(`API Error ${response.status}`);
            }
            const data = (await response.json());

            setEmailData(data.emailAddress, data.expiresAt);
        }
        catch (error) {
            console.error(error);
            setEmailData(null, null);
        }
        finally {
            setEmailLoading(false);
            isCreatingRef.current = false;
        }
    }, [setEmailLoading, setEmailData]);

    return { createEmail };
}