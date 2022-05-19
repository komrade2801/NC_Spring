export const closeBookingModal = () => {
  $('#parkingModal').modal('close');
};

export const openBookingModal = () => {
  $('#parkingModal').modal({
    dismissible: false,
    opacity: 0.9,
  });
  $('#parkingModal').modal('open');
};
