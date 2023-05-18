import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useContext } from "react";
import AppContext from "../../../../store/AppContext";
import { Box } from '@mui/material';

export default function SettingsModal({
    open, 
    handleClose,
}) {
    const { theme, setTheme } = useContext(AppContext);

    const handleChange = (event, newTheme) => {
        setTheme(newTheme)
    };

    return (
        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
    >
        <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 5,
            p: 4,
            width: {
                xl: 400,
                lg: 400,
                sm: "50vw"
            }
        }}>
            <Typography id="modal-modal-title" variant="h5" component="h2">
                Paramètres
            </Typography>
            <ToggleButtonGroup
                color="primary"
                value={theme}
                exclusive
                onChange={handleChange}
                aria-label="Themes"
            >
                <ToggleButton value="light">light</ToggleButton>
                <ToggleButton value="dark">dark</ToggleButton>
                <ToggleButton value="blind">blind</ToggleButton>
            </ToggleButtonGroup>
        </Box>
    </Modal>
    )
}