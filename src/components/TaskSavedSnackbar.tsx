import { Button, Snackbar } from '@mui/material';
import { useState } from 'react';

import type { SnackbarCloseReason } from '@mui/material';
import type { SyntheticEvent } from 'react';

const SAVED_NOTICE_DURATION_MS = 4000;

interface TaskSavedSnackbarProps {
  savedCount: number;
}

// TaskSavedSnackbar muestra el aviso «Tarea guardada» cada vez que aumenta savedCount.
function TaskSavedSnackbar({ savedCount }: TaskSavedSnackbarProps) {
  const [closedCount, setClosedCount] = useState(0);
  const isOpen = savedCount > closedCount;

  // closeNotice oculta el aviso del ultimo guardado.
  function closeNotice(): void {
    setClosedCount(savedCount);
  }

  // handleClose cierra el aviso salvo con un clic fuera, para que no desaparezca antes de leerlo.
  function handleClose(
    _event: SyntheticEvent | Event,
    reason: SnackbarCloseReason,
  ): void {
    if (reason !== 'clickaway') {
      closeNotice();
    }
  }

  return (
    <Snackbar
      action={
        <Button color="inherit" onClick={closeNotice} size="small">
          OK
        </Button>
      }
      autoHideDuration={SAVED_NOTICE_DURATION_MS}
      key={savedCount}
      message="Tarea guardada"
      onClose={handleClose}
      open={isOpen}
    />
  );
}

export default TaskSavedSnackbar;
