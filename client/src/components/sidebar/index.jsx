import "./styles.css";

const Sidebar = () => {
    const handleSidebarClose = (e) => {
        const target = e.target;
        if (target.tagName === "ASIDE" || target.closest("a")) {
            window.location.hash = "";
        }
    };

    return (
        <aside
            id="sidebar"
            onClick={handleSidebarClose}
        >
            <div className="sidebar">
                <div className="logo">
                    <img src="/logo.png" alt="" />
                    <p>TempMail</p>
                </div>
                <a href="/" className="active">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.304 6.132A4 4 0 0 1 7.209 3h9.582a4 4 0 0 1 3.905 3.132l.147.662a24 24 0 0 1 0 10.412l-.147.662A4 4 0 0 1 16.791 21H7.21a4 4 0 0 1-3.905-3.132l-.147-.662a24 24 0 0 1 0-10.412z" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M2.5 13h6.338c0 1 .973 3 3.405 3s3.406-2 3.406-3H21.5" stroke="#000" strokeWidth="1.5" strokeLinejoin="round" /></svg>
                    <p>Inbox</p>
                </a>
                <a href="https://github.com/prodsaas/tempmail">
                    <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"><path d="M5.75 14.25s-.5-2 .5-3c0 0-2 0-3.5-1.5s-1-4.5 0-5.5c-.5-1.5.5-2.5.5-2.5s1.5 0 2.5 1c1-.5 3.5-.5 4.5 0 1-1 2.5-1 2.5-1s1 1 .5 2.5c1 1 1.5 4 0 5.5s-3.5 1.5-3.5 1.5c1 1 .5 3 .5 3m-5-.5c-1.5.5-3-.5-3.5-1" /></svg>
                    <p>GitHub</p>
                </a>
            </div>
        </aside>
    )
}

export default Sidebar