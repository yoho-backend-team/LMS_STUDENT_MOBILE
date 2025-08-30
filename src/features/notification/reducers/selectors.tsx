export const selectNotifications = (state: any) =>
  state.NotificationSlice?.data ?? []; // ✅ ensure array, not undefined
