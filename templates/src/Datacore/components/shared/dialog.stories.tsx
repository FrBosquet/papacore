import { Dialog, useDialog } from './dialog'

export const DialogStories = () => {
  const basicDialog = useDialog()
  const withIconDialog = useDialog()
  const customDialog = useDialog()

  return (
    <>
      <h2>Basic Dialog:</h2>
      <div className="flex items-center gap-2">
        <Dialog
          title="Basic Dialog"
          dialogRef={basicDialog.ref}
          triggerProps={{ variant: 'default' }}
        >
          <p>This is a basic dialog with a title.</p>
          <p>Click outside or press Escape to close.</p>
        </Dialog>
      </div>

      <h2>Dialog with Icon:</h2>
      <div className="flex items-center gap-2">
        <Dialog
          title="Settings"
          icon="settings"
          dialogRef={withIconDialog.ref}
          triggerProps={{ variant: 'secondary', icon: 'settings' }}
        >
          <p>This dialog has an icon in the header.</p>
          <div className="flex flex-col gap-2 pt-2">
            <button
              className="bg-theme-accent text-primary-950 px-2 py-1 rounded"
              onClick={() => withIconDialog.close()}
            >
              Save Settings
            </button>
          </div>
        </Dialog>
      </div>

      <h2>Custom Trigger Label:</h2>
      <div className="flex items-center gap-2">
        <Dialog
          title="Confirmation"
          icon="alert-circle"
          dialogRef={customDialog.ref}
          triggerProps={{
            variant: 'warning',
            label: 'Delete Item',
            icon: 'trash',
          }}
        >
          <p>Are you sure you want to delete this item?</p>
          <p className="text-red-400">This action cannot be undone.</p>
          <div className="flex gap-2 pt-4">
            <button
              className="bg-red-700 text-red-300 px-3 py-1 rounded hover:bg-red-500"
              onClick={() => {
                customDialog.close()
                // Handle delete
              }}
            >
              Delete
            </button>
            <button
              className="bg-primary-800 text-white px-3 py-1 rounded hover:bg-primary-700"
              onClick={() => customDialog.close()}
            >
              Cancel
            </button>
          </div>
        </Dialog>
      </div>

      <h2>Programmatic Control:</h2>
      <div className="flex items-center gap-2">
        <button
          className="bg-theme-accent text-primary-950 px-2 py-1"
          onClick={() => basicDialog.open()}
        >
          Open Basic Dialog
        </button>
        <button
          className="bg-theme-contrast text-white px-2 py-1"
          onClick={() => withIconDialog.open()}
        >
          Open Settings Dialog
        </button>
      </div>
    </>
  )
}
