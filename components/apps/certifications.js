import React, { Component } from 'react';

export class Certifications extends Component {
    render() {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-black bg-opacity-90 text-white select-none p-6 overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4 text-ubt-gedit-orange">Certifications</h2>
                <p className="text-sm leading-relaxed font-light text-center">
                    I don't believe in certifications, and I'll never understand why most people put them on a pedestal.
                    If you have something, share your screen, open your IDE, and show me. Easy peasy.
                </p>
            </div>
        )
    }
}

export default Certifications;

export const displayCertifications = () => {
    return <Certifications> </Certifications>;
}
