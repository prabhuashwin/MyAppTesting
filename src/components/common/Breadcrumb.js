import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Breadcrumb.css';

const Breadcrumb = ({ title, additionalCrumbs }) => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    const getBreadcrumbName = (pathname) => {
        switch (pathname) {
            case 'qndata':
                return 'QN Data';
            case 'components':
                return 'Components';
            case 'programs':
                return 'Programs';
            case 'about':
                return 'About';
            case 'contact':
                return 'Contact';
            default:
                return pathname.charAt(0).toUpperCase() + pathname.slice(1);
        }
    };

    return (
        <nav className="breadcrumb">
            <Link to="/">Home</Link>
            {additionalCrumbs && additionalCrumbs.map((crumb, index) => (
                <span key={index}>
                    {' > '}
                    <Link to={crumb.path}>{crumb.name}</Link>
                </span>
            ))}
            {pathnames.map((value, index) => {
                const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                const breadcrumbName = getBreadcrumbName(value);
                return (
                    <span key={to}>
                        {' > '}
                        {index === pathnames.length - 1 ? (
                            <span>{breadcrumbName}</span>
                        ) : (
                            <Link to={to}>{breadcrumbName}</Link>
                        )}
                    </span>
                );
            })}
        </nav>
    );
};

export default Breadcrumb;