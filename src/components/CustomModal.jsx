import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const CustomModal = ({
  children,
  open,
  onClose,
  title,
  maxWidth = 'sm',
  fullWidth = true,
  showCloseButton = true,
  className = '',
  disableBackdropClick = false,
  disableEscapeKeyDown = false,
}) => {
  // Handle backdrop click
  const handleBackdropClick = (event) => {
    if (disableBackdropClick) {
      event.stopPropagation();
      return;
    }
    if (onClose) {
      onClose(event);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      className={className}
      onBackdropClick={handleBackdropClick}
      disableEscapeKeyDown={disableEscapeKeyDown}
    >
      {/* Title section with optional close button */}
      {title && (
        <DialogTitle
          sx={{
            m: 0,
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {title}
          {showCloseButton && (
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
      )}

      {/* Content section */}
      <DialogContent dividers>
        {children}
      </DialogContent>
    </Dialog>
  );
};


export default CustomModal;