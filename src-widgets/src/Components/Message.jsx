import React from "react";
import { Box, Typography } from "@mui/material";

const styles = {
    message: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
    },
};

const Message = ({ message }) => (
    <Box sx={styles.message}>
        <Typography variant="body2" component="p">{message}</Typography>
    </Box>
);

export { Message };
