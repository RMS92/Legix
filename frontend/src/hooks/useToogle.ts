import {useCallback, useState} from "react";

export function useToggle(initial = false): [boolean, () => void] {
    const [state, setState] = useState(initial);
    const toogle = useCallback(() => {
        setState((n) => !n);
    }, [setState]);

    return [
        state,
        toogle
    ];
}