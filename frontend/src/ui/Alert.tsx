import React, {Dispatch, SetStateAction, useState} from 'react';
import Icon from "./Icon";

export default function Alert({type, onDisappear, children}: { type: string, onDisappear: Dispatch<SetStateAction<string>>,children: any }) {
    const [close, setClose] = useState(false)
    let className: string = 'alert alert-' + type

    if (close) {
        className += '  alert-out'
        // Reset message state
        setTimeout(() => {
            onDisappear("")
        }, 500)
    }

    return (
        <div className={className}>
            {type === "danger" ? (
                <Icon name="warning" size="12"/>
            ): null}
            <div>{children}</div>
            <button className="alert-close" onClick={() => setClose(true)}>
                <Icon name="cross" size="12"/>
            </button>
        </div>
    );
}