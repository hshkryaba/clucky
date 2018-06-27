import { StyleSheet } from 'aphrodite/no-important';

export default StyleSheet.create({
  formWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '500px',
    marginBottom: '20px',
  },
  formRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '10px',
  },
  formLabel: {
    width: '100px',
    marginRight: '20px',
  },
  formField: {
    flex: '1',
    padding: '3px 5px',
    background: '#ffffff',
  },
  formButton: {
    marginBottom: '10px',
    padding: '5px 10px',
    background: '#ffffff',
    border: '2px solid #000000',
    borderRadius: '5px',
  },
  statusMsg: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    color: '#6c6c6c',
  },
});
