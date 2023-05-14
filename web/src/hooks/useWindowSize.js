// CUSTOM HOOKS for Window resize
import { useState, useEffect } from 'react';
// define object useWindowSize
const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({ 
                width: window.innerWidth,
                height: window.innerHeight
            })
        }

        handleResize();
        
        window.addEventListener("resize", handleResize); //Appends an event listener for events whose type attribute value is type. 

        const cleanUp = () => {
            window.removeEventListener("resize", handleResize);
        }

        return cleanUp; // return cleanUp to remove the eventListener
    }, []) // run at load time, so no dependency

    return windowSize
}

export default useWindowSize