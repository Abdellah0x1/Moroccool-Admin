import React from "react";

const MOBILE_BREAKPOINT = 768;


function getSnapShot() {
    return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`).matches
}

function subscribe(callback: () => void) {
    const mq1 = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    mq1.addEventListener("change", callback);

    return () => mq1.removeEventListener("change", callback)
}


export function useIsMobile() {
    return React.useSyncExternalStore(subscribe, getSnapShot, () => false)
}