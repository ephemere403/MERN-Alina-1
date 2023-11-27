export const MySkeleton = ({ title }) => {
    return (
        <div className="skeleton">
            {title && <h6 className="skeleton-title">{title}</h6>}
            <img className="skeleton-img" src='https://websiteconf.neocities.org/underconstruction.gif' alt="wait a second..."/>
        </div>
    );
};
