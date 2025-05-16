import React from "react";
import { Modal, Box, TextField, Typography } from "@mui/material";

interface EditModalProps {
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

const EditModal: React.FC<EditModalProps> = ({
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
        <button
          type="button"
          className="bg-[#F7B32B] text-white px-4 py-2 rounded-md hover:bg-[#e6a027] transition w-full"
          onClick={handleSubmit}
        >
          Update
        </button>
      </Box>
    </Modal>
  );
};

export default EditModal; 