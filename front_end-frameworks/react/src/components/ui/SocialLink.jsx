function SocialLink({ href, label, icon }) {
    return (
        <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
            <i className={`bi ${icon} text-2xl`} aria-hidden="true">
            </i>
        </a>
    );
}

export default SocialLink;