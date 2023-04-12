import IconError from "./IconError";
import IconWarning from "./IconWarning";
import IconInfo from "./IconInfo";
import IconNotification from "./IconNotification";


const icons = {
    error: IconError,
    warning: IconWarning,
    notification: IconNotification,
    info: IconInfo,
    addCircle: IconAddCircle
};

function Icon({ variant, className }) {
    const CurrentIcon = icons[variant];

    if (!CurrentIcon){
        throw new Error(`Icon: unknown variant '${variant}`);
    }
    return (
        <CurrentIcon className={className}/>
    );
}

export default Icon;