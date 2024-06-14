import { createSubject } from "./subjects/withMultipleSubscribers";

export const createPollStream = (path) => {
    const { next, error, complete, stream$ } = createSubject();

    const fetchLoop = () => {
        window.fetch(path)
            .then(response => response.json())
            .then(json => next(json))
            .catch(e => {
                error(e);
            })
            .then(() => {
                setTimeout(fetchLoop, 100);
            });
    }

    setTimeout(fetchLoop, 100);

    return stream$;
};
