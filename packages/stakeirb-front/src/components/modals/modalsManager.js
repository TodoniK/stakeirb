import Swal from 'sweetalert2'

export const displayErrorModal = (error) => {
  Swal.fire({
    icon: 'error',
    toast: true,
    position: 'bottom',
    title: 'Oops...',
    text: error,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    background: '#203141',
    confirmButtonColor: '#00b894',
    cancelButtonColor: '#e34242',
    color: '#ffffff'
  })
}

export const displaySuccessModal = (message) => {
  Swal.fire({
    icon: 'success',
    toast: true,
    position: 'bottom',
    title: 'Success',
    text: message,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    background: '#203141',
    confirmButtonColor: '#00b894',
    cancelButtonColor: '#e34242',
    color: '#ffffff'
  })
}
