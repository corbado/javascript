const en = {
  passkeysList: {
    warning_notLoggedIn: 'Please log in to see your passkeys.',
    message_noPasskeys: "You don't have any passkeys yet.",
    button_createPasskey: 'You can create passkeys here.',
    badge_synced: 'Synced',
    field_credentialId: 'ID: ',
    field_created: 'Created: {{date}} with {{browser}} on {{os}}',
    field_lastUsed: 'Last used: ',
    field_status: 'Status of Passkey: ',
    dialog_delete: {
      header: 'Delete Passkey',
      body: 'Are you sure you want to delete this passkey?',
      button_cancel: 'Cancel',
      button_confirm: 'Yes, delete',
    },
    dialog_passkeyAlreadyExists: {
      header: 'Passkey already exists',
      body: 'A passkey for this device already exists. If you are facing issues with your passkey, please delete it and create a new one.',
      button_confirm: 'Ok',
    },
  },
};

export default en;
