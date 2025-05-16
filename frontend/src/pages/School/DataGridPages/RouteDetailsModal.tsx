import React from "react";
import {
  Modal,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

interface RouteDetailsModalProps {
  open: boolean;
  handleClose: () => void;
  route: Route | null;
}

const RouteDetailsModal: React.FC<RouteDetailsModalProps> = ({
  open,
  handleClose,
  route,
}) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: "8px",
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Route Details
        </Typography>
        {route && (
          <>
            <Typography variant="body1" gutterBottom>
              <strong>Route Name:</strong> {route.name}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Start Location:</strong> {route.startLocation}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>End Location:</strong> {route.endLocation}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Buses:</strong>
            </Typography>
            <List>
              {route.buses.map((bus, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`Bus ${index + 1}: ${bus.busNumber}`}
                    secondary={
                      bus.driver
                        ? `Driver: ${bus.driver.name} (${bus.driver.contact})`
                        : "No driver assigned"
                    }
                  />
                </ListItem>
              ))}
            </List>
            <Typography variant="body1" gutterBottom>
              <strong>Stops:</strong>
            </Typography>
            <List>
              {route.stops.map((stop, index) => (
                <ListItem key={index}>
                  <ListItemText primary={`Stop ${index + 1}: ${stop}`} />
                </ListItem>
              ))}
            </List>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default RouteDetailsModal;
