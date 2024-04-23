import React, { useEffect } from 'react';
import Queen from "./components/queen";

const App = () => {
    useEffect(() => {
        // Logic similar to componentDidMount
        // console.log(window.innerHeight, " ", window.innerWidth);
    }, []); // Empty dependency array means this effect runs only once after the component mounts

    return (
        <Queen />
    );
};

export default App;
