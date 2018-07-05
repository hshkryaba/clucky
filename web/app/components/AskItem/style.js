import { StyleSheet } from 'aphrodite/no-important';

export default StyleSheet.create({
  formItem: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    boxSizing: 'border-box',
    padding: '5px 10px',
    marginBottom: '20px',
    background: '#ffffff',
  },
  formSelect: {
    appearance: 'none',
    cursor: 'pointer',
  },
  selectOption: {
    ':disabled': {
      color: '#cccccc',
    },
  },
  textArea: {
    minHeight: '100px',
    maxHeight: '100px',
  },
  formSubmit: {
    justifyContent: 'center',
    backgroundColor: '#ffbe6f',
    color: '#ffffff',
    cursor: 'pointer',
  },
  statusMsg: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    color: '#6c6c6c',
  },
});
