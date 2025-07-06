import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useContext, useState } from "react";
import AppContext from "../../../../../store/AppContext";
import { Box, Button, Divider } from '@mui/material';
import EmailModal from '../Email/EmailModal';

export default function SettingsModal({
    open,
    handleClose,
}) {
    const [resetEmailOpen, setResetEmailOpen] = useState(false);

    const { theme, setTheme } = useContext(AppContext);

    const handleChange = (event, newTheme) => {
        setTheme(newTheme)
    };

    const handleResetEmailClicked = () => {
        setResetEmailOpen(true);
    }

    const handleResetEmailClose = () => {
        setResetEmailOpen(false);
    }

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
                <Typography id="modal-modal-title" variant="h5">
                    Paramètres
                </Typography>

                <Divider sx={{ py: "2px" }}/>

                {/* Content */}
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "25px",
                    py: "10px"
                }}>
                    {/* Theme */}
                    <Box>
                        <Typography variant="subtitle1">Theme</Typography>
                        <ToggleButtonGroup
                            color="primary"
                            value={theme}
                            exclusive
                            onChange={handleChange}
                            aria-label="Themes"
                            fullWidth
                            size='small'
                        >
                            <ToggleButton value="light">light</ToggleButton>
                            <ToggleButton value="dark">dark</ToggleButton>
                            <ToggleButton value="blind">colorblind</ToggleButton>
                        </ToggleButtonGroup>
                    </Box>

                    {/* Theme */}
                    <Box>
                        <Typography variant="subtitle1">Compte</Typography>

                        <Button size='small' onClick={handleResetEmailClicked}>
                            Reset Email
                        </Button>

                        <EmailModal open={resetEmailOpen} handleClose={handleResetEmailClose}/>
                    </Box>
                </Box>
            </Box>

        </Modal>
    )
}