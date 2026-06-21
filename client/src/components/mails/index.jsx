import "./styles.css";
import { useState, useMemo } from "react";
import useCreateEmail from "../../hooks/useCreateEmail";
import useChangeEmail from "../../hooks/useChangeEmail";
import useFetchMails from "../../hooks/useFetchMails";
import useMailStore from "../../store/mailStore";
import EmailCountdown from "./countdown";
import Skeleton from "../skeleton";

const Mails = () => {
    const { createEmail } = useCreateEmail();
    const { changeEmail } = useChangeEmail();
    const { fetchMails } = useFetchMails(5000);

    const emailLoading = useMailStore((state) => state.email.loading);
    const emailAddress = useMailStore((state) => state.email.address);
    const mailsLoading = useMailStore((state) => state.mails.loading);
    const mailsData = useMailStore((state) => state.mails.data);
    const search = useMailStore((state) => state.search);
    const setSearch = useMailStore((state) => state.setSearch);

    const [mail, setMail] = useState(null);

    const copyEmail = () => {
        if (!emailAddress) return;
        navigator.clipboard.writeText(emailAddress)
            .then(() => alert("Email copied to clipboard!"))
            .catch(err => console.error(err));
    };

    const filteredMails = useMemo(() => {
        const searchQuery = search.toLowerCase().trim();
        if (!searchQuery) return mailsData;

        return mailsData.filter(m =>
            (m.from_name && m.from_name.toLowerCase().includes(searchQuery)) ||
            (m.from_email && m.from_email.toLowerCase().includes(searchQuery)) ||
            (m.subject && m.subject.toLowerCase().includes(searchQuery)) ||
            (m.text && m.text.toLowerCase().includes(searchQuery)) ||
            (m.html && m.html.toLowerCase().includes(searchQuery))
        );
    }, [mailsData, search]);

    return (
        <main>
            <div className="info">
                <div className="email">
                    {emailLoading ? <Skeleton />
                        : emailAddress ? emailAddress
                            : "Failed to create email."}
                </div>
                <div className="countdown">
                    {emailLoading ? <Skeleton />
                        : emailAddress ? <EmailCountdown />
                            : "Reload again!"}
                </div>
                <div className="actions">
                    {emailLoading ? (
                        <>
                            <Skeleton />
                            <Skeleton />
                            <Skeleton />
                        </>
                    ) : (
                        <>
                            <button onClick={() => {
                                if (emailAddress) {
                                    setMail(null);
                                    setSearch("");
                                    changeEmail();
                                }
                                else createEmail();
                            }}>
                                {emailAddress ? "Change" : "Create"} Email
                            </button>
                            <button disabled={!emailAddress} onClick={copyEmail}>
                                Copy Email
                            </button>
                            <button disabled={!emailAddress} onClick={() => fetchMails(false)}>
                                Refresh Mails
                            </button>
                            {!!mail && (
                                <button onClick={() => {
                                    setMail(null);
                                    setSearch("");
                                }}>
                                    Back to Inbox
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>

            <div className="detail">
                {!mail ? (
                    <div className="mails">
                        {emailLoading || mailsLoading ? (
                            <p className="placeholder">
                                Fetching all mails...
                            </p>
                        ) : filteredMails.length > 0 ? (
                            filteredMails.map(m => (
                                <button
                                    key={m.id}
                                    className="mail-btn"
                                    onClick={() => setMail(m)}
                                >
                                    <span>{m.from_name || m.from_email}</span>
                                    <span>{m.subject}{` - ${m.text || m.html}`}</span>
                                    <span className="timestamp">
                                        {formatTimestamp(m.received_at)}
                                    </span>
                                </button>
                            ))
                        ) : mailsData.length > 0 && filteredMails.length === 0 ? (
                            <p className="placeholder">
                                No matching results found
                                <span>Try searching for another keyword.</span>
                            </p>
                        ) : (
                            <p className="placeholder">
                                Your inbox is empty
                                <span>Waiting for incoming mails...</span>
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="mail">
                        <div className="mail-body">
                            <h2>{mail.subject || "(No Subject)"}</h2>
                            <div className="metadata">
                                <div className="from">
                                    <span>From</span>
                                    <span>{mail.from_name}</span>
                                    <span>{mail.from_email}</span>
                                </div>
                                <div className="to">
                                    <span>To</span>
                                    <span>{emailAddress}</span>
                                </div>
                            </div>
                            <span className="timestamp">
                                {formatTimestamp(mail.received_at)}
                            </span>
                            <hr />
                            {mail.html ? (
                                <div dangerouslySetInnerHTML={{ __html: mail.html }} />
                            ) : (
                                <div style={{ whiteSpace: "pre-wrap" }}>{mail.text}</div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}

const formatTimestamp = (ISO) => {
    try {
        if (!ISO) return "";
        const date = new Date(ISO);
        return new Intl.DateTimeFormat(undefined, {
            dateStyle: "medium",
            timeStyle: "medium",
        }).format(date);
    }
    catch {
        return ISO;
    }
}

export default Mails