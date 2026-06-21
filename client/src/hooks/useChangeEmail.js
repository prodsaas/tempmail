import { useRef, useCallback } from "react";
import useMailStore from "../store/mailStore";

export default function useChangeEmail() {
    const setEmailLoading = useMailStore((state) => state.setEmailLoading);
    const setEmailData = useMailStore((state) => state.setEmailData);
    const setMailsData = useMailStore((state) => state.setMailsData);

    const isChangingRef = useRef(false);

    const changeEmail = useCallback(async () => {
        if (isChangingRef.current) return;
        isChangingRef.current = true;
        setEmailLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/change-email`, { credentials: "include" });
            if (!response.ok) {
                throw new Error(`API Error ${response.status}`);
            }
            const data = (await response.json());

            setEmailData(data.emailAddress, data.expiresAt);
            setMailsData([]);
        }
        catch (error) {
            console.error(error);
            setEmailData(null, null);
            setMailsData([]);
        }
        finally {
            setEmailLoading(false);
            isChangingRef.current = false;
        }
    }, [setEmailLoading, setEmailData, setMailsData]);

    return { changeEmail };
}