import React from "react";
import { Modal, Box, TextField, Button, Typography } from "@mui/material";

interface AddModalProps {
  open: boolean;
  handleClose: () => void;
  handleSubmit: () => void;
  title: string;
  fields: {
    name: string;
    label: string;
    value: string;
  }[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AddModal: React.FC<AddModalProps> = ({
  open,
  handleClose,
  handleSubmit,
  title,
  fields,
  handleChange,
}) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
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
        }}
      >
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {title}
        </Typography>
        {fields.map((field) => (
          <TextField
            key={field.name}
            fullWidth
            label={field.label}
            name={field.name}
            value={field.value}
            onChange={handleChange}
            margin="normal"
          />
        ))}
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    </Modal>
  );
};

export default AddModal;
