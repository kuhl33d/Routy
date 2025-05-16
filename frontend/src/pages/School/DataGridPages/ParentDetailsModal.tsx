import React from "react";
import {
  Modal,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

interface ParentDetailsModalProps {
  open: boolean;
  handleClose: () => void;
  parents: Array<{
    name?: string;
    email?: string;
    phoneNumber?: string[];
  }>;
}

const ParentDetailsModal: React.FC<ParentDetailsModalProps> = ({
  open,
  handleClose,
  parents,
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
          Parent Details
        </Typography>
        <List>
          {parents.map((parent, index) => (
            <div key={index}>
              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                Parent {index + 1}
              </Typography>
              <ListItem>
                <ListItemText
                  primary={`Name: ${parent.name || "N/A"}`}
                  secondary={`Email: ${parent.email || "N/A"}`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Phone Numbers"
                  secondary={
                    parent.phoneNumber?.join(", ") ||
                    "No phone numbers available"
                  }
                />
              </ListItem>
            </div>
          ))}
        </List>
      </Box>
    </Modal>
  );
};

export default ParentDetailsModal;
