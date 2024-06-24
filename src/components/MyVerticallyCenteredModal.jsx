import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import '../../src/Admin.css'

function MyVerticallyCenteredModal(props) {
  const { logout } = props;

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      bg="dark"
      data-bs-theme="dark"
      className="admin-logout-modal"
      style={{fontFamily: "fantasy"}}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter" style={{color: "white"}}>
          Logging out ...
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          paddingTop: '5%'
        }}>
          <p style={{fontSize: "124%", color: "white"}}>
            Are you sure you want to log out?
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer className='mt-2' style={{padding: "1rem 1rem 0 0"}}>
        <Button onClick={logout} variant='primary'>Confirm</Button>
        <Button onClick={props.onHide} variant='danger'>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MyVerticallyCenteredModal;