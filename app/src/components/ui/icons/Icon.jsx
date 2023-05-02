import IconError from "./IconError";
import IconWarning from "./IconWarning";
import IconInfo from "./IconInfo";
import IconNotification from "./IconNotification";
import IconAddCircle from "./IconAddCircle"
import IconPosition from "./IconPosition";

const icons = {
    error: IconError,
    warning: IconWarning,
    notification: IconNotification,
    info: IconInfo,
    addCircle: IconAddCircle,
    position: IconPosition,
};

function Icon({ 
    variant, 
    className,
    iconColor = "black",
    onClick = () => {} 
}) {
    const CurrentIcon = icons[variant];

    if (!CurrentIcon){
        throw new Error(`Icon: unknown variant '${variant}`);
    }
    return (
        <CurrentIcon className={className} onClick={onClick} iconColor={iconColor}/>
    );
}

export default Icon;