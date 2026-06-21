import "./styles.css";
import useMailStore from "../../store/mailStore";

const Navbar = () => {
    const emailLoading = useMailStore((state) => state.email.loading);
    const emailAddress = useMailStore((state) => state.email.address);
    const search = useMailStore((state) => state.search);
    const setSearch = useMailStore((state) => state.setSearch);

    const searchDisabled = emailLoading || !emailAddress;

    const handleSidebarOpen = (e) => {
        if (window.location.hash === "#sidebar") {
            e.preventDefault();
            window.location.hash = "";
        }
    };

    return (
        <header>
            <div className="brand">
                <a
                    href="#sidebar"
                    className="menu"
                    onClick={handleSidebarOpen}
                >
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M22 17v2H2v-2zm0-6v2H2v-2zm0-6v2H2V5z" /></svg>
                </a>
                <div className="logo">
                    <img src="/logo.png" alt="" />
                    <p>TempMail</p>
                </div>
            </div>

            <label
                htmlFor="mail"
                className="search"
                data-disabled={searchDisabled}
            >
                <button disabled={searchDisabled}>
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="m16.32 14.906 5.387 5.387-1.414 1.414-5.387-5.387a8 8 0 1 1 1.414-1.414M10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12" /></svg>
                </button>
                <input
                    id="mail"
                    disabled={searchDisabled}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={emailLoading ? "" : !emailAddress ? "Failed to create email" : "Search in mail"}
                />
                {search && (
                    <button onClick={() => setSearch("")}>
                        <svg viewBox="-28 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m64 388 132-132L64 124l32-32 132 132L360 92l32 32-132 132 132 132-32 32-132-132L96 420z" /></svg>
                    </button>
                )}
            </label>
        </header>
    )
}

export default Navbar