import ReactGA from "./analytics";

export const trackEvent = (eventName, params = {}) => {
  ReactGA.event(eventName, params);
};